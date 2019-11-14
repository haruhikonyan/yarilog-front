<template>
  <section class="container">
    <div class="text-center">
      <ShareIcons :share-text="shareText" :share-path="sharePath" />
      <h1>
        トップページ
      </h1>
      <SearchForm
        class="my-3"
        placeholder="曲を探す(フリーワード)"
        :instruments="$store.state.instruments"
        :playstyles="$store.state.playstyles"
        @on-search="search($event)"
      />
      <b-card class="mb-2" title="みゅーぐとは">
        <pre class="yrl-pre-wrap yrl-info text-left mb-0">
日本国内に楽器を演奏する人は人口の10%以上いると言われています。
そんな楽器、そして演奏を愛する人々の演奏した記録を曲のレビュー(演奏記録)という形で残していけるWebサービスです。
集まった曲のレビューを他の人が見ることで、その曲を演奏して見たいと思ってくれたり、その曲をやる機会があれば演奏のための参考にしたりできると思っています。
また、こういった様々な人のレビューを見ることで不毛になりがちな選曲会議の助けにもなるだろうと思っています。
もちろん、演奏した側もいままで演奏した記録を一元管理でき、眺めて思い出に浸ると行った使い方もできると思います。
その記録を見てエキストラ奏者として誘って見たり。
使い方は無限だと思っています。
        </pre>
      </b-card>
      <p class="mt-3">最新の演奏記録</p>
    </div>
    <PlayingLogCard v-for="playingLog in playingLogs" :key="playingLog.id" :playing-log="playingLog" />
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import * as urljoin from 'url-join';
import PlayingLogCard from '../components/PlayingLogCard.vue';
import SearchForm from '../components/SearchForm.vue';
import ShareIcons from '../components/ShareIcons.vue';
import { TuneSearchObject } from '../models/Tune';

@Component({
  components: {
    PlayingLogCard,
    SearchForm,
    ShareIcons
  },
  async asyncData({ app, route, env }) {
    const playingLogs = await app.$api.getPlayingLogs(5);
    const sharePath = urljoin(env.frontUrl, route.path);
    const info = await app.$api.getInfo();
    const devInfo = await app.$api.getDevInfo();
    return { playingLogs, sharePath, info, devInfo };
  }
})
export default class Index extends Vue {
  // TODO ブラッシュアップ
  get shareText(): string {
    return '演奏記録、曲レビューサービス みゅーぐ';
  }
  search(tuneSearchObject: TuneSearchObject) {
    const { searchWord, instrumentId, composerId, playstyleId } = tuneSearchObject;
    this.$router.push({ path: 'tunes', query: { searchWord, instrumentId, composerId, playstyleId } });
  }
}
</script>
<style lang="scss" scoped>
@import 'bootstrap/scss/_functions.scss';
@import 'bootstrap/scss/_variables.scss';
@import 'bootstrap/scss/mixins/_breakpoints.scss';
.yrl-info {
  @include media-breakpoint-down(xs) {
    font-size: 70%;
  }
}
</style>
