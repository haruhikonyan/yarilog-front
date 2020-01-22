<template>
  <section>
    <Breadcrumb :composer="defaultComposer" :playstyle="defaultPlaystyle" :instrument="defaultInstrument" />
    <h2 class="text-center">{{ searchResultMessage }}</h2>
    <div v-if="tuneSearchObject.searchWord">【キーワード】{{ tuneSearchObject.searchWord }}</div>
    <div>【楽器】{{ defaultInstrument ? defaultInstrument.name : '全楽器' }}</div>
    <div>【編成】{{ defaultPlaystyle ? defaultPlaystyle.name : '全編成' }}</div>
    <div>【作曲家】{{ defaultComposer ? defaultComposer.fullName : '全作曲家' }}</div>
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
    <!-- TODO ジャンル、国に対応する -->
    <adsbygoogle class="mt-2" :ad-slot="topAdId" ad-format="horizontal" />
    <b-alert v-if="searchResultAlartMessage != null" show variant="danger" class="yrl-pre-wrap">{{
      searchResultAlartMessage
    }}</b-alert>
    <TuneCard v-for="tune in tunes" :key="tune.id" :tune="tune" />
    <p v-if="isShowChangeAllTunesModeLink" class="text-center text-primary" @click="onChangeAllTunesMode()">
      演奏記録の無い曲も表示する
    </p>
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
  @Prop({ type: Boolean, default: false })
  isNoHitPlayingLogs!: boolean;

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

  @Emit('on-change-all-tunes-mode')
  onChangeAllTunesMode(): void {}

  /**
   * すべての曲を表示するモードへの切り替え表示
   */
  get isShowChangeAllTunesModeLink(): boolean {
    // すべての曲表示モードでないかつ、ページネーションが最後のページであれば
    return !this.isAllTunesMode && this.totalCount === this.lastCount;
  }

  get defaultPlaystyle(): PlayStyle | null {
    return this.$store.state.playstyles.find(p => p.id.toString() === this.tuneSearchObject.playstyleId);
  }
  get defaultInstrument(): Instrument | null {
    return this.$store.state.instruments.find(i => i.id.toString() === this.tuneSearchObject.instrumentId);
  }
  get searchResultMessage(): string {
    if (this.totalCount === 0) {
      return '検索した演奏記録はありませんでした。';
    } else if (this.totalCount === 1) {
      return '1曲目表示 / 全1曲';
    } else {
      return `${Number(this.offset) + 1}~${this.lastCount}曲目表示 / 全${this.totalCount}曲`;
    }
  }
  get lastCount(): number {
    return this.offset + this.perPage < this.totalCount ? this.offset + this.perPage : this.totalCount;
  }

  get searchResultAlartMessage() {
    if (this.totalCount === 0) {
      return '検索した演奏記録はありませんでした。\n曲名などの表記揺れにご注意ください。\n例）タイタン => 巨人';
    } else if (this.isAllTunesMode && this.isNoHitPlayingLogs) {
      return '演奏記録が見つからなかったので条件にマッチする曲のみを表示しています。';
    }
    return null;
  }
  get topAdId(): string {
    return process.env.topAdId!;
  }
}
</script>
