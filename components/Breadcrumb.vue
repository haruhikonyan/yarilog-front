<template>
  <b-breadcrumb :items="items" class="very-small">
    <b-breadcrumb-item class="pl-1" />
  </b-breadcrumb>
</template>

<script lang="ts">
import { PropType } from 'vue';
import { Component, Vue, Prop } from 'vue-property-decorator';
import { PlayingLog } from '../models/PlayingLog';
import { Tune } from '../models/Tune';

@Component({})
export default class Breadcrumb extends Vue {
  @Prop({ type: Object as PropType<PlayingLog> })
  playingLog!: PlayingLog | undefined;
  @Prop({ type: Object as PropType<Tune> })
  tune!: Tune | undefined;

  items: Object[] = [];

  created() {
    if (this.playingLog) {
      this.items = this.generatePlaingLogItems(this.playingLog);
    }
    if (this.tune) {
      this.items = this.generateTuneItems(this.tune);
    }
  }
  // 作曲家->演奏形態->曲->楽器->演奏記録
  private generatePlaingLogItems(playingLog: PlayingLog): Object[] {
    const tune = playingLog.tune;
    const instrument = playingLog.instrument;
    return [
      this.generateTuneItems(tune),
      {
        text: instrument.shortName,
        to: `/tunes?instrumentId=${instrument.id}`
        // to: `/instrumens/${instrument.id}`
      },
      {
        text: `${playingLog.user.nickname}さん演奏`,
        active: true
      }
    ].flat();
  }

  // 作曲家->演奏形態->曲
  private generateTuneItems(tune: Tune): Object[] {
    const composer = tune.composer;
    const playstyle = tune.playstyle;
    return [
      {
        text: composer.displayName,
        to: `/composers/${composer.id}`
      },
      {
        text: playstyle.name,
        to: `/tunes?playstyleId=${playstyle.id}`
        // to: `/playstyles/${playstyle.id}`
      },
      {
        text: tune.title,
        to: `/tunes/${tune.id}`
      }
    ];
  }
}
</script>
