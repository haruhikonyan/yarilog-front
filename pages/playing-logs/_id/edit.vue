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
    return { playingLog };
  }
})
export default class Index extends Vue {
  playingLog!: PlayingLog;
  async updatePlayingLog() {
    const savedPlayingLog = await this.$api.updatePlayingLog(this.playingLog);
    this.$router.push(`/playing-logs/${savedPlayingLog.id!}`);
  }
}
</script>
