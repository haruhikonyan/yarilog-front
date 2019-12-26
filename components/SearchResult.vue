<template>
  <section>
    <Breadcrumb :composer="defaultComposer" :playstyle="defaultPlaystyle" :instrument="defaultInstrument" />
    <h2 class="text-center">{{ searchResultMessage }}</h2>
    <adsbygoogle :ad-slot="topAdId" ad-format="horizontal" />
    <SearchForm
      :default-search-word="tuneSearchObject.searchWord"
      :default-playstyle-id="tuneSearchObject.playstyleId"
      :default-instrument-id="tuneSearchObject.instrumentId"
      :default-composer="defaultComposer"
      placeholder="演奏記録を探す(フリーワード)"
      :instruments="$store.state.instruments"
      :playstyles="$store.state.playstyles"
      class="my-3"
      @on-search="onSearch($event)"
    />
    <b-alert v-if="searchResultAlartMessage != null" show variant="danger" class="yrl-pre-wrap">{{
      searchResultAlartMessage
    }}</b-alert>
    <TuneCard v-for="tune in tunes" :key="tune.id" :tune="tune" />
    <!-- TODO 無限スクロールの方が今風かもしれない -->
    <b-pagination
      v-model="currentPage"
      align="center"
      :total-rows="totalCount"
      :per-page="perPage"
      @input="onPagenationInput($event)"
    />
    <pre v-if="description" class="yrl-pre-wrap">{{ description }}</pre>
  </section>
</template>

<script lang="ts">
import { PropType } from 'vue';
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import TuneCard from '~/components/TuneCard.vue';
import SearchForm from '~/components/SearchForm.vue';
import Breadcrumb from '~/components/Breadcrumb.vue';
import { TuneSearchObject, Tune, PlayStyle } from '../models/Tune';
import { Instrument } from '../models/Instrument';
import { Composer } from '../models/Composer';

@Component({
  components: {
    TuneCard,
    SearchForm,
    Breadcrumb
  }
})
export default class SearchResult extends Vue {
  @Prop({ type: Object as PropType<TuneSearchObject>, required: true })
  tuneSearchObject!: TuneSearchObject;
  @Prop({ type: Array as PropType<Tune[]>, required: true })
  tunes!: Tune[];
  @Prop({ type: Number, required: true })
  totalCount!: number;
  @Prop({ type: Number, required: true })
  offset!: number;
  @Prop({ type: Number, default: 10 })
  perPage!: number;
  @Prop({ type: String, default: null })
  description!: string;
  @Prop({ type: Boolean, default: false })
  isAllTunesMode!: boolean;

  currentPage: number = this.offset === 0 ? 1 : Math.floor(this.offset / this.perPage) + 1;

  @Prop({ type: Object as PropType<Composer>, default: null })
  defaultComposer!: Composer | null;

  @Emit('on-search')
  onSearch(tuneSearchObject: TuneSearchObject): TuneSearchObject {
    return tuneSearchObject;
  }

  @Emit('on-pagenation-input')
  onPagenationInput(currentPage: number): number {
    return currentPage;
  }

  get defaultPlaystyle(): PlayStyle | null {
    return this.$store.state.playstyles.find(p => p.id.toString() === this.tuneSearchObject.playstyleId);
  }
  get defaultInstrument(): Instrument | null {
    return this.$store.state.instruments.find(i => i.id.toString() === this.tuneSearchObject.instrumentId);
  }
  get searchResultMessage(): string {
    const lastCount: number =
      this.offset + this.perPage < this.totalCount ? this.offset + this.perPage : this.totalCount;

    if (this.totalCount === 0) {
      return '検索した演奏記録はありませんでした。';
    } else if (this.totalCount === 1) {
      return '1曲目表示 / 全1曲';
    } else {
      return `${Number(this.offset) + 1}~${lastCount}曲目表示 / 全${this.totalCount}曲`;
    }
  }

  get searchResultAlartMessage() {
    if (this.totalCount === 0) {
      return '検索した演奏記録はありませんでした。\n曲名などの表記揺れにご注意ください。\n例）タイタン => 巨人';
    } else if (this.isAllTunesMode) {
      return '演奏記録が見つからなかったので条件にマッチする曲のみを表示しています。';
    }
    return null;
  }
  get topAdId(): string {
    return process.env.topAdId!;
  }
}
</script>
