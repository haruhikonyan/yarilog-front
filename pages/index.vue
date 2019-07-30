<template>
  <section class="container">
    <div class="text-center">
      <h1>
        トップページ
      </h1>
      <p><nuxt-link to="/composers">作曲家から演奏記録を探す</nuxt-link></p>
      <p><nuxt-link to="/countries">国から演奏記録を探す</nuxt-link></p>
      <b-button v-if="!$store.state.auth" to="/users/new" variant="primary">ユーザ新規作成</b-button>
      <p class="text-center mt-3">最新の演奏記録</p>
    </div>
    <PlayingLogCard v-for="playingLog in playingLogs" :key="playingLog.id" :playing-log="playingLog" />
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { User } from '~/models/User';
import { Country } from 'models/Country';
import { Composer } from 'models/Composer';
import Cookie from 'js-cookie';
import { PlayingLog } from '../models/PlayingLog';
import PlayingLogCard from '../components/PlayingLogCard.vue';

@Component({
  components: {
    PlayingLogCard
  },
  async asyncData({ app }) {
    const data = await app.$api.getPlayingLogs();
    return { playingLogs: data };
  }
})
export default class Index extends Vue {}
</script>
