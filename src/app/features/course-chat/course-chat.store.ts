import { inject } from '@angular/core';

import { ChatHubService } from '@Core/services/chat-hub.service';
import { AuthService } from '@Features/auth/auth.service';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import {
  setError,
  setFulfilled,
  setPending,
  withRequestStatus,
} from '@StoreFeatures/with-request-status.feature';
import { Subscription } from 'rxjs';

import { CourseChatRoom, Message } from '@shared/models/chat/chat.model';
import { ChatService } from '@shared/services/chat.service';

interface CourseChatState {
  selectedCourseId: string | null;
  currentRoom: CourseChatRoom | null;
  messages: Message[];
  replyingTo: Message | null;
  userId: string;
  isConnected: boolean;
}

const initialState: CourseChatState = {
  selectedCourseId: null,
  currentRoom: null,
  messages: [],
  replyingTo: null,
  userId: '',
  isConnected: false,
};

export const CourseChatStore = signalStore(
  withState<CourseChatState>(initialState),
  withRequestStatus(),
  withMethods(
    (
      store,
      chatService = inject(ChatService),
      authService = inject(AuthService),
      chatHubService = inject(ChatHubService),
    ) => {
      let _hubSubs: Subscription[] = [];

      const cleanupHub = () => {
        _hubSubs.forEach((s) => s.unsubscribe());
        _hubSubs = [];
      };

      const watchHubEvents = () => {
        cleanupHub();
        _hubSubs = [
          chatHubService.messageReceived$.subscribe((msg) => {
            patchState(store, (state) => ({ messages: [...state.messages, msg] }));
          }),
          chatHubService.reactionReceived$.subscribe((react) => {
            patchState(store, (state) => ({
              messages: state.messages.map((msg) => {
                if (msg.id !== react.messageId) return msg;
                const existingIdx = msg.reacts.findIndex((r) => r.id === react.id);
                const updatedReacts = [...msg.reacts];
                if (existingIdx > -1) {
                  updatedReacts[existingIdx] = react;
                } else {
                  updatedReacts.push(react);
                }
                return { ...msg, reacts: updatedReacts };
              }),
            }));
          }),
          chatHubService.reactionRemoved$.subscribe((react) => {
            patchState(store, (state) => ({
              messages: state.messages.map((msg) => {
                if (msg.id !== react.messageId) return msg;
                return { ...msg, reacts: msg.reacts.filter((r) => r.id !== react.id) };
              }),
            }));
          }),
        ];
      };

      return {
        init(courseId: string | null): void {
          const user = authService.currentUser();
          patchState(store, {
            selectedCourseId: courseId,
            userId: user?.id ?? '',
            currentRoom: null,
            messages: [],
            replyingTo: null,
            isConnected: false,
          });

          if (courseId) {
            this.loadChatRoom(courseId);
          } else {
            chatHubService.stopConnection();
          }
        },

        async loadChatRoom(courseId: string): Promise<void> {
          patchState(store, setPending('loadChatRoom'));
          this.cancelReply();

          chatService.getChatRoomData(courseId).subscribe({
            next: async (room) => {
              patchState(store, { currentRoom: room, messages: room.messages });
              patchState(store, setFulfilled('loadChatRoom'));

              try {
                await chatHubService.startConnection(room.id);
                patchState(store, { isConnected: true });
                watchHubEvents();
              } catch (err) {
                console.error('Failed to connect to SignalR:', err);
                patchState(store, { isConnected: false });
              }
            },
            error: (err) => {
              console.error('Failed to load chatroom:', err);
              patchState(store, setError('loadChatRoom', 'Failed to load chatroom'));
            },
          });
        },

        async sendChatMessage(text: string): Promise<void> {
          const roomId = store.currentRoom()?.id;
          const replyId = store.replyingTo()?.id ?? null;
          if (!text || !roomId) return;

          try {
            await chatHubService.sendMessage(roomId, text, replyId);
            this.cancelReply();
          } catch (err) {
            console.error('Failed to send message:', err);
          }
        },

        async toggleReaction(messageId: string, emoji: string): Promise<void> {
          const roomId = store.currentRoom()?.id;
          if (!roomId) return;

          const message = store.messages().find((m) => m.id === messageId);
          if (!message) return;

          const myReact = message.reacts.find(
            (r) => r.reactorId === store.userId() && r.emoji === emoji,
          );

          try {
            if (myReact) {
              await chatHubService.removeReaction(roomId, messageId, myReact.id);
            } else {
              await chatHubService.reactToMessage(roomId, messageId, emoji);
            }
          } catch (err) {
            console.error('Failed to toggle reaction:', err);
          }
        },

        setReplyTo(msg: Message | null): void {
          patchState(store, { replyingTo: msg });
        },

        cancelReply(): void {
          patchState(store, { replyingTo: null });
        },

        destroy(): void {
          cleanupHub();
          chatHubService.stopConnection();
        },
      };
    },
  ),
  withHooks({
    onDestroy(store) {
      store.destroy();
    },
  }),
);
