import { User } from "./User";
import { Tune } from "./Tune";

export interface PlayingLog {
  id: string
  lastName: string
  fullName: string
  description: string
  tune: Tune
  user: User
}
