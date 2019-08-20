<template>
  <b-form class="d-flex" @submit.prevent="searchButtonHandler">
    <b-input v-model="searchWord" placeholder="演奏記録を探す"></b-input>
    <b-form-select v-model="selectedInstrumentId" class="w-auto">
      <option value="">全楽器</option>
      <option v-for="instrument in instruments" :key="instrument.id" :value="instrument.id.toString()">
        {{ instrument.shortName }}
      </option>
    </b-form-select>
    <b-button class="text-nowrap" type="submit" variant="primary">検索</b-button>
  </b-form>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import { PropType } from 'vue';
import { PlayingLog, PlayingLogSearchObject } from '../models/PlayingLog';
import { Instrument } from '../models/Instrument';

@Component({})
export default class PlayingLogSearchBox extends Vue {
  @Prop({ type: String, default: null })
  defaultSearchWord!: string | null;
  @Prop({ type: String, default: '' })
  defaultInstrumentId!: string | null;
  @Prop({ type: Array as PropType<Instrument[]> })
  instruments!: Instrument[];

  searchWord!: string | null;
  selectedInstrumentId!: string | null;

  created() {
    // Prop を子コンポーネントでいじるのはよくない
    this.searchWord = this.defaultSearchWord;
    this.selectedInstrumentId = this.defaultInstrumentId;
  }

  @Emit('on-search')
  searchButtonHandler(): PlayingLogSearchObject {
    return { searchWord: this.searchWord, instrumentId: this.selectedInstrumentId };
  }
}
</script>
