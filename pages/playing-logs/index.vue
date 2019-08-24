<template>
  <section class="container">
    <div>
      <h1 class="text-center">演奏記録 {{ totalCount }}件の検索結果</h1>
      <!-- <PlayingLogsGroupByTune :playing-logs-group-by-tune="playingLogsGroupByTune" /> -->
      <SearchBox
        :default-search-word="searchWord"
        :default-instrument-id="instrumentId"
        :instruments="$store.state.instruments"
        class="my-3"
        @on-search="search($event)"
      />
      <!-- TODO こコンポーネント化 デザインが複雑になってからで良い -->
      <b-alert v-if="playingLogs.length == 0" show variant="danger" class="yrl-pre-wrap">{{
        noHitSearchResultMessage
      }}</b-alert>
      <PlayingLogCard v-for="playingLog in playingLogs" :key="playingLog.id" :playing-log="playingLog" />
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
import PlayingLogCard from '~/components/PlayingLogCard.vue';
import SearchBox from '~/components/SearchBox.vue';
import PlayingLogsGroupByTune from '~/components/PlayingLogsGroupByTune.vue';
import { Route } from 'vue-router';
import * as groupBy from 'lodash.groupby';

@Component({
  components: {
    PlayingLogCard,
    SearchBox,
    PlayingLogsGroupByTune
  },
  async asyncData({ app, query }) {
    // 最大表示数を 20 に設定
    const perPage: number = 20;
    const searchWord = query.searchWord as string;
    const instrumentId = query.instrumentId as string;
    const offsetString = query.offset as string;
    // offset が未設定 NaN になるのでその時は 0 をセット
    const offset = isNaN(Number(offsetString)) ? 0 : Number(offsetString);
    const { playingLogs, totalCount } = await app.$api.searchPlayingLogs(searchWord, instrumentId, offset, perPage);
    // offset の値から現在のページを計算
    const currentPage: number = offset === 0 ? 1 : Math.floor(offset / perPage) + 1;
    return { playingLogs, totalCount, searchWord, instrumentId, offset, currentPage, perPage };
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
  playingLogs!: PlayingLog[];
  totalCount!: number;
  searchWord!: string;
  instrumentId: string | null = null;
  offset!: number;
  currentPage!: number;
  perPage!: number;

  noHitSearchResultMessage =
    '検索した演奏記録はありませんでした。\n作曲家の名前などの表記揺れにご注意ください。\n例）ベートーベン => ベートーヴェン';

  async search(playingLogSearchObject: PlayingLogSearchObject) {
    const { searchWord, instrumentId } = playingLogSearchObject;
    // offset は 0 で初期化
    this.offset = 0;
    const playingLogsWithCount = await this.$api.searchPlayingLogs(searchWord, instrumentId, this.offset, this.perPage);
    this.playingLogs = playingLogsWithCount.playingLogs;
    this.totalCount = playingLogsWithCount.totalCount;
    this.$router.push({ path: 'playing-logs', query: { searchWord, instrumentId } });
  }
  async pagenationInputHandler(currentPage) {
    // 現在のページ数から offset を計算
    this.offset = this.perPage * (currentPage - 1);
    const playingLogsWithCount = await this.$api.searchPlayingLogs(
      this.searchWord,
      this.instrumentId,
      this.offset,
      this.perPage
    );
    this.playingLogs = playingLogsWithCount.playingLogs;
    this.totalCount = playingLogsWithCount.totalCount;
    this.$router.push({
      path: 'playing-logs',
      query: { searchWord: this.searchWord, instrumentId: this.instrumentId, offset: this.offset.toString() }
    });
  }
  // TODO 共通化？
  get playingLogsGroupByTune(): PlayingLog[][] {
    return Object.values(groupBy(this.playingLogs, 'tune.id'));
  }
}
</script>
