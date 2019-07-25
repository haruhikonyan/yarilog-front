<template>
  <section class="container">
    <div>
      <h1>
        作曲家一覧
      </h1>
      <p v-for="composer in composers" :key="composer.id">
        <!-- TODO URL は id ではなく作曲家コードとか作れればそっちにする なければ id -->
        <nuxt-link :to="`composers/${composer.id}`">{{ composer.fullName }} の演奏ログ</nuxt-link>
      </p>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Composer } from '../../models/Composer';

@Component({
  components: {},
  async asyncData({ app }) {
    const data = await app.$api.getComposers();
    return { composers: data };
  }
})
export default class Index extends Vue {
  composers: Composer[] = [];
}
</script>
