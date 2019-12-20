import { Composer } from './Composer';
import { PlayingLog } from './PlayingLog';

export class Tune {
  id: number | undefined;
  title!: string;
  description: string | null = null;

  playstyle!: PlayStyle;
  genres: Genre[] = [];

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

// 演奏形態
export interface PlayStyle {
  id: number;
  name: string;
  description: string;
}

// ジャンル(タグ)
export interface Genre {
  id: number;
  name: string;
  description: string;
}

export interface TuneSearchObject {
  searchWord: string | null | undefined;
  instrumentId: string | null | undefined;
  composerId: string | null | undefined;
  playstyleId: string | null | undefined;
  genreId: string | null | undefined;
}

export interface TunesWithCount {
  tunes: Tune[];
  totalCount: number;
}
