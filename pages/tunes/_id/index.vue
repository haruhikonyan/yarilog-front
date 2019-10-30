<template>
  <section class="container">
    <Breadcrumb :tune="tune" />
    <div>
      <small class="text-muted mb-0">
        {{ tune.playstyle.name }}
        <b-badge v-for="genre in tune.genres" :key="genre.id" :to="`/genres/${genre.id}`" class="mr-1">
          {{ genre.name }}
        </b-badge>
        <b-badge v-if="$store.state.auth && !isEditingGenre" variant="primary" @click="addGenreHandler">
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
      <pre class="mt-2 yrl-pre-wrap">{{ tune.description }}</pre>
      <b-form-select
        v-model="selectedInstrumentId"
        size="sm"
        class="w-auto mt-2"
        @change="selectedInstrumentChangeHandler($event)"
      >
        <option value="">全楽器</option>
        <option v-for="instrument in $store.state.instruments" :key="instrument.id" :value="instrument.id">
          {{ instrument.shortName }}
        </option>
      </b-form-select>
      <div v-for="playingLog in playingLogs" :key="playingLog.id">
        <hr />
        <PlayingLogSummary :playing-log="playingLog" />
      </div>
    </div>
    <small class="float-right mr-1"><nuxt-link to="/playing-logs/new">演奏記録を追加</nuxt-link></small>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import VueSimpleSuggest from 'vue-simple-suggest';
import 'vue-simple-suggest/dist/styles.css'; // Optional CSS
import { Tune, Genre } from '../../../models/Tune';
import PlayingLogSummary from '~/components/PlayingLogSummary.vue';
import StarRating from '~/components/StarRating.vue';
import Breadcrumb from '~/components/Breadcrumb.vue';
import { PlayingLog } from '../../../models/PlayingLog';
=======
import { PlayingLogsWithCount, PlayingLog } from '../../../models/PlayingLog';


@Component({
  components: {
    PlayingLogSummary,
    StarRating,
    Breadcrumb,
    VueSimpleSuggest
  },
  async asyncData({ app, params, query }) {
    const tune = await app.$api.getTune(params.id);
    const selectedInstrumentId = query.selectedInstrumentId || '';
    // 最新5件表示
    const playingLogsWithCount: PlayingLogsWithCount = await app.$api.searchPlayingLogs(
      null,
      selectedInstrumentId,
      params.id,
      0,
      5
    );
    return { tune, playingLogs: playingLogsWithCount.playingLogs, selectedInstrumentId };
  },
  head(this: Index) {
    return {
      title: `${this.tune.title} ${this.tune.composer.fullName}作曲 - みゅーぐ`,
      meta: [{ hid: 'description', name: 'description', content: `${this.tune.description}` }]
    };
  }
})
export default class Index extends Vue {
  tune!: Tune;
  isEditingGenre: boolean = false;
  addGenreName: string | null = null;
  selectedInstrumentId!: string;
  playingLogs!: PlayingLog[];

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
  async selectedInstrumentChangeHandler(selectedInstrumentId: string) {
    const playingLogsWithCount: PlayingLogsWithCount = await this.$api.searchPlayingLogs(
      null,
      selectedInstrumentId,
      this.tune.id!.toString(),
      0,
      5
    );
    this.$router.push({
      query: {
        selectedInstrumentId
      }
    });
    this.playingLogs = playingLogsWithCount.playingLogs;
  }
  // ログ追加リンク
  async asyncData({ app, query }) {
    const tuneId = query.tuneId;
    const addLog = new PlayingLog();
    addLog.tune = tuneId ? await app.$api.getTune(tuneId) : null;
    this.$router.push({ path: '/playing-logs/new', query: { tuneId: tuneId!.toString() } });
  }
}
</script>
<style lang="scss">
// TODO むりやりグローバルで固定してるのどうにかしたい
.yrl-add-genre-form-height {
  height: 30px;
}
</style>
