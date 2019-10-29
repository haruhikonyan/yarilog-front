<template>
  <section class="container">
    <Breadcrumb :tune="tune" />
    <div>
      <small class="text-muted mb-0">{{ tune.playstyle.name }} {{ displayGanres }}</small>
      <h4 class="mb-0">{{ tune.title }}</h4>
      <nuxt-link :to="`/composers/${tune.composer.id}`" class="text-muted small mb-1"
        >{{ tune.composer.displayName }}作曲
      </nuxt-link>
      <div>面白さ<StarRating :rate="(tune.averageInteresting / 5) * 100" />{{ tune.averageInteresting || '-' }}</div>
      <div>体力<StarRating :rate="(tune.averagePhysicality / 5) * 100" />{{ tune.averagePhysicality || '-' }}</div>
      <div>難易度<StarRating :rate="(tune.averageDifficulty / 5) * 100" />{{ tune.averageDifficulty || '-' }}</div>
      <div v-for="playingLog in playingLogs" :key="playingLog.id">
        <hr />
        <PlayingLogSummary :playing-log="playingLog" />
      </div>
    </div>
    <small class="float-right mr-1"><nuxt-link to="/playing-logs/new">演奏記録を追加</nuxt-link></small>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Tune } from '../../../models/Tune';
import PlayingLogSummary from '~/components/PlayingLogSummary.vue';
import StarRating from '~/components/StarRating.vue';
import Breadcrumb from '~/components/Breadcrumb.vue';
import { PlayingLog } from '../../../models/PlayingLog';

@Component({
  components: {
    PlayingLogSummary,
    StarRating,
    Breadcrumb
  },
  async asyncData({ app, params }) {
    const tune = await app.$api.getTune(params.id);
    // 最新5件表示
    const playingLogs = await app.$api.getPlayingLogsByTune(params.id, 0, 5);
    return { tune, playingLogs };
  },
  head(this: Index) {
    return {
      title: `${this.tune.title} ${this.tune.composer.fullName}作曲 - 演りログ`,
      meta: [{ hid: 'description', name: 'description', content: `${this.tune.description}` }]
    };
  }
})
export default class Index extends Vue {
  tune!: Tune;

  get displayGanres(): string {
    const genresString = this.tune.genres.map(g => g.name).toString();
    return genresString ? `/ ${genresString}` : '';
  }
  // ログ追加リンク
  async asyncData({ app, query }) {
    const tuneId = query.tuneId;
    const addLog = new PlayingLog();
    addLog.tune = tuneId ? await app.$api.getTune(tuneId) : null;
    this.$router.push({ path: '/playing-logs/new', query: { tuneId: tuneId!.toString() } });
  }
}
</script>
