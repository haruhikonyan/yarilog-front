import Vue from 'vue';
import { PlayingLog } from '~/models/PlayingLog';

const convartDisplayDate = (playDate: string | Date | null): string => {
  if (!playDate) {
    return ``;
  }
  playDate = new Date(playDate);
  const year = playDate.getFullYear();
  const month = playDate.getMonth() + 1;
  const day = playDate.getDate();
  return `${year}年${month}月${day}日`;
};

Vue.filter('displayPlayInfo', (playingLog: PlayingLog) => {
  // TODO ブラッシアップ
  const displayTeam = playingLog.team || '';
  const displayScene = playingLog.scene || '';
  const displayDate = convartDisplayDate(playingLog.playDate);
  return displayTeam || displayScene || displayDate ? `${displayDate} ${displayTeam} ${displayScene}にて演奏` : '';
});

Vue.filter('displayArranger', (arranger: string) => {
  return arranger ? `(${arranger}編)` : '';
});
