<template>
  <section class="container">
    <div>
      <small class="text-muted mb-0">{{ playingLog.tune.playstyle.name }} {{ displayGanres }}</small>
      <h4 class="mb-0">{{ playingLog.tune.title }}</h4>
      <small class="text-muted mb-1">{{ playingLog.tune.composer.displayName }}作曲</small>
      <h5 class="text-center mb-0">
        面白さ: {{ playingLog.interesting }} 体力: {{ playingLog.physicality }} 難易度: {{ playingLog.difficulty }}
      </h5>
      <div class="text-muted text-center mb-3">
        {{ playingLog.instrument.name }} {{ playingLog.position }} <b-badge>{{ playingLog.playerLevel }}</b-badge>
      </div>
      <b-card v-if="playingLog.impressionOfInteresting" class="mb-2" title="面白かったところ">
        <b-card-text>
          <pre class="yrl-pre-wrap">{{ playingLog.impressionOfInteresting }}</pre>
        </b-card-text>
      </b-card>
      <b-card v-if="playingLog.impressionOfDifficulty" class="mb-2" title="難しかったところ">
        <b-card-text>
          <pre class="yrl-pre-wrap mb-0">{{ playingLog.impressionOfDifficulty }}</pre>
        </b-card-text>
      </b-card>
      <b-card v-if="playingLog.reflectionForNext" class="mb-2" title="次回への反省やアドバイス">
        <b-card-text>
          <pre class="yrl-pre-wrap mb-0">{{ playingLog.reflectionForNext }}</pre>
        </b-card-text>
      </b-card>
      <b-card v-if="playingLog.otherPartInpression" class="mb-2" title="全体の感想">
        <b-card-text>
          <pre class="yrl-pre-wrap mb-0">{{ playingLog.otherPartInpression }}</pre>
        </b-card-text>
      </b-card>
      <b-card v-if="playingLog.secretMemo" class="mb-2" title="非公開の自分用メモ" sub-title="自分にしか見えません">
        <b-card-text>
          <pre class="yrl-pre-wrap mb-0">{{ playingLog.secretMemo }}</pre>
        </b-card-text>
      </b-card>
      <h4>{{ playingLog.user.nickname }}さん</h4>
      {{ changeDate }} に {{ playingLog.team }} にて演奏
    </div>
    <!-- TODO 同じ曲の演奏ログや同じ人の演奏ログを出す -->
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { PlayingLog } from '~/models/PlayingLog';

@Component({
  components: {},
  async asyncData({ app, params }) {
    const playingLog = await app.$api.getPlayingLog(params.id);
    return { playingLog };
  },
  head(this: Index) {
    // なければ空文字列を入れて title に出てくるのを防ぐ
    const position = this.playingLog.position || '';
    return {
      title: `${this.playingLog.tune.title} ${this.playingLog.instrument.name}${position} ${
        this.playingLog.user.nickname
      }さん演奏 - 演りログ`,
      meta: [{ hid: 'description', name: 'description', content: `${this.playingLog.impressionOfInteresting}` }]
    };
  }
})
export default class Index extends Vue {
  playingLog!: PlayingLog;

  get displayGanres(): string {
    const genresString = this.playingLog.tune.genres.map(g => g.name).toString();
    return genresString ? `/ ${genresString}` : '';
  }
  // 日付変更処理
  get changeDate(): string {
    const changeDate = this.playingLog.playDate!.toString();
    const year = changeDate.substr(0, 4);
    const month = changeDate.substr(5, 2);
    const day = changeDate.substr(8, 2);
    return changeDate ? year + '年' + month + '月' + day + '日' : '';
  }
}
</script>
