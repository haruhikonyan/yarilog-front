import { Composer } from "./Composer";
import { PlayingLog } from "./PlayingLog";

export class Tune {
  id: number | undefined;
  title!: string;
  description: string | null = null;
  composer!: Composer;
  playingLogs: PlayingLog[] | undefined;
}

export interface TuneSearchObject {
  searchWord: string | null;
  instrumentId: string | null;
}

export interface TunesWithCount {
  tunes: Tune[];
  totalCount: number;
}