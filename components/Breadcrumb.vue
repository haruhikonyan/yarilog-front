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
      return this.generateTuneItems(this.tune, this.playstyle, this.instrument);
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
  private generatePlaystyleItems(playstyle: PlayStyle, tune?: Tune) {
    const to = tune
      ? { path: `/tunes/${tune.id}`, query: { selectedPlaystyleId: playstyle.id } }
      : `/playstyles/${playstyle.id}`;
    return [
      {
        text: playstyle.name,
        to
      }
    ];
  }
  private generateInstrumentItems(instrument: Instrument, tune?: Tune) {
    const to = tune
      ? { path: `/tunes/${tune.id}`, query: { selectedInstrumentId: instrument.id } }
      : `/instruments/${instrument.id}`;
    return [
      {
        text: instrument.shortName,
        to
      }
    ];
  }
  // 作曲家->曲->編成->楽器->演奏記録
  private generatePlaingLogItems(playingLog: PlayingLog): Object[] {
    const tune = playingLog.tune;
    const playstyle = playingLog.playstyle;
    const instrument = playingLog.instrument;
    // TODO リンクはその曲のものにする
    return [
      this.generateTuneItems(tune),
      this.generatePlaystyleItems(playstyle, tune),
      this.generateInstrumentItems(instrument, tune),
      {
        text: `${playingLog.user.nickname}さん演奏`,
        active: true
      }
    ].flat();
  }

  // 作曲家 => 曲 => 編成 => 楽器
  private generateTuneItems(
    tune: Tune,
    playstyle: PlayStyle | null = null,
    instrument: Instrument | null = null
  ): Object[] {
    const items: Object[] = [];
    const composer = tune.composer;
    items.push(this.generateComposerItems(composer));
    items.push({
      text: tune.title,
      to: `/tunes/${tune.id}`
    });
    if (playstyle) {
      items.push(this.generatePlaystyleItems(playstyle, tune));
    }
    if (instrument) {
      items.push(this.generateInstrumentItems(instrument, tune));
    }
    items.push({
      text: '演奏記録一覧'
    });
    return items.flat();
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
