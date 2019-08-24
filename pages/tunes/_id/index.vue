<template>
  <section class="container">
    <div>
      <h4 class="mb-0">{{ tune.title }}</h4>
      <small class="text-muted mb-1">{{ tune.composer.displayName }}作曲</small>
      <div v-for="playingLog in playingLogs" :key="playingLog.id">
        <PlayingLogSummary :playing-log="playingLog" />
        <!-- TODO 区切りのブラッシュアップと最後には表示しないようにする -->
        <hr />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Tune } from '../../../models/Tune';
import PlayingLogSummary from '~/components/PlayingLogSummary.vue';

@Component({
  components: {
    PlayingLogSummary
  },
  async asyncData({ app, params }) {
    const tune = await app.$api.getTune(params.id);
    // 最新5件表示
    const playingLogs = await app.$api.getPlayingLogsByTune(params.id, 0, 5);
    return { tune, playingLogs };
  },
  head(this: Index) {
    return {
      title: `${this.tune.title} ${this.tune.composer.fullName}作曲 - 演りログ`,
      meta: [{ hid: 'description', name: 'description', content: `${this.tune.description}` }]
    };
  }
})
export default class Index extends Vue {
  tune!: Tune;
}
</script>
