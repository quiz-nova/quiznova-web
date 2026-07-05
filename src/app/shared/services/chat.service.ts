import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { APP_SETTINGS } from '@Core/config/app.settings';
import { map, Observable } from 'rxjs';

import { CourseChatRoom, Message, Reaction } from '@shared/models/chat/chat.model';
import { parseUserRole } from '@shared/utils/utilities';

export type RawMessage = Omit<Message, 'sender'> & {
  sender: {
    id: string;
    name: string;
    role: string;
  };
  reacts: Reaction[];
};

type RawCourseChatRoom = Omit<CourseChatRoom, 'messages'> & {
  messages: RawMessage[];
};

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private readonly http = inject(HttpClient);
  private readonly appSettings = inject(APP_SETTINGS);

  getChatRoomData(courseId: string): Observable<CourseChatRoom> {
    return this.http
      .get<RawCourseChatRoom>(`${this.appSettings.apiBaseUrl}/courses/${courseId}/chatroom`)
      .pipe(
        map((room) => ({
          ...room,
          messages: (room.messages || []).map((m) => this.mapMessage(m)),
        })),
      );
  }

  mapMessage(m: RawMessage): Message {
    return {
      id: m.id,
      roomId: m.roomId,
      sender: {
        id: m.sender.id,
        role: parseUserRole(m.sender.role),
        personalInformation: {
          name: m.sender.name,
          email: '',
          phoneNumber: '',
        },
      },
      replyOnId: m.replyOnId,
      createdAt: m.createdAt,
      content: m.content,
      reacts: m.reacts,
    };
  }
}
