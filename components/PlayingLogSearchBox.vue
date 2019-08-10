<template>
  <b-form class="d-flex" @submit.prevent="search">
    <b-input v-model="searchWord" placeholder="演奏記録を探す"></b-input>

    <b-button class="text-nowrap" type="submit" variant="primary">検索</b-button>
  </b-form>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { PlayingLog } from '../models/PlayingLog';

@Component({})
export default class PlayingLogSearchBox extends Vue {
  @Prop({ type: String, default: null })
  searchWord!: string | null;

  search() {
    if (this.searchWord) {
      this.$router.push({ path: 'playing-logs', query: { searchWord: this.searchWord } });
    }
  }
}
</script>
