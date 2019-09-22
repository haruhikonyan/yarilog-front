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
        :default-composer="selectedComposer"
        placeholder="作曲家で絞る"
        @on-select="onSelectComposer($event)"
      />
      <!-- TODO 1文字入力で disabled の場合にツールチップか何かで2文字以上入力してくださいと出す -->
      <b-button
        class="text-nowrap"
        type="submit"
        variant="primary"
        value="検索"
        :disabled="searchWord != null && searchWord.length === 1"
      >
        検索
      </b-button>
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

  searchWord: string | null = null;
  selectedPlaystyleId: string | null = null;
  selectedInstrumentId: string | null = null;
  selectedComposer: Composer | null = null;

  created() {
    // default があればそれを初期選択とする
    this.searchWord = this.defaultSearchWord;
    this.selectedPlaystyleId = this.defaultPlaystyleId;
    this.selectedInstrumentId = this.defaultInstrumentId;
    this.selectedComposer = this.defaultComposer;
  }

  onSelectComposer(composer: Composer | null) {
    this.selectedComposer = composer;
  }
  removeComposer() {
    this.selectedComposer = null;
  }

  @Emit('on-search')
  searchButtonHandler(): TuneSearchObject {
    return {
      searchWord: this.searchWord,
      instrumentId: this.selectedInstrumentId,
      composerId: this.selectedComposer ? this.selectedComposer.id!.toString() : null,
      playstyleId: this.selectedPlaystyleId,
      genreId: null
    };
  }
}
</script>
