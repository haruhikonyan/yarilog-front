<template>
  <section class="container">
    <div>
      <h3>{{ composer.fullName }}の演奏記録一覧</h3>
    </div>
    <PlayingLogCard v-for="playingLog in playingLogs" :key="playingLog.id" :playing-log="playingLog" />
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { PlayingLog } from '../../models/PlayingLog';
import PlayingLogCard from '../../components/PlayingLogCard.vue';

@Component({
  components: {
    PlayingLogCard
  },
  async asyncData({ app, params }) {
    const playingLogs = await app.$api.getPlayingLogsByComposer(params.id);
    const composer = await app.$api.getComposer(params.id);
    return { playingLogs, composer };
  }
})
export default class Index extends Vue {
  playingLogs: PlayingLog[] = [];
}
</script>
