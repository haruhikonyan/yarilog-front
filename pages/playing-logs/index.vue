<template>
  <section class="container">
    <div>
      <h1 class="text-center">
        演奏記録 検索結果
      </h1>
      <PlayingLogSearchBox :default-search-word="searchWord" class="my-3" />
      <b-alert v-if="playingLogs.length == 0" show variant="danger" class="yrl-pre-wrap">{{
        noHitSearchResultMessage
      }}</b-alert>
      <PlayingLogCard v-for="playingLog in playingLogs" :key="playingLog.id" :playing-log="playingLog" />
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { User } from '~/models/User';
import { PlayingLog } from '~/models/PlayingLog';
import PlayingLogCard from '~/components/PlayingLogCard.vue';
import PlayingLogSearchBox from '~/components/PlayingLogSearchBox.vue';
import { Route } from 'vue-router';

@Component({
  components: {
    PlayingLogCard,
    PlayingLogSearchBox
  },
  async asyncData({ app, query }) {
    const searchWord = query.searchWord as string;
    const playingLogs = await app.$api.getPlayingLogsBySearchWord(searchWord);
    return { playingLogs, searchWord };
  }
})
export default class Index extends Vue {
  playingLogs: PlayingLog[] = [];
  noHitSearchResultMessage =
    '検索した演奏記録はありませんでした。\n作曲家の名前などの表記揺れにご注意ください。\n例）ベートーベン => ベートーヴェン';

  @Watch('$route', { immediate: true, deep: true })
  async research(newRoute: Route) {
    const newSearchWord = newRoute.query.searchWord as string;
    this.playingLogs = await this.$api.getPlayingLogsBySearchWord(newSearchWord);
  }
}
</script>
