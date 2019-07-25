<template>
  <section class="container">
    <div>
      <h1>
        国一覧
      </h1>
      <p v-for="country in countries" :key="country.id">
        <!-- TODO URL は id ではなく国コードとか作れればそっちにする なければ id -->
        <nuxt-link :to="`countries/${country.id}`">{{ country.name }} 出身作曲家の演奏ログ</nuxt-link>
      </p>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Country } from '../../models/Country';

@Component({
  components: {},
  async asyncData({ app }) {
    const data = await app.$api.getCountries();
    return { countries: data };
  }
})
export default class Index extends Vue {
  composers: Country[] = [];
}
</script>
