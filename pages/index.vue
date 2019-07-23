<template>
  <section class="container">
    <div>
      <logo />
      <h1 class="title">
        yarilog-front
      </h1>
      <h2 class="subtitle">
        yarilog frontend system by Nuxt.js
      </h2>
      <div class="links">
        <nuxt-link to="/users/new">ユーザ新規作成</nuxt-link>
        <button class="btn btn-primary" @click="checkLogin">
          ログインチェック
        </button>
        <a href="https://nuxtjs.org/" target="_blank" class="button--green">Documentation</a>
        <a href="https://github.com/nuxt/nuxt.js" target="_blank" class="button--grey">GitHub</a>
        <p v-for="playingLog in playingLogs" :key="playingLog.id">
          <nuxt-link :to="`/playing-logs/${playingLog.id}`"
            >ID：{{ playingLog.id }} 詳細：{{ playingLog.description }}</nuxt-link
          >
        </p>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Logo from '~/components/Logo.vue';
import { User } from '~/models/User';
import { Country } from 'models/Country';
import { Composer } from 'models/Composer';
import Cookie from 'js-cookie';
import { PlayingLog } from '../models/PlayingLog';

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
  async checkLogin() {
    await this.$api.check();
  }
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue',
    Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
