<template>
  <section class="container">
    <div>
      <h1 class="title">{{ playingLogs[0].tune.composer.fullName }}の演奏記録一覧</h1>
    </div>
    <p v-for="playingLog in playingLogs" :key="playingLog.id">
      <nuxt-link :to="`/playing-logs/${playingLog.id}`"
        >{{ playingLog.tune.composer.lastName }}作曲 {{ playingLog.tune.title }}</nuxt-link
      >
    </p>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { PlayingLog } from '../../models/PlayingLog';

@Component({
  components: {},
  async asyncData({ app, params }) {
    const data = await app.$api.getPlayingLogsByComposer(params.id);
    return { playingLogs: data };
  }
})
export default class Index extends Vue {
  playingLogs: PlayingLog[] | null = null;
}
</script>
