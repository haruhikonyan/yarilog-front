<template>
  <section class="container">
    <div>
      <h3>{{ country.name }}出身の作曲家の演奏記録</h3>
    </div>
    <PlayingLogCard v-for="playingLog in playingLogs" :key="playingLog.id" :playing-log="playingLog" />
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { PlayingLog } from '../../models/PlayingLog';
import { Country } from '../../models/Country';
import PlayingLogCard from '../../components/PlayingLogCard.vue';

@Component({
  components: {
    PlayingLogCard
  },
  async asyncData({ app, params }) {
    const playingLogs = await app.$api.getPlayingLogsByCountry(params.id);
    const country = await app.$api.getCountry(params.id);
    return { playingLogs, country };
  }
})
export default class Index extends Vue {
  playingLogs: PlayingLog[] = [];
  country: Country | null = null;
}
</script>
