<template>
  <section class="container">
    <div>
      <h4>{{ playingLog.tune.title }}</h4>
      <small class="text-muted">{{ playingLog.tune.composer.displayName }}作曲</small>
      <h5 class="text-center">
        難易度: {{ playingLog.difficulty }} 体力: {{ playingLog.physicality }} 面白さ: {{ playingLog.interesting }}
      </h5>
      <b-card
        class="mb-2"
        title="自分のパートの感想"
        :sub-title="`${playingLog.instrument.name} ${playingLog.position}`"
      >
        <b-card-text>
          <pre class="yrl-pre-wrap">{{ playingLog.impressionOfInteresting }}</pre>
        </b-card-text>
      </b-card>
      <b-card class="mb-2" title="全体の感想">
        <b-card-text>
          <pre class="yrl-pre-wrap">{{ playingLog.otherPartInpression }}</pre>
        </b-card-text>
      </b-card>
      <h4>{{ playingLog.user.nickname }}さん</h4>
      {{ playingLog.playDate }} に演奏 <b-badge>{{ playingLog.playerLevel }}</b-badge>
    </div>
    <!-- TODO 同じ曲の演奏ログや同じ人の演奏ログを出す -->
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { PlayingLog } from '~/models/PlayingLog';

@Component({
  components: {},
  async asyncData({ app, params }) {
    const data = await app.$api.getPlayingLog(params.id);
    return { playingLog: data };
  }
})
export default class Index extends Vue {
  playingLog: PlayingLog | null = null;
}
</script>
