<template>
  <b-form class="d-flex" @submit.prevent="searchButtonHandler">
    <b-input v-model="searchWord" placeholder="演奏記録を探す"></b-input>

    <b-button class="text-nowrap" type="submit" variant="primary">検索</b-button>
  </b-form>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import { PlayingLog } from '../models/PlayingLog';

@Component({})
export default class PlayingLogSearchBox extends Vue {
  @Prop({ type: String, default: null })
  defaultSearchWord!: string | null;

  searchWord!: string | null;

  created() {
    // Prop を子コンポーネントでいじるのはよくない
    this.searchWord = this.defaultSearchWord;
  }

  @Emit('on-search')
  searchButtonHandler() {
    return this.searchWord;
  }
}
</script>
