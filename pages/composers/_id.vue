<template>
  <section class="container">
    <div>
      <h3>{{ composer.fullName }}の演奏記録一覧</h3>
    </div>
    <TuneCard v-for="tune in tunes" :key="tune.id" :tune="tune" />
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import TuneCard from '../../components/TuneCard.vue';
import { Tune } from '../../models/Tune';
@Component({
  components: {
    TuneCard
  },
  async asyncData({ app, params }) {
    const tunes = await app.$api.get(params.id);
    const composer = await app.$api.searchTunes(params.id);
    return { tunes, composer };
  }
})
export default class Index extends Vue {
  tunes: Tune[] = [];
}
</script>
