import { User } from "./User";
import { Tune } from "./Tune";

export class PlayingLog {
  id: string | null = null;
  description: string | null = null;
  tune: Tune | null = null;
  user: User | null = null;

  constructor() {
  }
}
