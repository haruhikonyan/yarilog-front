<template>
  <section class="container">
    <SearchResult
      :tune-search-object="tuneSearchObject"
      :tunes="tunes"
      :total-count="totalCount"
      :offset="offset"
      :per-page="perPage"
      :description="defaultInstrument.description"
      :is-all-tunes-mode="true"
      @on-search="search($event)"
      @on-pagenation-input="pagenationInputHandler($event)"
    />
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import SearchResult from '~/components/SearchResult.vue';
import { TuneSearchObject, Tune } from '../../models/Tune';
import { Instrument } from '../../models/Instrument';
@Component({
  components: {
    SearchResult
  },
  async asyncData({ app, query, params, store }) {
    // Tune の最大表示数を 10 に設定
    const perPage: number = 10;
    const tuneSearchObject: TuneSearchObject = {
      searchWord: undefined,
      instrumentId: params.id,
      composerId: undefined,
      playstyleId: undefined,
      genreId: undefined
    };
    const offsetString = query.offset as string;
    // offset が未設定 NaN になるのでその時は 0 をセット
    const offset = isNaN(Number(offsetString)) ? 0 : Number(offsetString);
    // tune に紐づく PlayingLog は最大5件にしておく
    const { tunes, totalCount } = await app.$api.searchTunes(tuneSearchObject, offset, perPage, 5);
    const defaultInstrument = store.state.instruments.find(i => i.id.toString() === params.id);
    return { tunes, totalCount, tuneSearchObject, offset, perPage, defaultInstrument };
  },
  head(this: Index) {
    const title = `${this.defaultInstrument.name} 演奏記録検索結果 - みゅーぐ`;
    const description = this.defaultInstrument.description || title;

    return {
      title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: description
        },
        { hid: 'og:title', property: 'og:title', content: title },
        {
          hid: 'og:description',
          property: 'og:description',
          content: description
        }
      ]
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
  defaultInstrument!: Instrument;

  defaultPlaystyleId!: number | null;

  async search(tuneSearchObject: TuneSearchObject) {
    this.tuneSearchObject = tuneSearchObject;
    // offset は 0 で初期化
    this.offset = 0;
    const tunesWithCount = await this.$api.searchTunes(tuneSearchObject, this.offset, this.perPage, 5);
    this.tunes = tunesWithCount.tunes;
    this.totalCount = tunesWithCount.totalCount;
    this.$router.push({
      path: '/tunes',
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
      query: {
        offset: this.offset.toString()
      }
    });
    // ページャークリック後最上部までスクロールを戻す
    window.scrollTo(0, 0);
  }
}
</script>
