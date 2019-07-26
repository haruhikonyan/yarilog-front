<template>
  <section class="container">
    <div>
      <h1 class="title">
        演奏ログ新規作成ページ
      </h1>
      <b-form @submit.prevent="createPlayingLog">
        <b-form-group label="演奏曲">
          <b-form-select v-model="playingLog.tune" class="mb-3">
            <option v-for="tune in tunes" :key="tune.id" :value="tune">
              {{ tune.composer.lastName }}: {{ tune.title }}
            </option>
          </b-form-select>
        </b-form-group>

        <b-form-group label="感想">
          <b-form-textarea
            v-model="playingLog.description"
            placeholder="難しかった"
            rows="3"
            max-rows="6"
          ></b-form-textarea>
        </b-form-group>
        <b-button type="submit" variant="primary">作成</b-button>
      </b-form>
      <nuxt-link to="/tunes/new">曲作成</nuxt-link>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import $axios from '@nuxtjs/axios';
import { User } from '~/models/User';
import { Country } from '~/models/Country';
import { Composer } from '~/models/Composer';
import { PlayingLog } from '~/models/PlayingLog';
import { Tune } from 'models/Tune';

@Component({
  components: {},
  async asyncData({ app }) {
    const tunesData = await app.$api.getTunes();
    return { tunes: tunesData };
  }
})
export default class Index extends Vue {
  tunes: Tune[] = [];
  composers: Composer[] = [];
  playingLog: PlayingLog = new PlayingLog();
  async createPlayingLog() {
    const savedPlayingLog = await this.$api.createPlayingLog(this.playingLog);
    this.$router.push(savedPlayingLog.id!);
  }
}
</script>
