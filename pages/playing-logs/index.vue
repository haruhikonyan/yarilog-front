<template>
  <section class="container">
    <div>
      <h1 class="text-center">
        演奏記録 検索結果
      </h1>
      <PlayingLogSearchBox :search-word="searchWord" class="my-3" />
      <PlayingLogCard v-for="playingLog in playingLogs" :key="playingLog.id" :playing-log="playingLog" />
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { User } from '~/models/User';
import { PlayingLog } from '~/models/PlayingLog';
import PlayingLogCard from '~/components/PlayingLogCard.vue';
import PlayingLogSearchBox from '~/components/PlayingLogSearchBox.vue';

@Component({
  components: {
    PlayingLogCard,
    PlayingLogSearchBox
  },
  async asyncData({ app, query }) {
    const searchWord = query.searchWord as string;
    const playingLogsData = await app.$api.getPlayingLogsBySearchWord(searchWord);
    return { playingLogs: playingLogsData, searchWord: searchWord };
  }
})
export default class Index extends Vue {
  playingLogs: PlayingLog[] = [];
}
</script>
