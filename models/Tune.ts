import { Composer } from "./Composer";
import { PlayingLog } from "./PlayingLog";

export class Tune {
  id: number | undefined;
  title!: string;
  description: string | null = null;

  // 平均難易度 0~5 小数点第１位
  averageDifficulty!: number;
  // 平均体力 0~5 小数点第１位
  averagePhysicality!: number;
  // 平均面白さ 0~5 小数点第１位
  averageInteresting!: number;

  // 紐付いてる演奏記録の総数
  countPlayingLogs!: number;

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
