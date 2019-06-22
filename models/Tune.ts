import { Composer } from "./Composer";
import { PlayingLog } from "./PlayingLog";

export interface Tune {
  id: string | null
  title: string
  description: string
  composer: Composer
}
