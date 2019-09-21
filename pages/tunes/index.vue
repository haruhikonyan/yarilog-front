<template>
  <section class="container">
    <Breadcrumb :composer="defaultComposer" :playstyle="defaultPlaystyle" :instrument="defaultInstrument" />
    <h1 class="text-center">{{ searchResultMessage }}</h1>
    <SearchForm
      :default-search-word="tuneSearchObject.searchWord"
      :default-playstyle-id="tuneSearchObject.playstyleId"
      :default-instrument-id="tuneSearchObject.instrumentId"
      :default-composer="defaultComposer"
      placeholder="曲を探す(フリーワード)"
      :instruments="$store.state.instruments"
      :playstyles="$store.state.playstyles"
      class="my-3"
      @on-select-composer="selectComposer($event)"
      @on-search="search($event)"
    />
    <b-alert v-if="tunes.length == 0" show variant="danger" class="yrl-pre-wrap">{{
      noHitSearchResultMessage
    }}</b-alert>
    <TuneCard v-for="tune in tunes" :key="tune.id" :tune="tune" />
    <!-- TODO 無限スクロールの方が今風かもしれない -->
    <b-pagination
      v-model="currentPage"
      align="center"
      :total-rows="totalCount"
      :per-page="perPage"
      @input="pagenationInputHandler($event)"
    ></b-pagination>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { PlayingLog } from '~/models/PlayingLog';
import TuneCard from '~/components/TuneCard.vue';
import SearchForm from '~/components/SearchForm.vue';
import Breadcrumb from '~/components/Breadcrumb.vue';
import { TuneSearchObject, Tune, PlayStyle } from '../../models/Tune';
import { Composer } from '../../models/Composer';
import { Instrument } from '../../models/Instrument';

@Component({
  components: {
    TuneCard,
    SearchForm,
    Breadcrumb
  },
  async asyncData({ app, query }) {
    // Tune の最大表示数を 10 に設定
    const perPage: number = 10;
    const searchWord = query.searchWord as string;
    const instrumentId = query.instrumentId as string;
    const composerId = query.composerId as string;
    const playstyleId = query.playstyleId as string;
    const genreId = query.genreId as string;
    const tuneSearchObject: TuneSearchObject = {
      searchWord,
      instrumentId,
      composerId,
      playstyleId,
      genreId
    };
    const offsetString = query.offset as string;
    // offset が未設定 NaN になるのでその時は 0 をセット
    const offset = isNaN(Number(offsetString)) ? 0 : Number(offsetString);
    // tune に紐づく PlayingLog は最大5件にしておく
    const { tunes, totalCount } = await app.$api.searchTunes(tuneSearchObject, offset, perPage, 5);
    // offset の値から現在のページを計算
    const currentPage: number = offset === 0 ? 1 : Math.floor(offset / perPage) + 1;

    // 作曲家が検索条件にあれば、パンくずや検索フォームで使う作曲家データを取得しておく
    const defaultComposer = composerId ? await app.$api.getComposer(composerId) : null;
    return { tunes, totalCount, tuneSearchObject, offset, currentPage, perPage, defaultComposer };
  },
  head(this: Index) {
    const searchWord = this.tuneSearchObject.searchWord || '';
    return {
      title: `${searchWord} 曲検索結果 - 演りログ`,
      meta: [{ hid: 'description', name: 'description', content: `${searchWord} 曲検索結果` }]
    };
  }
})
export default class Index extends Vue {
  tunes!: Tune[];
  totalCount!: number;
  tuneSearchObject!: TuneSearchObject;
  offset!: number;
  currentPage!: number;
  perPage!: number;

  noHitSearchResultMessage =
    '検索した曲はありませんでした。\n作曲家の名前などの表記揺れにご注意ください。\n例）ベートーベン => ベートーヴェン';

  defaultComposer!: Composer | null;

  get defaultPlaystyle(): PlayStyle | null {
    return this.$store.state.playstyles.find(p => p.id.toString() === this.tuneSearchObject.playstyleId);
  }
  get defaultInstrument(): Instrument | null {
    return this.$store.state.instruments.find(i => i.id.toString() === this.tuneSearchObject.instrumentId);
  }

  async search(tuneSearchObject: TuneSearchObject) {
    this.tuneSearchObject = tuneSearchObject;
    // offset は 0 で初期化
    this.offset = 0;
    const tunesWithCount = await this.$api.searchTunes(tuneSearchObject, this.offset, this.perPage, 5);
    this.tunes = tunesWithCount.tunes;
    this.totalCount = tunesWithCount.totalCount;
    // 作曲家が検索条件にあれば、パンくずや検索フォームで使う作曲家データを再取得する
    this.defaultComposer = this.tuneSearchObject.composerId
      ? await this.$api.getComposer(this.tuneSearchObject.composerId)
      : null;
    this.$router.push({
      path: 'tunes',
      query: {
        searchWord: this.tuneSearchObject.searchWord,
        instrumentId: this.tuneSearchObject.instrumentId,
        composerId: this.tuneSearchObject.composerId,
        playstyleId: this.tuneSearchObject.playstyleId,
        genreId: this.tuneSearchObject.genreId,
        offset: this.offset.toString()
      }
    });
  }
  async pagenationInputHandler(currentPage) {
    // 現在のページ数から offset を計算
    this.offset = this.perPage * (currentPage - 1);
    const playingLogsWithCount = await this.$api.searchTunes(this.tuneSearchObject, this.offset, this.perPage, 5);
    this.tunes = playingLogsWithCount.tunes;
    this.totalCount = playingLogsWithCount.totalCount;
    this.$router.push({
      path: 'tunes',
      query: {
        searchWord: this.tuneSearchObject.searchWord,
        instrumentId: this.tuneSearchObject.instrumentId,
        composerId: this.tuneSearchObject.composerId,
        playstyleId: this.tuneSearchObject.playstyleId,
        genreId: this.tuneSearchObject.genreId,
        offset: this.offset.toString()
      }
    });
    // ページャークリック後最上部までスクロールを戻す
    window.scrollTo(0, 0);
  }
  get searchResultMessage(): string {
    const lastCount = this.offset + this.perPage < this.totalCount ? this.offset + this.perPage : this.totalCount;

    return this.totalCount === 0
      ? '検索した曲はありませんでした。'
      : `${Number(this.offset) + 1}~${lastCount}曲目表示 / 全${this.totalCount}曲`;
  }

  selectComposer(composer: Composer) {
    this.defaultComposer = composer;
  }
}
</script>
