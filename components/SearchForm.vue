<template>
  <b-form @submit.prevent="searchButtonHandler">
    <div class="d-flex">
      <b-input v-model="searchWord" :placeholder="placeholder"></b-input>
      <b-form-select v-model="selectedPlaystyleId" class="w-auto">
        <option value="">演奏形態</option>
        <option v-for="playstyle in playstyles" :key="playstyle.id" :value="playstyle.id.toString()">
          {{ playstyle.name }}
        </option>
      </b-form-select>
    </div>
    <div class="d-flex">
      <b-form-select v-model="selectedInstrumentId" class="w-auto">
        <option value="">全楽器</option>
        <option v-for="instrument in instruments" :key="instrument.id" :value="instrument.id.toString()">
          {{ instrument.shortName }}
        </option>
      </b-form-select>
      <ComposerSelector
        class="flex-grow-1"
        :default-composer="defaultComposer"
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
import { TuneSearchObject, PlayStyle } from '../models/Tune';
import ComposerSelector from './ComposerSelector.vue';

@Component({
  components: {
    ComposerSelector
  }
})
export default class SearchForm extends Vue {
  @Prop({ type: String, default: null })
  defaultSearchWord!: string | null;
  // 初期値をから文字列にすることでデフォルトに 演奏形態 が表示される
  @Prop({ type: String, default: '' })
  defaultPlaystyleId!: string | null;
  // 初期値をから文字列にすることでデフォルトに 全楽器 が表示される
  @Prop({ type: String, default: '' })
  defaultInstrumentId!: string | null;
  @Prop({ type: Object as PropType<Composer>, default: null })
  defaultComposer!: Composer | null;
  @Prop({ type: Array as PropType<Instrument[]> })
  instruments!: Instrument[];
  @Prop({ type: Array as PropType<PlayStyle[]> })
  playstyles!: PlayStyle[];
  @Prop({ type: String })
  placeholder!: string[];

  searchWord!: string | null;
  selectedPlaystyleId!: string | null;
  selectedInstrumentId!: string | null;
  selectedComposerId!: string | null;

  created() {
    // Prop を子コンポーネントでいじるのはよくない
    this.searchWord = this.defaultSearchWord;
    this.selectedPlaystyleId = this.defaultPlaystyleId;
    this.selectedInstrumentId = this.defaultInstrumentId;
    this.selectedComposerId = this.defaultComposer ? this.defaultComposer.id!.toString() : null;
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
      playstyleId: this.selectedPlaystyleId,
      genreId: null
    };
  }
}
</script>
