import { inject, Injectable, signal } from '@angular/core';

import { APP_SETTINGS } from '@Core/config/app.settings';
import { AuthService } from '@Features/auth/auth.service';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { Subject } from 'rxjs';

import { Message, Reaction } from '@shared/models/chat/chat.model';
import { ChatService, RawMessage } from '@shared/services/chat.service';

@Injectable({
  providedIn: 'root',
})
export class ChatHubService {
  private readonly appSettings = inject(APP_SETTINGS);
  private readonly authService = inject(AuthService);
  private readonly chatService = inject(ChatService);
  private hubConnection: HubConnection | null = null;

  readonly messageReceived$ = new Subject<Message>();
  readonly reactionReceived$ = new Subject<Reaction>();
  readonly reactionRemoved$ = new Subject<Reaction>();
  readonly connectionState = signal<HubConnectionState>(HubConnectionState.Disconnected);

  async startConnection(roomId: string): Promise<void> {
    if (this.hubConnection && this.hubConnection.state !== HubConnectionState.Disconnected) {
      await this.stopConnection();
    }

    const token = this.authService.getAccessToken();
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${this.appSettings.apiBaseUrl.replace('/api', '')}/chat`, {
        accessTokenFactory: () => token || '',
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.on('ReceiveMessage', (message: RawMessage) => {
      this.messageReceived$.next(this.chatService.mapMessage(message));
    });

    this.hubConnection.on('ReceiveReaction', (reaction: Reaction) => {
      this.reactionReceived$.next(reaction);
    });

    this.hubConnection.on('ReceiveReactionRemoved', (reaction: Reaction) => {
      this.reactionRemoved$.next(reaction);
    });

    try {
      await this.hubConnection.start();
      this.connectionState.set(this.hubConnection.state);
      await this.hubConnection.invoke('JoinRoom', roomId);
    } catch (err) {
      console.error('Error starting SignalR connection:', err);
      this.connectionState.set(HubConnectionState.Disconnected);
      throw err;
    }
  }

  async stopConnection(): Promise<void> {
    if (!this.hubConnection) return;
    try {
      await this.hubConnection.stop();
    } finally {
      this.hubConnection = null;
      this.connectionState.set(HubConnectionState.Disconnected);
    }
  }

  async sendMessage(roomId: string, text: string, replyOnId: string | null = null): Promise<void> {
    if (!this.hubConnection || this.hubConnection.state !== HubConnectionState.Connected) {
      throw new Error('SignalR connection is not active.');
    }
    const content = { text };
    await this.hubConnection.invoke('SendMessage', roomId, { replyOnId, content });
  }

  async reactToMessage(roomId: string, messageId: string, emoji: string): Promise<void> {
    if (!this.hubConnection || this.hubConnection.state !== HubConnectionState.Connected) {
      throw new Error('SignalR connection is not active.');
    }
    await this.hubConnection.invoke('ReactToMessage', roomId, { messageId, emoji });
  }

  async removeReaction(roomId: string, messageId: string, reactionId: string): Promise<void> {
    if (!this.hubConnection || this.hubConnection.state !== HubConnectionState.Connected) {
      throw new Error('SignalR connection is not active.');
    }
    await this.hubConnection.invoke('RemoveReaction', roomId, messageId, reactionId);
  }
}
