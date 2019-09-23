<template>
  <section class="container">
    <div>
      <h1 class="title">
        演奏ログ新規作成ページ
      </h1>
      <PlayingLogForm
        :playstyles="$store.state.playstyles"
        :instruments="$store.state.instruments"
        :playing-log="playingLog"
        :require-tune-error="requireTuneError"
        @on-submit="createPlayingLog"
      />
      <nuxt-link to="/tunes/new">曲作成</nuxt-link>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { PlayingLog } from '~/models/PlayingLog';
import PlayingLogForm from '~/components/PlayingLogForm.vue';

@Component({
  components: {
    PlayingLogForm
  }
})
export default class Index extends Vue {
  playingLog: PlayingLog = new PlayingLog();
  requireTuneError: string | null = null;
  async createPlayingLog() {
    if (!this.playingLog.tune) {
      // TODO やっつけエラー表示なのでどうにかする
      this.requireTuneError = '曲を選択してください';
      window.scrollTo(0, 0);
      return;
    }
    const savedPlayingLog = await this.$api.createPlayingLog(this.playingLog);
    this.$router.push(savedPlayingLog.id!);
  }
}
</script>
