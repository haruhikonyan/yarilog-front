<template>
  <section class="container">
    <div>
      <h1 class="title">
        演奏記録編集ページ
      </h1>
      <PlayingLogForm
        :playstyles="$store.state.playstyles"
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
import { PlayingLog } from '~/models/PlayingLog';
import PlayingLogForm from '~/components/PlayingLogForm.vue';

@Component({
  components: {
    PlayingLogForm
  },
  middleware: 'authenticated',
  async asyncData({ app, params }) {
    const playingLog = await app.$api.getPlayingLog(params.id);
    return { playingLog, isBeforeDraft: playingLog.isDraft };
  }
})
export default class Index extends Vue {
  playingLog!: PlayingLog;
  isBeforeDraft!: boolean;
  async updatePlayingLog() {
    // 空文字列とか怪しい値は明示的に null にする
    if (!this.playingLog.playDate) {
      this.playingLog.playDate = null;
    }
    const savedPlayingLog = await this.$api.updatePlayingLog(this.playingLog);
    // 非公開から公開へ変更
    if (this.isBeforeDraft && !savedPlayingLog.isDraft) {
      this.$ga.event('演奏記録公開更新', 'update', '公開', 1);
    }
    // 公開から非公開へ変更
    if (!this.isBeforeDraft && savedPlayingLog.isDraft) {
      this.$ga.event('演奏記録公開更新', 'update', '非公開', 1);
    }
    this.$router.push(`/playing-logs/${savedPlayingLog.id!}`);
  }
}
</script>
