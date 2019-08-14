import { PlayingLog } from "./PlayingLog";

export interface PlayingLogsWithCount {
  playingLogs: PlayingLog[];
  totalCount: number;
}