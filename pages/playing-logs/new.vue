<template>
  <section class="container">
    <div>
      <h1 class="title">
        演奏記録新規作成
      </h1>
      <PlayingLogForm
        :playstyles="$store.state.playstyles"
        :instruments="$store.state.instruments"
        :playing-log="playingLog"
        :require-tune-error="requireTuneError"
        @on-submit="createPlayingLog"
      />
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
  },
  middleware: 'authenticated',
  async asyncData({ app, query }) {
    const playingLog = new PlayingLog();
    const tuneId = query.tuneId;
    if (tuneId) {
      playingLog.tune = await app.$api.getTune(tuneId);
    }
    return { playingLog };
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
    // 空文字列とか怪しい値は明示的に null にする
    if (!this.playingLog.playDate) {
      this.playingLog.playDate = null;
    }
    const savedPlayingLog = await this.$api.createPlayingLog(this.playingLog);
    this.$router.push(savedPlayingLog.id!);
  }
}
</script>
