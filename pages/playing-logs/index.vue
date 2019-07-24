<template>
  <section class="container">
    <div>
      <logo />
      <h1 class="title">
        演奏ログ一覧、検索結果
      </h1>
      <h2 class="subtitle">
        yarilog frontend system by Nuxt.js
      </h2>
      <div class="links">
        <p v-for="playingLog in playingLogs" :key="playingLog.id">
          ID：{{ playingLog.id }} 曲：{{ playingLog.tune.title }}({{ playingLog.tune.composer.lastName }}) 詳細：{{
            playingLog.description
          }}
        </p>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import $axios from '@nuxtjs/axios';
import Logo from '~/components/Logo.vue';
import { User } from '~/models/User';
import { PlayingLog } from '~/models/PlayingLog';

@Component({
  components: {
    Logo
  },
  async asyncData({ app }) {
    const data = await app.$api.getPlayingLogs();
    return { playingLogs: data };
  }
})
export default class Index extends Vue {
  playingLogs: PlayingLog[] = [];
}
</script>
