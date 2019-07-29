<template>
  <section class="container">
    <div>
      <h1>
        {{ playingLog.user.nickname }}さんの {{ playingLog.tune.composer.lastName }}作曲{{
          playingLog.tune.title
        }}の演奏記録
      </h1>
      {{ playingLog.inpression }}
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { PlayingLog } from '../../models/PlayingLog';

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
