<template>
  <section class="container">
    <div>
      <h1>
        演奏形態一覧
      </h1>
      <p v-for="playstyle in playstyles" :key="playstyle.id">
        <!-- TODO URL は id ではなく作曲家コードとか作れればそっちにする なければ id -->
        <nuxt-link :to="`playstyles/${playstyle.id}`">{{ playstyle.name }} の曲</nuxt-link>
      </p>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { PlayStyle } from '../../models/Tune';

@Component({
  components: {},
  async asyncData({ app }) {
    const playstyles = await app.$api.getPlaystyles();
    return { playstyles };
  }
})
export default class Index extends Vue {
  playstyles!: PlayStyle[];
}
</script>
