<template>
  <section class="container">
    <div>
      <h1>
        楽器一覧
      </h1>
      <p v-for="instrument in $store.state.instruments" :key="instrument.id">
        <!-- TODO URL は id ではなく楽器コードとか作れればそっちにする なければ id -->
        <nuxt-link :to="`instruments/${instrument.id}`">{{ instrument.name }} の演奏ログ</nuxt-link>
      </p>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Instrument } from '../../models/Instrument';

@Component({
  components: {}
})
export default class Index extends Vue {}
</script>
