<template>
  <section class="container">
    <SearchResult
      :tune-search-object="tuneSearchObject"
      :tunes="tunes"
      :total-count="totalCount"
      :offset="offset"
      :per-page="perPage"
      :default-composer="defaultComposer"
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
    const { tunes, totalCount } = await app.$api.searchTunes(tuneSearchObject, offset, perPage, 5);

    // 作曲家が検索条件にあれば、パンくずや検索フォームで使う作曲家データを取得しておく
    const defaultComposer = composerId ? await app.$api.getComposer(composerId) : null;
    return { tunes, totalCount, tuneSearchObject, offset, perPage, defaultComposer };
  },
  head(this: Index) {
    const metaInfo: MetaInfo = {};
    const searchWord = this.tuneSearchObject.searchWord || '';
    metaInfo.title = `${searchWord} 曲検索結果 - みゅーぐ`;
    metaInfo.meta = [{ hid: 'description', name: 'description', content: `${searchWord} 曲検索結果` }];
    // 値があるものだけ抽出する
    const exsistTuneSearchObject = Object.entries(this.tuneSearchObject).filter(([_key, value]) => !!value);
    // 検索クエリの値が1つだったら canonical タグをつける
    if (exsistTuneSearchObject.length === 1) {
      const [key, value] = o[0];
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
}
</script>
