<template>
  <nuxt-link :to="`/playing-logs/${playingLog.id}`">
    <b-card header-tag="header" footer-tag="footer" class="my-3">
      <div slot="header">
        <h4>{{ playingLog.tune.title }}</h4>
        <h6 class="text-muted">{{ playingLog.tune.composer.displayName }}作曲</h6>
      </div>
      <b-card-text class="mb-1">{{ playingLog.user.nickname }}さんの{{ playingLog.playDate }}演奏</b-card-text>
      <pre class="text-muted yrl-pre-wrap yrl-truncate-three-line">{{ playingLog.impressionOfInteresting }}</pre>
      <div slot="footer">
        難易度: {{ playingLog.difficulty }} 体力: {{ playingLog.physicality }} 面白さ: {{ playingLog.interesting }}
        <div>
          <b-badge>{{ playingLog.playerLevel }}</b-badge>
          <b-badge>{{ playingLog.instrument.shortName }} {{ playingLog.position }}</b-badge>
        </div>
      </div>
    </b-card>
  </nuxt-link>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { PlayingLog } from '../models/PlayingLog';

@Component({})
export default class PlayingLogCard extends Vue {
  // type 指定したいが API から取得したモデルは new してないため Object と判断されてしまう？
  @Prop({ type: Object, required: true })
  playingLog!: PlayingLog;
}
</script>
<style lang="scss" scoped>
// 3行に固定して余った分は省略
.yrl-truncate-three-line {
  display: -webkit-box;
  /* autoprefixer: off */
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
</style>