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
      <p><nuxt-link to="/composers">作曲家から演奏記録を探す</nuxt-link></p>
      <p><nuxt-link to="/countries">国から演奏記録を探す</nuxt-link></p>
      <b-button v-if="!$store.state.auth" to="/users/new" variant="primary" class="mb-3">ユーザ新規作成</b-button>
      <div>
        <b-button v-b-toggle.dev-info block size="sm" variant="primary" class="mb-3">開発情報を見る</b-button>
        <b-collapse id="dev-info" class="mb-3">
          <b-card>
            <pre class="yrl-pre-wrap yrl-info text-left mb-0">{{ devInfo }}</pre>
          </b-card>
        </b-collapse>
      </div>
      <b-card class="mb-2" title="みゅーぐとは">
        <pre class="yrl-pre-wrap yrl-info text-left mb-0">{{ info }}</pre>
        <b-card-text class="mb-0">
          <a href="https://twitter.com/sasuganaryuseki" target="_blank">Twitter</a>
        </b-card-text>
        <b-card-text class="mb-0">
          <a href="https://www.facebook.com/ryuseki.sasuga" target="_blank">Facebook</a>
        </b-card-text>
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
    const sharePath = urljoin(env.baseBrouserApiUrl, route.path);
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
