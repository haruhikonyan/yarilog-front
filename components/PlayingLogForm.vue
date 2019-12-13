<template>
  <b-form @submit.prevent="submitHandler">
    <b-form-group>
      <span slot="label">
        演奏曲
        <font-awesome-icon id="tune" v-b-tooltip.hover icon="question-circle" />
        <!-- TODO リンクの色調整 -->
        <b-tooltip target="tune" triggers="hover" custom-class="yrl-playing-log-form-lg-tooltip">
          演奏曲を選択してください。<br />
          抜粋に関して無いものは自分で<nuxt-link to="/tunes/new">登録</nuxt-link>をするか、
          <nuxt-link :to="getInquiryLocation(2)">問い合わせフォーム</nuxt-link>よりリクエストをお願いします。<br />
          もしくは、全曲版を選択してください。<br />
          表記の間違えなどを発見した場合はこちらも
          <nuxt-link :to="getInquiryLocation(3)">問い合わせフォーム</nuxt-link>
          より指摘をお願いします。
        </b-tooltip>
      </span>
      <span v-if="requireTuneError && !playingLog.tune" class="text-danger">{{ requireTuneError }}</span>
      <p v-if="playingLog.tune">{{ playingLog.tune.composer.displayName }}作曲 {{ playingLog.tune.title }}</p>
      <b-button variant="primary" block @click="$bvModal.show('modal-tune-selector')">演奏曲を選択する</b-button>
      <TuneSelector @select-tune="selectTune($event)" />
      <div class="d-flex small">
        <nuxt-link to="/tunes/new">曲作成</nuxt-link>
        <nuxt-link class="ml-auto align-self-end" :to="inquiryMistakeLocation">
          曲・作曲家情報が間違っている
        </nuxt-link>
      </div>
    </b-form-group>
    <b-form-group>
      <span slot="label">
        編成
        <font-awesome-icon id="playstyle" v-b-tooltip.hover icon="question-circle" />
        <b-tooltip target="playstyle" triggers="hover" custom-class="yrl-playing-log-form-lg-tooltip">
          演奏した編成を選択してください。
        </b-tooltip>
      </span>
      <b-form-select v-model="playingLog.playstyle">
        <option v-for="playstyle in playstyles" :key="playstyle.id" :value="playstyle">
          {{ playstyle.name }}
        </option>
      </b-form-select>
    </b-form-group>

    <b-form-group>
      <span slot="label">
        編曲者
        <b-badge variant="info">任意</b-badge>
        <font-awesome-icon id="arranger" v-b-tooltip.hover icon="question-circle" />
        <b-tooltip target="arranger" triggers="hover" custom-class="yrl-playing-log-form-lg-tooltip">
          オリジナルの楽譜とは違う編曲版の場合は編曲者の名前を入れてください。
        </b-tooltip>
      </span>
      <b-form-input v-model="playingLog.arranger" placeholder="ラヴェル"></b-form-input>
    </b-form-group>

    <b-form-group>
      <span slot="label">
        担当楽器
        <font-awesome-icon id="instrument" v-b-tooltip.hover icon="question-circle" />
        <b-tooltip target="instrument" triggers="hover" custom-class="yrl-playing-log-form-lg-tooltip">
          選択肢の中から楽器を選んでください。<br />
          細かい種別や特殊楽器や持ち替えなどはポジションに入力してください。
        </b-tooltip>
      </span>
      <b-form-select v-model="playingLog.instrument" required>
        <option v-for="instrument in instruments" :key="instrument.id" :value="instrument">
          {{ instrument.name }}
        </option>
      </b-form-select>
    </b-form-group>

    <b-form-group>
      <span slot="label">
        ポジション
        <b-badge variant="info">任意</b-badge>
        <font-awesome-icon id="position" v-b-tooltip.hover icon="question-circle" />
        <b-tooltip target="position" triggers="hover" custom-class="yrl-playing-log-form-lg-tooltip">
          持ち替えなど細かい種別はここの欄に入力してください。
        </b-tooltip>
      </span>
      <b-form-input v-model="playingLog.position" placeholder="2nd assi"></b-form-input>
    </b-form-group>

    <b-form-group>
      <span slot="label">
        自分のレベル
        <font-awesome-icon id="player-level" v-b-tooltip.hover icon="question-circle" />
        <b-tooltip target="player-level" triggers="hover" custom-class="yrl-playing-log-form-lg-tooltip">
          目安としてブランクが無いことを前提に、<br />
          初心者；本番経験 〜10回程度<br />
          中級者；本番経験 10〜30回程度<br />
          上級者；本番経験 30〜回程度<br />
        </b-tooltip>
      </span>
      <b-form-select v-model="playingLog.playerLevel" required>
        <option
          v-for="playerLevel in Object.keys(playerLevelList)"
          :key="playerLevel"
          :value="playerLevelList[playerLevel]"
        >
          {{ playerLevelList[playerLevel] }}
        </option>
      </b-form-select>
    </b-form-group>

    <b-form-group>
      <span slot="label">
        点数で評価しない
        <font-awesome-icon id="is-not-evalute" v-b-tooltip.hover icon="question-circle" />
        <b-tooltip target="is-not-evalute" triggers="hover" custom-class="yrl-playing-log-form-lg-tooltip">
          遠い過去のものなど当時のレベルでの評価ができない場合などは評価を棄権しましょう。
        </b-tooltip>
      </span>
      <b-form-checkbox v-model="isNotEvalute" @change="isNotEvaluteCheckBoxHandler($event)" />
    </b-form-group>

    <b-form-group label="面白さ" :description="`数の大きい方が面白い: ${playingLog.interesting || '評価なし'}`">
      <b-form-input v-model="playingLog.interesting" :disabled="isNotEvalute" type="range" min="0" max="5" step="0.1" />
    </b-form-group>

    <b-form-group label="体力" :description="`数の大きい方が疲れる: ${playingLog.physicality || '評価なし'}`">
      <b-form-input v-model="playingLog.physicality" :disabled="isNotEvalute" type="range" min="0" max="5" step="0.1" />
    </b-form-group>

    <b-form-group label="難易度" :description="`数の大きい方が難しい: ${playingLog.difficulty || '評価なし'}`">
      <b-form-input v-model="playingLog.difficulty" :disabled="isNotEvalute" type="range" min="0" max="5" step="0.1" />
    </b-form-group>

    <b-form-group>
      <span slot="label">
        面白かったところ
        <b-badge variant="info">任意</b-badge>
      </span>
      <b-form-textarea
        v-model="playingLog.impressionOfInteresting"
        :placeholder="'2楽章中間部の掛け合いがたまらなく楽しい。\n4楽章が吹きごたえあって面白かった。'"
        rows="3"
        max-rows="6"
      ></b-form-textarea>
    </b-form-group>

    <b-form-group>
      <span slot="label">
        難しかったところ
        <b-badge variant="info">任意</b-badge>
      </span>
      <b-form-textarea
        v-model="playingLog.impressionOfDifficulty"
        :placeholder="'冒頭のリズムは各パターンを覚えてないと厳しい。\n3楽章のメロディーの音程合わせるのに苦労した。'"
        rows="3"
        max-rows="6"
      ></b-form-textarea>
    </b-form-group>

    <b-form-group>
      <span slot="label">
        次回への反省やアドバイス、譜面情報
        <b-badge variant="info">任意</b-badge>
      </span>
      <b-form-textarea
        v-model="playingLog.reflectionForNext"
        :placeholder="
          '1楽章 B のところからのリズムもっと練習する。\n最高音：B、最低音；LowCis\n4楽章ミュート使用箇所あり。'
        "
        rows="3"
        max-rows="6"
      ></b-form-textarea>
    </b-form-group>

    <b-form-group>
      <span slot="label">
        他パートや全体の感想
        <b-badge variant="info">任意</b-badge>
      </span>
      <b-form-textarea
        v-model="playingLog.otherPartInpression"
        placeholder="4楽章コーダの弦楽器の細かい音符が難しそうだった。"
        rows="3"
        max-rows="6"
      ></b-form-textarea>
    </b-form-group>

    <b-form-group>
      <span slot="label">
        演奏日
        <b-badge variant="info">任意</b-badge>
      </span>
      <b-form-input v-model="playingLog.playDate" type="date"></b-form-input>
    </b-form-group>

    <b-form-group>
      <span slot="label">
        演奏シーン
        <b-badge variant="info">任意</b-badge>
      </span>
      <b-form-input v-model="playingLog.scene" placeholder="定期演奏会中プロ"></b-form-input>
    </b-form-group>

    <b-form-group>
      <span slot="label">
        演奏団体
        <b-badge variant="info">任意</b-badge>
      </span>
      <b-form-input v-model="playingLog.team" placeholder="みゅーぐ管弦楽団"></b-form-input>
    </b-form-group>

    <b-form-group>
      <span slot="label">
        非公開の自分用メモ
        <b-badge variant="info">任意</b-badge>
      </span>
      <b-form-textarea
        v-model="playingLog.secretMemo"
        :placeholder="'風邪で本調子ではなかった。\n憧れの先輩の隣で演奏できた。\n指揮者がかっこよかった。'"
        rows="3"
        max-rows="6"
      ></b-form-textarea>
    </b-form-group>
    <b-form-group label="下書き" description="下書きを有効にすると、自分しか閲覧できないようになります。">
      <b-form-checkbox v-model="playingLog.isDraft" />
    </b-form-group>
    <b-button block type="submit" variant="primary">保存</b-button>
  </b-form>
</template>

<script lang="ts">
import { PropType } from 'vue';
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import { PlayingLog, PlayerLevel } from '../models/PlayingLog';
import { Tune, PlayStyle } from '../models/Tune';
import { Instrument } from '../models/Instrument';
import TuneSelector from './TuneSelector.vue';

@Component({
  components: {
    TuneSelector
  }
})
export default class PlayingLogForm extends Vue {
  // 演奏記録に選択するための編成
  @Prop({ type: Array as PropType<PlayStyle[]>, required: true })
  playstyles!: PlayStyle[];
  @Prop({ type: Array as PropType<Instrument[]>, required: true })
  instruments!: Instrument[];
  @Prop({ type: Object as PropType<PlayingLog>, required: true })
  playingLog!: PlayingLog;

  // TODO やっつけエラー表示機構なのでどうにかしたい
  @Prop({ type: String, default: null })
  requireTuneError!: string;

  playerLevelList = PlayerLevel;

  isNotEvalute: boolean =
    this.playingLog.interesting == null && this.playingLog.difficulty == null && this.playingLog.physicality == null;

  get inquiryMistakeLocation() {
    return { path: '/inquiry', query: { inquiryTypeId: '2' } };
  }
  // TODO 共通化 utilプラグインとか？
  getInquiryLocation(inquiryTypeId: number) {
    return { path: '/inquiry', query: { inquiryTypeId: inquiryTypeId.toString() } };
  }

  // TuneSelector で選択された tune を playingLog にセットする
  selectTune(tune: Tune) {
    this.$set(this.playingLog, 'tune', tune);
    this.playingLog.playstyle = tune.playstyle;
  }
  @Emit('on-submit')
  submitHandler() {}

  // 評価しないチェックボックスの挙動
  isNotEvaluteCheckBoxHandler(isNotEvalute: boolean) {
    // 評価しないにチェックした場合 null を入れる
    // 評価しないからチェックを外した場合フォームの null の時の位置の 2.5 を設定する
    this.playingLog.difficulty = isNotEvalute ? null : 2.5;
    this.playingLog.physicality = isNotEvalute ? null : 2.5;
    this.playingLog.interesting = isNotEvalute ? null : 2.5;
  }
}
</script>
<style lang="scss">
.yrl-playing-log-form-lg-tooltip {
  .tooltip-inner {
    max-width: 230px;
  }
}
</style>
