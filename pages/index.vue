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
      <b-card class="mb-2" title="楽器から探す">
        <!-- TODO 楽器種別分け -->
        <div class="d-flex flex-wrap text-left">
          <nuxt-link
            v-for="instrument in $store.state.instruments"
            :key="instrument.id"
            :to="`/tunes?instrumentId=${instrument.id}`"
            style="width: 100px; font-size: 12px"
          >
            >{{ instrument.name }}
          </nuxt-link>
        </div>
      </b-card>
      <b-card class="mb-2" title="作曲家から探す">
        <!-- TODO 厳選 -->
        <div class="d-flex flex-wrap text-left">
          <nuxt-link
            v-for="composer in composers"
            :key="composer.id"
            :to="`/tunes?composerId=${composer.id}`"
            style="min-width: 100px; font-size: 12px; flex: auto"
          >
            >{{ composer.displayName }}
          </nuxt-link>
        </div>
      </b-card>
      <p class="mt-3">最新の演奏記録</p>
    </div>
    <div class="row yrl-o-2-column">
      <PlayingLogCard
        v-for="playingLog in playingLogs"
        :key="playingLog.id"
        :playing-log="playingLog"
        class="col-6 mb-2"
      />
    </div>
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
    const playingLogs = await app.$api.getPlayingLogs(6);
    const sharePath = urljoin(env.frontUrl, route.path);
    // TODO 厳選
    const composers = await app.$api.getComposers();
    return { playingLogs, sharePath, composers: composers.slice(0, 30) };
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
/*↓カラム間のガター幅が60px、カラムの左右の余白が30pxになる*/
.yrl-o-2-column .col-6 {
  padding: 0 7.5px;
}
/*カラムの左右の余白を15pxに戻す*/
.yrl-o-2-column {
  margin: 0 -7.5px;
}
</style>
