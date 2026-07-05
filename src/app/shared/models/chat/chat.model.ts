import { Student } from '@shared/models/users/student.model';
import { User } from '@shared/models/users/user.model';

export enum ChatStatus {
  OpenForAny = 1,
  OpenForInstructor = 2,
}

export interface Reaction {
  id: string;
  messageId: string;
  reactorId: string;
  emoji: string;
  createdAt: string;
}

export interface Message {
  id: string;
  roomId: string;
  sender: User;
  replyOnId: string | null;
  createdAt: string;
  content: { text: string };
  reacts: Reaction[];
}

export interface CourseChatRoom {
  id: string;
  courseId: string;
  instructorId: string | null;
  status: ChatStatus;
  students: Student[];
  messages: Message[];
}
