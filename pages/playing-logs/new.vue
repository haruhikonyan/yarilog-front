<template>
  <section class="container">
    <div>
      <logo />
      <h1 class="title">
        演奏ログ新規作成ページ
      </h1>
      <h2 class="subtitle">
        yarilog frontend system by Nuxt.js
      </h2>
      <form>
        <div class="form-group">
          <label for="exampleInputEmail1">演奏ログ詳細</label>
          <textarea v-model="playingLog.description" placeholder="詳細"></textarea>
        </div>
        <button type="submit" class="btn btn-primary" @click="createPlayingLog">Submit</button>
      </form>
      {{ playingLog.description }}
      <div class="links">
        <p>ID：{{ user.id }} 名前：{{ user.name }} 詳細：{{ user.description }}</p>
        <button class="btn btn-primary" @click="createTune">
          曲追加
        </button>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import $axios from '@nuxtjs/axios';
import Logo from '~/components/Logo.vue';
import { User } from '~/models/User';
import { Country } from '~/models/Country';
import { Composer } from '~/models/Composer';
import { PlayingLog } from '~/models/PlayingLog';
import { Tune } from 'models/Tune';

@Component({
  components: {
    Logo
  },
  async asyncData({ app }) {
    const userData = await app.$api.getUser('1');
    const tunesData = await app.$api.getTunes();
    return { user: userData, tunes: tunesData };
  }
})
export default class Index extends Vue {
  user: User | undefined;
  tunes: Tune[] = [];
  composers: Composer[] = [];
  playingLog: PlayingLog = new PlayingLog();
  async createPlayingLog() {
    this.playingLog.user = this.user!;
    this.playingLog.tune = this.tunes[0];

    await this.$api.createPlayingLog(this.playingLog);
  }
  async createTune() {
    const country: Country = {
      id: '1',
      name: 'ドイツ',
      description: 'ヨーロッパの国'
    };
    const composer: Composer = {
      id: '1',
      lastName: 'ベートーヴェン',
      fullName: 'ルードヴィヒ・ヴァン・ベートーヴェン',
      description: '運命とかで有名なあの人',
      countries: [country]
    };
    const tuneData: Tune = {
      id: null,
      title: '交響曲第1番',
      description: '意欲作',
      composer: composer
    };
    await this.$api.createTune(tuneData);
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
