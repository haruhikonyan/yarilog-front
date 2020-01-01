<template>
  <section class="container">
    <SearchResult
      :tune-search-object="tuneSearchObject"
      :tunes="tunes"
      :total-count="totalCount"
      :offset="offset"
      :per-page="perPage"
      :description="defaultGenre.description"
      :is-all-tunes-mode="isAllTunesMode"
      :is-no-hit-playing-logs="isNoHitPlayingLogs"
      @on-search="search($event)"
      @on-pagenation-input="pagenationInputHandler($event)"
      @on-change-all-tunes-mode="changeAllTunesModeHandler()"
    />
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import SearchResult from '~/components/SearchResult.vue';
import { TuneSearchObject, Tune, Genre } from '../../models/Tune';
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
      composerId: undefined,
      playstyleId: undefined,
      genreId: params.id
    };
    const offsetString = query.offset as string;
    // offset が未設定 NaN になるのでその時は 0 をセット
    const offset = isNaN(Number(offsetString)) ? 0 : Number(offsetString);

    // isAllTunesMode が true という文字列かどうかで判断
    let isAllTunesMode = query.isAllTunesMode === 'true';

    // isAllTunesMode が指定されていたら全ての曲を出す
    let searchResultObject = isAllTunesMode
      ? await app.$api.searchAllTunes(tuneSearchObject, offset, perPage, 5)
      : await app.$api.searchTunes(tuneSearchObject, offset, perPage, 5);
    // 演奏記録が見つからなかったフラグを初期化
    let isNoHitPlayingLogs = false;
    // 1件も見つからなかったら曲のみの検索に切り替える
    if (searchResultObject.totalCount === 0) {
      searchResultObject = await app.$api.searchAllTunes(tuneSearchObject, offset, perPage);
      isAllTunesMode = true;
      isNoHitPlayingLogs = true;
    }
    const defaultGenre = await app.$api.getGenre(params.id);
    return {
      tunes: searchResultObject.tunes,
      totalCount: searchResultObject.totalCount,
      tuneSearchObject,
      offset,
      perPage,
      defaultGenre,
      isAllTunesMode,
      isNoHitPlayingLogs
    };
  },
  head(this: Index) {
    const title = `${this.defaultGenre.name} 演奏記録検索結果 - みゅーぐ`;
    const description = this.defaultGenre.description || title;

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
  defaultGenre!: Genre;

  isAllTunesMode!: boolean;
  isNoHitPlayingLogs!: boolean;

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
    let tunesWithCount = await this.$api.searchTunes(this.tuneSearchObject, this.offset, this.perPage, 5);
    // 1件も見つからなかったら曲のみの検索に切り替える
    if (tunesWithCount.totalCount === 0) {
      tunesWithCount = await this.$api.searchAllTunes(this.tuneSearchObject, this.offset, this.perPage);
      this.isAllTunesMode = true;
      this.isNoHitPlayingLogs = true;
    }
    this.tunes = tunesWithCount.tunes;
    this.totalCount = tunesWithCount.totalCount;
    this.$router.push({
      query: {
        offset: this.offset.toString(),
        isAllTunesMode: this.isAllTunesMode.toString()
      }
    });
    // ページャークリック後最上部までスクロールを戻す
    window.scrollTo(0, 0);
  }
  async changeAllTunesModeHandler() {
    this.isAllTunesMode = true;
    const tunesWithCount = await this.$api.searchAllTunes(this.tuneSearchObject, this.offset, this.perPage, 5);

    this.tunes = tunesWithCount.tunes;
    this.totalCount = tunesWithCount.totalCount;
    this.$router.push({
      query: {
        offset: this.offset.toString(),
        isAllTunesMode: this.isAllTunesMode.toString()
      }
    });
  }
}
</script>
