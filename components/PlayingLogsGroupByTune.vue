<template>
  <div>
    <b-card
      v-for="playingLogs in playingLogsGroupByTune"
      :key="playingLogs"
      header-tag="header"
      footer-tag="footer"
      body-class="py-2"
      class="my-3"
    >
      <div slot="header" class="d-flex justify-content-between">
        <div>
          <h4>{{ playingLogs[0].tune.title }}</h4>
          <h6 class="text-muted mb-0">{{ playingLogs[0].tune.composer.displayName }}作曲</h6>
        </div>
      </div>

      <div v-for="playingLog in playingLogs" :key="playingLog.id">
        <b-card-text class="mb-1">{{ playingLog.user.nickname }}さんの{{ playingLog.playDate }}演奏</b-card-text>
        <pre class="text-muted mb-0 yrl-pre-wrap yrl-truncate-three-line">{{ playingLog.impressionOfInteresting }}</pre>
        <div slot="footer">
          面白さ: {{ playingLog.interesting }} 体力: {{ playingLog.physicality }} 難易度: {{ playingLog.difficulty }}
          <div>
            <b-badge>{{ playingLog.playerLevel }}</b-badge>
            <b-badge>{{ playingLog.instrument.shortName }} {{ playingLog.position }}</b-badge>
          </div>
        </div>
        <hr />
      </div>
    </b-card>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue';
import { Component, Vue, Prop } from 'vue-property-decorator';
import { PlayingLog } from '../models/PlayingLog';

@Component({})
export default class PlayingLogsGroupByTune extends Vue {
  @Prop({ type: Array as PropType<PlayingLog[][]>, required: true })
  playingLogsGroupByTune!: PlayingLog[][];
}
</script>
<style lang="scss" scoped>
// 3行に固定して余った分は省略
.yrl-truncate-three-line {
  display: -webkit-box;
  /* autoprefixer: off */
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}
</style>
