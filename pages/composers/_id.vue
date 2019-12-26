<template>
  <section class="container">
    <SearchResult
      :tune-search-object="tuneSearchObject"
      :tunes="tunes"
      :total-count="totalCount"
      :offset="offset"
      :per-page="perPage"
      :description="defaultComposer.description"
      :is-all-tunes-mode="isAllTunesMode"
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
    let searchResultObject = await app.$api.searchTunes(tuneSearchObject, offset, perPage, 5);
    let isAllTunesMode = false;
    // 1件も見つからなかったら曲のみの検索に切り替える
    if (searchResultObject.totalCount === 0) {
      searchResultObject = await app.$api.searchAllTunes(tuneSearchObject, offset, perPage);
      isAllTunesMode = true;
    }
    // 作曲家が検索条件にあれば、パンくずや検索フォームで使う作曲家データを取得しておく
    const defaultComposer = await app.$api.getComposer(params.id);
    return {
      tunes: searchResultObject.tunes,
      totalCount: searchResultObject.totalCount,
      tuneSearchObject,
      offset,
      perPage,
      defaultComposer,
      isAllTunesMode
    };
  },
  head(this: Index) {
    const title = `${this.defaultComposer!.displayName} 演奏記録検索結果 - みゅーぐ`;
    const description = this.defaultComposer!.description || title;
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

  defaultComposer!: Composer | null;

  isAllTunesMode!: boolean;

  get inquiryMistakeLocation() {
    return { path: '/inquiry', query: { inquiryTypeId: '2', content: `path: ${this.$route.path}` } };
  }

  async search(tuneSearchObject: TuneSearchObject) {
    this.tuneSearchObject = tuneSearchObject;
    // offset は 0 で初期化
    this.offset = 0;
    this.isAllTunesMode = false;
    let tunesWithCount = await this.$api.searchTunes(tuneSearchObject, this.offset, this.perPage, 5);
    // 1件も見つからなかったら曲のみの検索に切り替える
    if (tunesWithCount.totalCount === 0) {
      tunesWithCount = await this.$api.searchAllTunes(tuneSearchObject, this.offset, this.perPage);
      this.isAllTunesMode = true;
    }
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
