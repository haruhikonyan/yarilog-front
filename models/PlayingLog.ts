import { User } from "./User";
import { Tune } from "./Tune";
import { Instrument } from "./Instrument";

export enum PlayerLevel {
  BEGINNER = "初心者",
  INTERMEDIATE = "中級者",
  SENIOR = "上級者",
  PRO = "プロ"
}

export class PlayingLog {
  id: string | undefined;

  // 演奏日
  playDate: Date | null = null;

  // 演奏団体
  team: string | null = null;

  // 自分の演奏レベル
  playerLevel: PlayerLevel | null = null;

  // 担当パート
  instrument: Instrument | null = null;

  // ポジション 1stとかバンダとか
  position: string | null = null;

  // 難易度 5段階
  difficulty: number = 3;
  // 体力 5段階
  physicality: number = 3;
  // 面白さ 5段階
  interesting: number = 3;

  // 自分のパートの感想
  inpression: string | null = null;
  // 他のパートや全体について
  otherPartInpression: string | null = null;
  // 非公開のメモ
  secretMemo: string | null = null;
  //　下書きフラグ
  isDraft: boolean = false;

  tune: Tune | null = null;
  user: User | null = null;

  constructor() {
  }
}
