<template>
  <section class="container">
    <div>
      <h1 class="title">
        演奏ログ編集ページ
      </h1>
      <PlayingLogForm
        :composers="composers"
        :instruments="$store.state.instruments"
        :playing-log="playingLog"
        @on-submit="updatePlayingLog"
      />
      <nuxt-link to="/tunes/new">曲作成</nuxt-link>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { User } from '~/models/User';
import { PlayingLog, PlayerLevel } from '~/models/PlayingLog';
import { Instrument } from '~/models/Instrument';
import PlayingLogForm from '~/components/PlayingLogForm.vue';
import { Composer } from '~/models/Composer';
import { Tune } from '~/models/Tune';

@Component({
  components: {
    PlayingLogForm
  },
  async asyncData({ app, params }) {
    const playingLogData = await app.$api.getPlayingLog(params.id);
    const composersData = await app.$api.getComposers();
    return { playingLog: playingLogData, composers: composersData };
  }
})
export default class Index extends Vue {
  composers: Composer[] = [];
  playingLog!: PlayingLog;
  async updatePlayingLog() {
    const savedPlayingLog = await this.$api.updatePlayingLog(this.playingLog);
    this.$router.push(`/playing-logs/${savedPlayingLog.id!}`);
  }
}
</script>
