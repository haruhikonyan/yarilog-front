<template>
  <section class="container">
    <SearchResult
      :tune-search-object="tuneSearchObject"
      :tunes="tunes"
      :total-count="totalCount"
      :offset="offset"
      :per-page="perPage"
      :default-composer="defaultComposer"
      :description="defaultComposer.description"
      @on-search="search($event)"
      @on-pagenation-input="pagenationInputHandler($event)"
    />
    <nuxt-link class="small d-block text-right" :to="inquiryMistakeLocation">
      作曲家情報が間違っている
    </nuxt-link>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import SearchResult from '~/components/SearchResult.vue';
import { TuneSearchObject, Tune } from '../../models/Tune';
import { Composer } from '../../models/Composer';

@Component({
  components: {
    SearchResult
  },
  async asyncData({ app, query, params }) {
    // Tune の最大表示数を 10 に設定
    const perPage: number = 10;
    const tuneSearchObject: TuneSearchObject = {
      searchWord: undefined,
      instrumentId: undefined,
      composerId: params.id,
      playstyleId: undefined,
      genreId: undefined
    };
    const offsetString = query.offset as string;
    // offset が未設定 NaN になるのでその時は 0 をセット
    const offset = isNaN(Number(offsetString)) ? 0 : Number(offsetString);
    // tune に紐づく PlayingLog は最大5件にしておく
    const { tunes, totalCount } = await app.$api.searchTunes(tuneSearchObject, offset, perPage, 5);
    // 作曲家が検索条件にあれば、パンくずや検索フォームで使う作曲家データを取得しておく
    const defaultComposer = await app.$api.getComposer(params.id);
    return { tunes, totalCount, tuneSearchObject, offset, perPage, defaultComposer };
  },
  head(this: Index) {
    return {
      title: `${this.defaultComposer!.fullName} 曲検索結果 - みゅーぐ`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: `${this.defaultComposer!.fullName} 曲検索結果 ${this.defaultComposer!.description}`
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

  defaultComposer!: Composer | null;

  get inquiryMistakeLocation() {
    return { path: '/inquiry', query: { inquiryTypeId: '2', content: `path: ${this.$route.path}` } };
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
