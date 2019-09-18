<template>
  <b-breadcrumb :items="items" class="yrl-very-small" />
</template>

<script lang="ts">
import { PropType } from 'vue';
import { Component, Vue, Prop } from 'vue-property-decorator';
import { PlayingLog } from '../models/PlayingLog';
import { Tune, PlayStyle } from '../models/Tune';
import { Instrument } from '../models/Instrument';
import { Composer } from '../models/Composer';

@Component({})
export default class Breadcrumb extends Vue {
  @Prop({ type: Object as PropType<PlayingLog> })
  playingLog!: PlayingLog | null;
  @Prop({ type: Object as PropType<Tune> })
  tune!: Tune | null;
  @Prop({ type: Object as PropType<Composer> })
  composer!: Composer | null;
  @Prop({ type: Object as PropType<PlayStyle> })
  playstyle!: PlayStyle | null;
  @Prop({ type: Object as PropType<Instrument> })
  instrument!: Instrument | null;

  // パンくずリストに表示させる item を返す
  get items(): Object[] {
    if (this.playingLog) {
      return this.generatePlaingLogItems(this.playingLog);
    }
    if (this.tune) {
      return this.generateTuneItems(this.tune);
    }
    // 曲と演奏記録詳細以外は検索結果画面で検索内容によって動的に出し分ける
    const items: Object[] = [];
    if (this.playstyle) {
      items.push(this.generatePlaystyleItems(this.playstyle));
    }
    if (this.composer) {
      items.push(this.generateComposerItems(this.composer));
    }
    if (this.instrument) {
      items.push(this.generateInstrumentItems(this.instrument));
    }
    items.push(this.generateSearchResultItems());
    return items.flat();
  }

  private generateComposerItems(composer: Composer) {
    return [
      {
        text: composer.displayName,
        to: `/composers/${composer.id}`
      }
    ];
  }
  private generatePlaystyleItems(playstyle: PlayStyle) {
    return [
      {
        text: playstyle.name,
        to: `/tunes?playstyleId=${playstyle.id}`
        // to: `/playstyles/${playstyle.id}`
      }
    ];
  }
  private generateInstrumentItems(instrument: Instrument) {
    return [
      {
        text: instrument.shortName,
        to: `/tunes?instrumentId=${instrument.id}`
        // to: `/instrumens/${instrument.id}`
      }
    ];
  }
  // 演奏形態->作曲家->曲->楽器->演奏記録
  private generatePlaingLogItems(playingLog: PlayingLog): Object[] {
    const tune = playingLog.tune;
    const instrument = playingLog.instrument;
    return [
      this.generateTuneItems(tune),
      this.generateInstrumentItems(instrument),
      {
        text: `${playingLog.user.nickname}さん演奏`,
        active: true
      }
    ].flat();
  }

  // 演奏形態->作曲家->曲
  private generateTuneItems(tune: Tune): Object[] {
    const composer = tune.composer;
    const playstyle = tune.playstyle;
    return [
      this.generatePlaystyleItems(playstyle),
      this.generateComposerItems(composer),
      {
        text: tune.title,
        to: `/tunes/${tune.id}`
      }
    ].flat();
  }

  private generateSearchResultItems(): Object[] {
    return [
      {
        text: '検索結果',
        active: true
      }
    ];
  }
}
</script>
