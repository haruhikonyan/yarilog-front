<template>
  <b-breadcrumb :items="items" class="very-small">
    <b-breadcrumb-item class="pl-1" />
  </b-breadcrumb>
</template>

<script lang="ts">
import { PropType } from 'vue';
import { Component, Vue, Prop } from 'vue-property-decorator';
import { PlayingLog } from '../models/PlayingLog';

@Component({})
export default class Breadcrumb extends Vue {
  @Prop({ type: Object as PropType<PlayingLog> })
  playingLog!: PlayingLog | undefined;
  items: Object[] = [];

  created() {
    if (this.playingLog) {
      this.items = this.generatePlaingLogItems(this.playingLog);
    }
  }
  private generatePlaingLogItems(playingLog: PlayingLog): Object[] {
    // 作曲家->演奏形態->曲->楽器->演奏記録
    const composer = playingLog.tune.composer;
    const playstyle = playingLog.tune.playstyle;
    const tune = playingLog.tune;
    const instrument = playingLog.instrument;
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
      },
      {
        text: instrument.shortName,
        to: `/tunes?instrumentId=${instrument.id}`
        // to: `/instrumens/${instrument.id}`
      },
      {
        text: `${playingLog.user.nickname}さん演奏`,
        active: true
      }
    ];
  }
}
</script>
