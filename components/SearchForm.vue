<template>
  <b-form @submit.prevent="searchButtonHandler">
    <b-input v-model="searchWord" :placeholder="placeholder"></b-input>
    <div class="d-flex">
      <b-form-select v-model="selectedInstrumentId" class="w-auto">
        <option value="">全楽器</option>
        <option v-for="instrument in instruments" :key="instrument.id" :value="instrument.id.toString()">
          {{ instrument.shortName }}
        </option>
      </b-form-select>
      <ComposerSelector
        class="flex-grow-1"
        :default-composer-id="defaultComposerId"
        @on-select="onSelectComposer($event)"
        @remove-composer="removeComposerId"
      />
      <b-button class="text-nowrap" type="submit" variant="primary">検索</b-button>
    </div>
  </b-form>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import { PropType } from 'vue';
import { PlayingLog } from '../models/PlayingLog';
import { Instrument } from '../models/Instrument';
import { Composer } from '../models/Composer';
import { TuneSearchObject } from '../models/Tune';
import ComposerSelector from './ComposerSelector.vue';

@Component({
  components: {
    ComposerSelector
  }
})
export default class SearchForm extends Vue {
  @Prop({ type: String, default: null })
  defaultSearchWord!: string | null;
  // 初期値をから文字列にすることでデフォルトに 全楽器 が表示される
  @Prop({ type: String, default: '' })
  defaultInstrumentId!: string | null;
  @Prop({ type: String, default: null })
  defaultComposerId!: string | null;
  @Prop({ type: Array as PropType<Instrument[]> })
  instruments!: Instrument[];
  @Prop({ type: String })
  placeholder!: string[];

  searchWord!: string | null;
  selectedInstrumentId!: string | null;
  selectedComposerId!: string | null;

  created() {
    // Prop を子コンポーネントでいじるのはよくない
    this.searchWord = this.defaultSearchWord;
    this.selectedInstrumentId = this.defaultInstrumentId;
    this.selectedComposerId = this.defaultComposerId;
  }

  onSelectComposer(composerId: string) {
    this.selectedComposerId = composerId;
  }
  removeComposerId() {
    this.selectedComposerId = null;
  }

  @Emit('on-search')
  searchButtonHandler(): TuneSearchObject {
    return {
      searchWord: this.searchWord,
      instrumentId: this.selectedInstrumentId,
      composerId: this.selectedComposerId,
      playstyleId: null,
      genreId: null
    };
  }
}
</script>
