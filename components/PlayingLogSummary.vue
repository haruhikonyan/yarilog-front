<template>
  <nuxt-link :to="`/playing-logs/${playingLog.id}`">
    <small>
      {{ playingLog.instrument.name }} {{ playingLog.position }} <b-badge>{{ playingLog.playerLevel }}</b-badge>
    </small>
    <b-card-text class="mb-0">{{ playingLog.user.nickname }}さんの{{ playingLog.playDate }}演奏</b-card-text>
    <pre class="text-muted mb-0 yrl-pre-wrap yrl-truncate-one-line">{{ playingLog.impressionOfInteresting }}</pre>
    <div slot="footer">
      面白さ: {{ playingLog.interesting }} 体力: {{ playingLog.physicality }} 難易度: {{ playingLog.difficulty }}
      <div>
        <b-badge>{{ playingLog.playerLevel }}</b-badge>
        <b-badge>{{ playingLog.instrument.shortName }} {{ playingLog.position }}</b-badge>
      </div>
    </div>
  </nuxt-link>
</template>

<script lang="ts">
import { PropType } from 'vue';
import { Component, Vue, Prop } from 'vue-property-decorator';
import { PlayingLog } from '../models/PlayingLog';

@Component({})
export default class PlayingLogSummary extends Vue {
  @Prop({ type: Object as PropType<PlayingLog>, required: true })
  playingLog!: PlayingLog;
}
</script>
<style lang="scss" scoped>
// 1行に固定して余った分は省略
.yrl-truncate-one-line {
  display: -webkit-box;
  /* autoprefixer: off */
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}
</style>
