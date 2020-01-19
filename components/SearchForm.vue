<template>
  <section>
    <b-form @submit.prevent="searchButtonHandler">
      <div class="d-flex">
        <b-input v-model="searchWord" :placeholder="placeholder" class="yrl-left-border-round"></b-input>
        <b-form-select v-model="selectedInstrumentId" class="w-auto rounded-0">
          <option value="">全楽器</option>
          <option v-for="instrument in instruments" :key="instrument.id" :value="instrument.id.toString()">
            {{ instrument.shortName }}
          </option>
        </b-form-select>
        <!-- TODO 1文字入力で disabled の場合にツールチップか何かで2文字以上入力してくださいと出す -->
        <b-button
          class="text-nowrap yrl-right-border-round"
          type="submit"
          variant="primary"
          :disabled="searchWord != null && searchWord.length === 1"
        >
          <font-awesome-icon icon="search" />
        </b-button>
      </div>
    </b-form>
    <div class="text-right text-primary mt-1 mr-3"><span v-b-modal.detail-search>詳細検索</span></div>
    <b-modal id="detail-search" title="詳細検索">
      <b-form-group>
        <b-input v-model="searchWord" :placeholder="placeholder" class="rounded-pill"></b-input>
      </b-form-group>
      <b-form-group label="楽器：" label-cols="3">
        <b-form-select v-model="selectedInstrumentId">
          <option value="">全楽器</option>
          <option v-for="instrument in instruments" :key="instrument.id" :value="instrument.id.toString()">
            {{ instrument.name }}
          </option>
        </b-form-select>
      </b-form-group>
      <b-form-group label="編成：" label-cols="3">
        <b-form-select v-model="selectedPlaystyleId" class="w-auto yrl-playstyle-selector">
          <option value="">全編成</option>
          <option v-for="playstyle in playstyles" :key="playstyle.id" :value="playstyle.id.toString()">
            {{ playstyle.name }}
          </option>
        </b-form-select>
      </b-form-group>
      <b-form-group label="作曲家：" label-cols="3">
        <ComposerSelector
          class="flex-grow-1"
          :default-composer="selectedComposer"
          placeholder="作曲家で絞る"
          @on-select="onSelectComposer($event)"
        />
      </b-form-group>
      <!-- TODO ジャンル、国に対応する -->
      <div slot="modal-footer" class="d-flex w-100">
        <b-button class="mr-2" variant="secondary" @click="$bvModal.hide('detail-search')">
          閉じる
        </b-button>
        <b-button class="flex-grow-1" variant="primary" @click="searchButtonHandler">
          検索
        </b-button>
      </div>
    </b-modal>
  </section>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import { PropType } from 'vue';
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
    // モーダルを閉じる
    this.$bvModal.hide('detail-search');
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
<style lang="scss" scoped>
.yrl-playstyle-selector {
  max-width: 120px;
}
.yrl-left-border-round {
  border-radius: 1rem 0 0 1rem;
}
.yrl-right-border-round {
  border-radius: 0 1rem 1rem 0;
}
</style>
