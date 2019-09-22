<template>
  <section class="container">
    <div>
      <h1>
        楽器一覧
      </h1>
      <p v-for="instrument in instruments" :key="instrument.id">
        <!-- TODO URL は id ではなく作曲家コードとか作れればそっちにする なければ id -->
        <nuxt-link :to="`instruments/${instrument.id}`">{{ instrument.name }} の演奏記録が含まれた曲</nuxt-link>
      </p>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Instrument } from '../../models/Instrument';

@Component({
  components: {},
  async asyncData({ app }) {
    const instruments = await app.$api.getInstruments();
    return { instruments };
  }
})
export default class Index extends Vue {
  instruments!: Instrument[];
}
</script>
