<template>
  <section class="container">
    <div>
      <h1 class="title">{{ country.name }}出身の作曲家の演奏記録</h1>
    </div>
    <p v-for="playingLog in playingLogs" :key="playingLog.id">
      <nuxt-link :to="`/playing-logs/${playingLog.id}`"
        >{{ playingLog.tune.composer.lastName }}作曲 {{ playingLog.tune.title }}</nuxt-link
      >
    </p>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { PlayingLog } from '../../models/PlayingLog';
import { Country } from '../../models/Country';

@Component({
  components: {},
  async asyncData({ app, params }) {
    const playingLogs = await app.$api.getPlayingLogsByCountry(params.id);
    const country = await app.$api.getCountry(params.id);
    return { playingLogs: playingLogs, country: country };
  }
})
export default class Index extends Vue {
  playingLogs: PlayingLog[] = [];
  country: Country | null = null;
}
</script>
