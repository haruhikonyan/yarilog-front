<template>
  <b-form @submit.prevent="submitHandler">
    <b-form-group label="演奏曲">
      <span v-if="requireTuneError && !playingLog.tune" class="text-danger">{{ requireTuneError }}</span>
      <p v-if="playingLog.tune">
        {{ playingLog.tune.composer.displayName }}作曲 {{ playingLog.tune.title }}({{ playingLog.tune.playstyle.name }})
      </p>
      <b-button variant="primary" block @click="$bvModal.show('modal-tune-selector')">演奏曲を選択する</b-button>
      <TuneSelector :playstyles="playstyles" @select-tune="selectTune($event)" />
    </b-form-group>

    <b-form-group label="担当パート">
      <b-form-select v-model="playingLog.instrument" required>
        <option v-for="instrument in instruments" :key="instrument.id" :value="instrument">
          {{ instrument.name }}
        </option>
      </b-form-select>
    </b-form-group>

    <b-form-group label="ポジション">
      <b-form-input v-model="playingLog.position" placeholder="2nd assi"></b-form-input>
    </b-form-group>

    <b-form-group label="自分のレベル">
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

    <b-form-group label="評価しない">
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

    <b-form-group label="面白かったところ">
      <b-form-textarea
        v-model="playingLog.impressionOfInteresting"
        placeholder="4楽章が吹きごたえあって面白かった"
        rows="3"
        max-rows="6"
      ></b-form-textarea>
    </b-form-group>

    <b-form-group label="難しかったところ">
      <b-form-textarea
        v-model="playingLog.impressionOfDifficulty"
        placeholder="3楽章のメロディー合わせるのに苦労した"
        rows="3"
        max-rows="6"
      ></b-form-textarea>
    </b-form-group>

    <b-form-group label="次回への反省やアドバイス">
      <b-form-textarea
        v-model="playingLog.reflectionForNext"
        placeholder="1楽章 B のところからのリズムもっと練習する"
        rows="3"
        max-rows="6"
      ></b-form-textarea>
    </b-form-group>

    <b-form-group label="他パートや全体の感想">
      <b-form-textarea
        v-model="playingLog.otherPartInpression"
        placeholder="4楽章コーダの弦楽器の細かい音符が難しそうだった"
        rows="3"
        max-rows="6"
      ></b-form-textarea>
    </b-form-group>

    <b-form-group label="演奏日">
      <b-form-input v-model="playingLog.playDate" type="date"></b-form-input>
    </b-form-group>

    <b-form-group label="演奏団体">
      <b-form-input v-model="playingLog.team" placeholder="読売日本交響楽団"></b-form-input>
    </b-form-group>

    <b-form-group label="非公開の自分用メモ">
      <b-form-textarea
        v-model="playingLog.secretMemo"
        placeholder="風邪で本調子ではなかった"
        rows="3"
        max-rows="6"
      ></b-form-textarea>
    </b-form-group>
    <b-form-group label="下書き">
      <b-form-checkbox v-model="playingLog.isDraft"> </b-form-checkbox>
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
  // 曲を検索するための演奏形態一覧を受け取る
  @Prop({ type: Array as PropType<PlayStyle[]>, required: true })
  playstyles!: PlayStyle[];
  @Prop({ type: Array as PropType<Instrument[]>, required: true })
  instruments!: Instrument[];
  @Prop({ type: Object as PropType<PlayingLog>, required: true })
  playingLog!: PlayingLog;

  // TODO やっつけエラー表示機構なのでどうにかしたい
  @Prop({ type: String, default: null })
  requireTuneError!: string;

  playerLevelList: Object = PlayerLevel;

  isNotEvalute: boolean = false;

  // TuneSelector で選択された tune を playingLog にセットする
  selectTune(tune: Tune) {
    this.$set(this.playingLog, 'tune', tune);
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
