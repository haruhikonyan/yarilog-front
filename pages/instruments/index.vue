<template>
  <section class="container">
    <div>
      <h1>
        楽器一覧
      </h1>
      <p v-for="tune in tunes" :key="tune.id">
        <!-- TODO URL は id ではなく作曲家コードとか作れればそっちにする なければ id -->
        <nuxt-link :to="`tunes/${tune.id}`">{{ tune.name }} の演奏記録が含まれた曲</nuxt-link>
      </p>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Tune } from '../../models/Tune';

@Component({
  components: {},
  async asyncData({ app }) {
    const tunes = await app.$api.getInstruments();
    return { tunes };
  }
})
export default class Index extends Vue {
  tunes!: Tune[];
}
</script>
