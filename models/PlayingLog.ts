import { User } from "./User";
import { Tune } from "./Tune";

export interface PlayingLog {
  id: string
  description: string
  tune: Tune
  user: User
}
