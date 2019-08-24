<template>
  <section class="container">
    <div>
      <h1 class="text-center">{{ totalCount }}件の曲がみつかりました</h1>
      <PlayingLogSearchBox
        :default-search-word="searchWord"
        :default-instrument-id="instrumentId"
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
import { Component, Vue, Watch } from 'vue-property-decorator';
import { User } from '~/models/User';
import { PlayingLog, PlayingLogSearchObject, PlayingLogsWithCount } from '~/models/PlayingLog';
import TuneCard from '~/components/TuneCard.vue';
import PlayingLogSearchBox from '~/components/PlayingLogSearchBox.vue';
import { Route } from 'vue-router';
import * as groupBy from 'lodash.groupby';
import { TuneSearchObject, Tune } from '../../models/Tune';

@Component({
  components: {
    TuneCard,
    PlayingLogSearchBox
  },
  async asyncData({ app, query }) {
    // 最大表示数を 20 に設定
    const perPage: number = 20;
    const searchWord = query.searchWord as string;
    const instrumentId = query.instrumentId as string;
    const offsetString = query.offset as string;
    // offset が未設定 NaN になるのでその時は 0 をセット
    const offset = isNaN(Number(offsetString)) ? 0 : Number(offsetString);
    const { tunes, totalCount } = await app.$api.searchTunes(searchWord, instrumentId, offset, perPage);
    // offset の値から現在のページを計算
    const currentPage: number = offset === 0 ? 1 : Math.floor(offset / perPage) + 1;
    return { tunes, totalCount, searchWord, instrumentId, offset, currentPage, perPage };
  },
  head(this: Index) {
    const searchWord = this.searchWord || '';
    return {
      title: `${searchWord} 演奏記録検索結果 - 演りログ`,
      meta: [{ hid: 'description', name: 'description', content: `${searchWord} 演奏記録検索結果` }]
    };
  }
})
export default class Index extends Vue {
  tunes!: Tune[];
  totalCount!: number;
  searchWord!: string;
  instrumentId: string | null = null;
  offset!: number;
  currentPage!: number;
  perPage!: number;

  noHitSearchResultMessage =
    '検索した演奏記録はありませんでした。\n作曲家の名前などの表記揺れにご注意ください。\n例）ベートーベン => ベートーヴェン';

  async search(tuneSearchObject: TuneSearchObject) {
    const { searchWord, instrumentId } = tuneSearchObject;
    // offset は 0 で初期化
    this.offset = 0;
    const tunesWithCount = await this.$api.searchTunes(searchWord, instrumentId, this.offset, this.perPage);
    this.tunes = tunesWithCount.tunes;
    this.totalCount = tunesWithCount.totalCount;
    this.$router.push({ path: 'tunes', query: { searchWord, instrumentId } });
  }
  async pagenationInputHandler(currentPage) {
    // 現在のページ数から offset を計算
    this.offset = this.perPage * (currentPage - 1);
    const playingLogsWithCount = await this.$api.searchTunes(
      this.searchWord,
      this.instrumentId,
      this.offset,
      this.perPage
    );
    this.tunes = playingLogsWithCount.tunes;
    this.totalCount = playingLogsWithCount.totalCount;
    this.$router.push({
      path: 'playing-logs',
      query: { searchWord: this.searchWord, instrumentId: this.instrumentId, offset: this.offset.toString() }
    });
  }
}
</script>
