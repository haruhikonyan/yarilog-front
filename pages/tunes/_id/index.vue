<template>
  <section class="container">
    <Breadcrumb :tune="tune" :playstyle="selectedPlaystyle" :instrument="selectedInstrument" />
    <adsbygoogle :ad-slot="topAdId" ad-format="horizontal" />
    <div>
      <small class="text-muted mb-0">
        <GenreBadge v-for="genre in tune.genres" :key="genre.id" :genre="genre" :is-linkable="true" class="mr-1" />
        <b-badge v-if="$store.state.auth && !isEditingGenre" @click="addGenreHandler">
          ジャンル追加
        </b-badge>
      </small>
      <b-form @submit.prevent="addGenre">
        <b-input-group v-if="isEditingGenre" size="sm" class="mb-2">
          <vue-simple-suggest
            v-model="addGenreName"
            display-attribute="name"
            :styles="autoCompleteStyle"
            :list="simpleSuggestionList"
            :debounce="200"
            placeholder="追加するジャンルを入力"
            class="flex-grow-1"
          />
          <b-input-group-append>
            <b-button class="yrl-add-genre-form-height" type="submit" variant="primary">追加</b-button>
          </b-input-group-append>
        </b-input-group>
      </b-form>
      <h4 class="mb-0">{{ tune.title }}</h4>
      <nuxt-link :to="`/composers/${tune.composer.id}`" class="text-muted small mb-1"
        >{{ tune.composer.displayName }}作曲
      </nuxt-link>
      <div>面白さ<StarRating :rate="(tune.averageInteresting / 5) * 100" />{{ tune.averageInteresting || '-' }}</div>
      <div>体力<StarRating :rate="(tune.averagePhysicality / 5) * 100" />{{ tune.averagePhysicality || '-' }}</div>
      <div>難易度<StarRating :rate="(tune.averageDifficulty / 5) * 100" />{{ tune.averageDifficulty || '-' }}</div>
      <div class="d-flex mt-2">
        <b-form-select
          v-model="selectedInstrument"
          size="sm"
          class="w-auto mr-2"
          @change="selectedSortChangeHandler($event)"
        >
          <option :value="undefined">全楽器</option>
          <option v-for="instrument in $store.state.instruments" :key="instrument.id" :value="instrument">
            {{ instrument.shortName }}
          </option>
        </b-form-select>
        <b-form-select
          v-model="selectedPlaystyle"
          size="sm"
          class="w-auto yrl-playstyle-selector"
          @change="selectedSortChangeHandler($event)"
        >
          <option :value="undefined">全編成</option>
          <option v-for="playstyle in $store.state.playstyles" :key="playstyle.id" :value="playstyle">
            {{ playstyle.name }}
          </option>
        </b-form-select>
        <nuxt-link class="small ml-auto align-self-end" :to="createPlayingLogLocation">
          この曲の演奏記録を書く
        </nuxt-link>
      </div>
      <div v-if="playingLogs.length === 0" class="pt-4">
        演奏記録が見つかりませんでした。
      </div>
      <div v-for="playingLog in playingLogs" :key="playingLog.id">
        <hr />
        <PlayingLogSummary :playing-log="playingLog" />
      </div>
    </div>
    <!-- TODO ページャ実装 -->
    <div v-if="tune.description">
      <hr />
      <pre class="yrl-pre-wrap">{{ tune.description }}</pre>
    </div>
    <nuxt-link class="small d-block text-right" :to="inquiryMistakeLocation">
      曲情報が間違っている
    </nuxt-link>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import VueSimpleSuggest from 'vue-simple-suggest';
import 'vue-simple-suggest/dist/styles.css'; // Optional CSS
import { Tune, Genre, PlayStyle } from '../../../models/Tune';
import PlayingLogSummary from '~/components/PlayingLogSummary.vue';
import StarRating from '~/components/StarRating.vue';
import Breadcrumb from '~/components/Breadcrumb.vue';
import GenreBadge from '~/components/GenreBadge.vue';
import { PlayingLogsWithCount, PlayingLog } from '../../../models/PlayingLog';
import { Instrument } from '../../../models/Instrument';

@Component({
  components: {
    PlayingLogSummary,
    StarRating,
    Breadcrumb,
    VueSimpleSuggest,
    GenreBadge
  },
  async asyncData({ app, params, query, env, store }) {
    const tune = await app.$api.getTune(params.id);
    const selectedInstrumentId = query.selectedInstrumentId || '';
    const selectedPlaystyleId = query.selectedPlaystyleId || '';
    // 全件取得
    const playingLogsWithCount: PlayingLogsWithCount = await app.$api.searchPlayingLogs(
      null,
      selectedInstrumentId,
      selectedPlaystyleId,
      params.id,
      0,
      0
    );
    return {
      tune,
      playingLogs: playingLogsWithCount.playingLogs,
      // 導線によってなぜかまちまちなので toString() して比較する
      selectedInstrument: store.state.instruments.find(i => i.id.toString() === selectedInstrumentId.toString()),
      selectedPlaystyle: store.state.playstyles.find(p => p.id.toString() === selectedPlaystyleId.toString()),
      topAdId: env.topAdId
    };
  },
  head(this: Index) {
    const title = `${this.tune.title} ${this.tune.composer.displayName}作曲 演奏記録一覧 - みゅーぐ`;
    const description = this.tune.description || `${this.tune.title} ${this.tune.composer.fullName}作曲`;
    return {
      title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: description
        },
        { hid: 'og:title', property: 'og:title', content: title },
        {
          hid: 'og:description',
          property: 'og:description',
          content: description
        }
      ]
    };
  }
})
export default class Index extends Vue {
  tune!: Tune;
  isEditingGenre: boolean = false;
  addGenreName: string | null = null;
  selectedInstrument!: Instrument | null;
  selectedPlaystyle!: PlayStyle | null;
  playingLogs!: PlayingLog[];

  get createPlayingLogLocation() {
    return { path: '/playing-logs/new', query: { tuneId: this.tune.id!.toString() } };
  }
  get inquiryMistakeLocation() {
    return { path: '/inquiry', query: { inquiryTypeId: '2', content: `path: ${this.$route.path}` } };
  }

  addGenreHandler() {
    this.isEditingGenre = true;
  }

  async simpleSuggestionList(searchWord): Promise<Genre[]> {
    // 2文字未満であれば空を返す
    if (searchWord.length < 2) {
      return [];
    }
    // 重複してるものは候補に出さない
    const genreIds = this.tune.genres.map(g => g.id);
    const results = await this.$api.searchGenres(searchWord);
    return results.filter(r => !genreIds.includes(r.id));
  }

  // bootstrap 用の style
  get autoCompleteStyle() {
    return {
      vueSimpleSuggest: 'position-relative',
      inputWrapper: 'yrl-add-genre-form-height',
      defaultInput: 'form-control yrl-add-genre-form-height',
      suggestions: 'position-absolute list-group z-1000',
      suggestItem: 'list-group-item'
    };
  }
  async addGenre() {
    if (!this.addGenreName) {
      return;
    }
    // 重複してたら何もしない
    if (this.tune.genres.map(g => g.name).includes(this.addGenreName)) {
      return;
    }
    this.tune = await this.$api.addGenreToTune(this.tune.id!, this.addGenreName);
    this.addGenreName = null;
    this.isEditingGenre = false;
  }
  async selectedSortChangeHandler() {
    const selectedInstrumentId = this.selectedInstrument && this.selectedInstrument.id.toString();
    const selectedPlaystyleId = this.selectedPlaystyle && this.selectedPlaystyle.id.toString();
    const playingLogsWithCount: PlayingLogsWithCount = await this.$api.searchPlayingLogs(
      null,
      selectedInstrumentId,
      selectedPlaystyleId,
      this.tune.id!.toString(),
      0,
      0
    );
    this.$router.push({
      query: {
        selectedInstrumentId,
        selectedPlaystyleId
      }
    });
    this.playingLogs = playingLogsWithCount.playingLogs;
  }
}
</script>
<style lang="scss">
// TODO むりやりグローバルで固定してるのどうにかしたい
.yrl-add-genre-form-height {
  height: 30px;
}
.yrl-playstyle-selector {
  max-width: 120px;
}
</style>
