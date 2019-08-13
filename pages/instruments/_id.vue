<template>
  <section class="container">
    <div>
      <h3>{{ instrument.name }}の演奏記録</h3>
    </div>
    <PlayingLogCard v-for="playingLog in playingLogs" :key="playingLog.id" :playing-log="playingLog" />
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { PlayingLog } from '../../models/PlayingLog';
import { Instrument } from '../../models/Instrument';
import PlayingLogCard from '../../components/PlayingLogCard.vue';

@Component({
  components: {
    PlayingLogCard
  },
  async asyncData({ app, params }) {
    const playingLogs = await app.$api.getPlayingLogsByInstrument(params.id);
    const instrument = await app.$api.getInstrument(params.id);
    return { playingLogs, instrument };
  }
})
export default class Index extends Vue {
  playingLogs: PlayingLog[] = [];
  instrument: Instrument | null = null;
}
</script>
