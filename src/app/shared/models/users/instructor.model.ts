import { User } from "./user.model";

export interface Instructor extends User {
  coursesCount: number;
  quizzesCount: number;
}
