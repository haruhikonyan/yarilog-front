<template>
  <section class="container">
    <div>
      <h1 class="text-center">{{ searchResultMessage }}</h1>
      <SearchBox
        :default-search-word="searchWord"
        :default-instrument-id="instrumentId"
        :placeholder="'曲を探す'"
        :instruments="$store.state.instruments"
        class="my-3"
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
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { PlayingLog } from '~/models/PlayingLog';
import TuneCard from '~/components/TuneCard.vue';
import SearchBox from '~/components/SearchBox.vue';
import { TuneSearchObject, Tune } from '../../models/Tune';

@Component({
  components: {
    TuneCard,
    SearchBox
  },
  async asyncData({ app, query }) {
    // Tune の最大表示数を 10 に設定
    const perPage: number = 10;
    const searchWord = query.searchWord as string;
    const instrumentId = query.instrumentId as string;
    const composerId = query.composerId as string;
    const playstyleId = query.playstyleId as string;
    const genreId = query.genreId as string;
    const offsetString = query.offset as string;
    // offset が未設定 NaN になるのでその時は 0 をセット
    const offset = isNaN(Number(offsetString)) ? 0 : Number(offsetString);
    // tune に紐づく PlayingLog は最大5件にしておく
    const { tunes, totalCount } = await app.$api.searchTunes(
      searchWord,
      instrumentId,
      composerId,
      playstyleId,
      genreId,
      offset,
      perPage,
      5
    );
    // offset の値から現在のページを計算
    const currentPage: number = offset === 0 ? 1 : Math.floor(offset / perPage) + 1;
    return { tunes, totalCount, searchWord, instrumentId, composerId, offset, currentPage, perPage };
  },
  head(this: Index) {
    const searchWord = this.searchWord || '';
    return {
      title: `${searchWord} 曲検索結果 - 演りログ`,
      meta: [{ hid: 'description', name: 'description', content: `${searchWord} 曲検索結果` }]
    };
  }
})
export default class Index extends Vue {
  tunes!: Tune[];
  totalCount!: number;
  searchWord!: string;
  instrumentId: string | null = null;
  composerId: string | null = null;
  playstyleId: string | null = null;
  genreId: string | null = null;
  offset!: number;
  currentPage!: number;
  perPage!: number;

  noHitSearchResultMessage =
    '検索した曲はありませんでした。\n作曲家の名前などの表記揺れにご注意ください。\n例）ベートーベン => ベートーヴェン';

  async search(tuneSearchObject: TuneSearchObject) {
    const { searchWord, instrumentId, composerId, playstyleId, genreId } = tuneSearchObject;
    // offset は 0 で初期化
    this.offset = 0;
    const tunesWithCount = await this.$api.searchTunes(
      searchWord,
      instrumentId,
      composerId,
      playstyleId,
      genreId,
      this.offset,
      this.perPage,
      5
    );
    this.tunes = tunesWithCount.tunes;
    this.totalCount = tunesWithCount.totalCount;
    this.$router.push({
      path: 'tunes',
      query: {
        searchWord: this.searchWord,
        instrumentId: this.instrumentId,
        composerId: this.composerId,
        playstyleId: this.playstyleId,
        genreId: this.genreId,
        offset: this.offset.toString()
      }
    });
  }
  async pagenationInputHandler(currentPage) {
    // 現在のページ数から offset を計算
    this.offset = this.perPage * (currentPage - 1);
    const playingLogsWithCount = await this.$api.searchTunes(
      this.searchWord,
      this.instrumentId,
      this.composerId,
      this.playstyleId,
      this.genreId,
      this.offset,
      this.perPage,
      5
    );
    this.tunes = playingLogsWithCount.tunes;
    this.totalCount = playingLogsWithCount.totalCount;
    this.$router.push({
      path: 'tunes',
      query: {
        searchWord: this.searchWord,
        instrumentId: this.instrumentId,
        composerId: this.composerId,
        playstyleId: this.playstyleId,
        genreId: this.genreId,
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
}
</script>
