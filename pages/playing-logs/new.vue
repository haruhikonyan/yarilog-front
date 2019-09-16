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
        @on-submit="createPlayingLog"
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
import { Tune, PlayStyle } from '~/models/Tune';

@Component({
  components: {
    PlayingLogForm
  }
})
export default class Index extends Vue {
  playingLog: PlayingLog = new PlayingLog();
  async createPlayingLog() {
    const savedPlayingLog = await this.$api.createPlayingLog(this.playingLog);
    this.$router.push(savedPlayingLog.id!);
  }
}
</script>
