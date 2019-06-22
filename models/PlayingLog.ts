import { User } from "./User";
import { Tune } from "./Tune";

export interface PlayingLog {
  id: string | null
  description: string
  tune: Tune
  user: User
}
