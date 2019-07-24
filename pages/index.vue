<template>
  <section class="container">
    <div class="text-center">
      <h1>
        トップページ
      </h1>
      <p><nuxt-link to="/playing-logs/composers">作曲家から演奏記録を探す</nuxt-link></p>
      <p><nuxt-link to="/playing-logs/countries">国から演奏記録を探す</nuxt-link></p>
      <p><nuxt-link to="/playing-logs/users">奏者から演奏記録を探す</nuxt-link></p>
      <div>
        最新の演奏記録
        <p v-for="playingLog in playingLogs" :key="playingLog.id">
          <nuxt-link :to="`/playing-logs/${playingLog.id}`"
            >{{ playingLog.tune.composer.lastName }}作曲 {{ playingLog.tune.title }}</nuxt-link
          >
        </p>
      </div>
      <nuxt-link v-if="!$store.state.auth" to="/users/new">ユーザ新規作成</nuxt-link>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { User } from '~/models/User';
import { Country } from 'models/Country';
import { Composer } from 'models/Composer';
import Cookie from 'js-cookie';
import { PlayingLog } from '../models/PlayingLog';

@Component({
  components: {},
  async asyncData({ app }) {
    const data = await app.$api.getPlayingLogs();
    return { playingLogs: data };
  }
})
export default class Index extends Vue {}
</script>
