<template>
  <section class="container">
    <SearchResult
      :tune-search-object="tuneSearchObject"
      :tunes="tunes"
      :total-count="totalCount"
      :offset="offset"
      :per-page="perPage"
      :default-composer="defaultComposer"
      :is-all-tunes-mode="isAllTunesMode"
      @on-search="search($event)"
      @on-pagenation-input="pagenationInputHandler($event)"
    />
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import SearchResult from '~/components/SearchResult.vue';
import { MetaInfo } from 'vue-meta';
import { TuneSearchObject, Tune } from '../../models/Tune';
import { Composer } from '../../models/Composer';

@Component({
  components: {
    SearchResult
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
    // tune に紐づく PlayingLog は最大5件にしておく
    let searchResultObject = await app.$api.searchTunes(tuneSearchObject, offset, perPage, 5);
    let isAllTunesMode = false;
    // 1件も見つからなかったら曲のみの検索に切り替える
    if (searchResultObject.totalCount === 0) {
      searchResultObject = await app.$api.searchAllTunes(tuneSearchObject, offset, perPage);
      isAllTunesMode = true;
    }
    // 作曲家が検索条件にあれば、パンくずや検索フォームで使う作曲家データを取得しておく
    const defaultComposer = composerId ? await app.$api.getComposer(composerId) : null;
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
    const metaInfo: MetaInfo = {};
    const searchWord = this.tuneSearchObject.searchWord || '';
    const title = `${searchWord} 演奏記録検索結果 - みゅーぐ`;
    const description = `${searchWord} 演奏記録検索結果`;
    metaInfo.title = title;
    metaInfo.meta = [
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
    ];
    // 値があるものだけ抽出する
    const existTuneSearchObject = Object.entries(this.tuneSearchObject).filter(([_key, value]) => !!value);
    // 検索クエリの値が1つだったら canonical タグをつける
    if (existTuneSearchObject.length === 1) {
      // 一つしかないはずなので先頭取得
      const [[key, value]] = existTuneSearchObject;
      switch (key) {
        case 'searchWord':
          // ただし、searchWord は不要
          break;
        case 'instrumentId':
          metaInfo.link = [{ rel: 'canonical', href: `/instrument/${value}` }];
          break;
        case 'composerId':
          metaInfo.link = [{ rel: 'canonical', href: `/composer/${value}` }];
          break;
        case 'playstyleId':
          metaInfo.link = [{ rel: 'canonical', href: `/playstyle/${value}` }];
          break;
        case 'genreId':
          metaInfo.link = [{ rel: 'canonical', href: `/genre/${value}` }];
          break;
      }
    }
    return metaInfo;
  }
})
export default class Index extends Vue {
  tunes!: Tune[];
  totalCount!: number;
  tuneSearchObject!: TuneSearchObject;
  offset!: number;
  perPage!: number;

  defaultComposer!: Composer | null;

  isAllTunesMode!: boolean;

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
    let tunesWithCount = await this.$api.searchTunes(this.tuneSearchObject, this.offset, this.perPage, 5);
    // 1件も見つからなかったら曲のみの検索に切り替える
    if (tunesWithCount.totalCount === 0) {
      tunesWithCount = await this.$api.searchAllTunes(this.tuneSearchObject, this.offset, this.perPage);
      this.isAllTunesMode = true;
    }
    this.tunes = tunesWithCount.tunes;
    this.totalCount = tunesWithCount.totalCount;
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
}
</script>
