import { Composer } from "./Composer";
import { PlayingLog } from "./PlayingLog";

export interface Tune {
  id: string
  title: string
  description: string
  composer: Composer
}
