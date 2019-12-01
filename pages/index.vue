<template>
  <section>
    <b-jumbotron fluid class="yrl-top-title text-sm-center p-4 mt-n3">
      <h2>音楽を奏でるすべての人へ</h2>
      <h2>演奏記録の共有サイト</h2>
      <h2>みゅーぐ</h2>
      <b-button variant="primary" block class="mt-3" to="/playing-logs/new">演奏記録を書く</b-button>
    </b-jumbotron>
    <div class="container">
      <div class="text-center">
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
        <b-card class="mb-2" title="演奏楽器から探す">
          <!-- TODO 楽器種別分け -->
          <div class="d-flex flex-wrap text-left">
            <nuxt-link
              v-for="instrument in $store.state.instruments"
              :key="instrument.id"
              :to="`/instruments/${instrument.id}`"
              style="width: 96px; font-size: 12px"
            >
              >{{ instrument.name }}
            </nuxt-link>
          </div>
        </b-card>
        <b-card class="mb-2" title="作曲家から探す">
          <div class="d-flex flex-wrap text-left">
            <nuxt-link
              v-for="composer in composers"
              :key="composer.id"
              :to="`/composers/${composer.id}`"
              style="min-width: 96px; font-size: 12px; flex: auto"
            >
              >{{ composer.displayName }}
            </nuxt-link>
          </div>
        </b-card>
        <p class="mt-3">最新の演奏記録</p>
      </div>
      <div class="row">
        <div v-for="playingLog in playingLogs" :key="playingLog.id" class="mb-2 col-md-6">
          <PlayingLogCard :playing-log="playingLog" />
        </div>
      </div>
      <b-card class="mb-2 text-center" title="ジャンルから探す">
        <div class="d-flex flex-wrap text-left">
          <nuxt-link
            v-for="genre in genres"
            :key="genre.id"
            :to="`/genres/${genre.id}`"
            style="width: 96px; font-size: 12px"
          >
            >{{ genre.name }}
          </nuxt-link>
        </div>
      </b-card>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PlayingLogCard from '../components/PlayingLogCard.vue';
import SearchForm from '../components/SearchForm.vue';
import { TuneSearchObject } from '../models/Tune';

@Component({
  components: {
    PlayingLogCard,
    SearchForm
  },
  async asyncData({ app }) {
    const playingLogs = await app.$api.getPlayingLogs(6);
    const composers = await app.$api.getTopPageLinkedComposers();
    const genres = await app.$api.getTopPageLinkedGenres();
    return { playingLogs, composers, genres };
  }
})
export default class Index extends Vue {
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
.yrl-top-title {
  background-image: url('~assets/bg_top_title.jpg');
  background-size: cover;
  color: white;
  text-shadow: 1px 1px 0 black;
}
</style>
