<template>
  <section>
    <b-jumbotron fluid class="yrl-top-title text-sm-center p-4 mt-n3 mb-3">
      <h2>音楽を奏でるすべての人へ</h2>
      <h2>演奏記録の共有サイト</h2>
      <h2>みゅーぐ</h2>
      <p class="my-3">{{ leadSentence }}</p>
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
        <b-card class="mb-2" title="演奏楽器から探す" body-class="px-2">
          <!-- TODO 楽器種別分け -->
          <div class="d-flex flex-wrap text-left">
            <nuxt-link
              v-for="instrument in $store.state.instruments"
              :key="instrument.id"
              :to="`/instruments/${instrument.id}`"
              class="yrl-instrument-link"
            >
              >{{ instrument.name }}
            </nuxt-link>
          </div>
        </b-card>
        <adsbygoogle :ad-slot="topAdId" ad-format="horizontal" />
        <b-card class="mb-2" title="作曲家から探す">
          <div class="d-flex flex-wrap text-left">
            <nuxt-link
              v-for="composer in composers"
              :key="composer.id"
              :to="`/composers/${composer.id}`"
              style="min-width: 96px; font-size: 13px; flex: auto"
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
      <adsbygoogle :ad-slot="middleAdId" ad-format="horizontal" />
      <b-card class="mb-2 text-center" title="みゅーぐ開発において">
        <pre class="yrl-pre-wrap yrl-info text-left mb-0">
日本国内で楽器を演奏する人は人口の10%、つまり1200万人以上いると言われています。
しかし、たくさんの人が曲や演奏にかける思いを共有するサービスは未だ存在しません。「この曲の素晴らしいところはここだ」「この曲は実はこんなことを考えながら演奏していた」そんなレビューを記録に残すことで、書く側は自身の思い出整理に用いたり、あるいは読む側はこれからの選曲会議での参考にしたり、レビュアーをエキストラに誘ってみたり、使い方は無限だと思っています。
是非、『みゅーぐ』を自由に活用してください。
楽器と演奏を愛するみなさんの活動の一助になれば幸いです。

なお、みゅーぐの開発を手伝ってくださる方を募集しています。
興味のある方は<nuxt-link :to="inquiryDevLocation">問い合わせフォーム</nuxt-link>もしくは<a href="https://twitter.com/musig_net" target="_blank">公式twitter</a>などでご連絡ください。
        </pre>
      </b-card>
      <b-card class="mb-2 text-center" title="ジャンルから探す">
        <div class="d-flex flex-wrap text-left">
          <nuxt-link
            v-for="genre in genres"
            :key="genre.id"
            :to="`/genres/${genre.id}`"
            style="width: 96px; font-size: 13px"
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
  async asyncData({ app, env }) {
    const playingLogs = await app.$api.getPlayingLogs(6);
    const composers = await app.$api.getTopPageLinkedComposers();
    const genres = await app.$api.getTopPageLinkedGenres();
    return { playingLogs, composers, genres, topAdId: env.topAdId, middleAdId: env.middleAdId };
  }
})
export default class Index extends Vue {
  leadSentence =
    '『みゅーぐ』は楽器、そして演奏を愛する人々が演奏した記録・思い出を、演奏記録という形で残していけるWebサービスです。';
  get inquiryDevLocation() {
    return { path: '/inquiry', query: { inquiryTypeId: '7' } };
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
    font-size: 80%;
  }
}
.yrl-top-title {
  background-image: url('~assets/bg_top_title.jpg');
  background-size: cover;
  color: white;
  text-shadow: 1px 1px 0 black;
}
.yrl-instrument-link {
  width: 104px;
  font-size: 13px;
}
</style>
