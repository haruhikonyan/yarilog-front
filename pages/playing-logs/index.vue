<template>
  <section class="container">
    <div>
      <h1>
        演奏ログ一覧、検索結果
      </h1>
      <p v-for="playingLog in playingLogs" :key="playingLog.id">
        <nuxt-link :to="`/playing-logs/${playingLog.id}`"
          >{{ playingLog.tune.composer.lastName }}作曲 {{ playingLog.tune.title }}</nuxt-link
        >
      </p>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { User } from '~/models/User';
import { PlayingLog } from '~/models/PlayingLog';

@Component({
  components: {},
  async asyncData({ app }) {
    const data = await app.$api.getPlayingLogs();
    return { playingLogs: data };
  }
})
export default class Index extends Vue {
  playingLogs: PlayingLog[] = [];
}
</script>
