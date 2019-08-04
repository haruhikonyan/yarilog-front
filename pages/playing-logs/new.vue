<template>
  <section class="container">
    <div>
      <h1 class="title">
        演奏ログ新規作成ページ
      </h1>
      <b-form @submit.prevent="createPlayingLog">
        <b-form-group label="演奏曲">
          <p v-if="playingLog.tune">{{ playingLog.tune.composer.displayName }}作曲 {{ playingLog.tune.title }}</p>
          <b-button variant="primary" block @click="$bvModal.show('modal-tune-selector')">演奏曲を選択する</b-button>
          <TuneSelector :composers="composers" @select-tune="selectTune($event)" />
        </b-form-group>

        <b-form-group label="演奏日">
          <b-form-input v-model="playingLog.playDate" type="date"></b-form-input>
        </b-form-group>

        <b-form-group label="演奏団体">
          <b-form-input v-model="playingLog.team" placeholder="読売日本交響楽団"></b-form-input>
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

        <b-form-group label="難易度" :description="`数の大きい方が難しい: ${playingLog.difficulty}`">
          <b-form-input v-model="playingLog.difficulty" required type="range" min="0" max="5" step="0.1"></b-form-input>
        </b-form-group>

        <b-form-group label="体力" :description="`数の大きい方が疲れる: ${playingLog.physicality}`">
          <b-form-input
            v-model="playingLog.physicality"
            required
            type="range"
            min="0"
            max="5"
            step="0.1"
          ></b-form-input>
        </b-form-group>

        <b-form-group label="面白さ" :description="`数の大きい方が面白い: ${playingLog.interesting}`">
          <b-form-input
            v-model="playingLog.interesting"
            required
            type="range"
            min="0"
            max="5"
            step="0.1"
          ></b-form-input>
        </b-form-group>

        <b-form-group label="自分のパートの感想">
          <b-form-textarea
            v-model="playingLog.inpression"
            placeholder="難しかった"
            rows="3"
            max-rows="6"
          ></b-form-textarea>
        </b-form-group>

        <b-form-group label="他パートや全体の感想">
          <b-form-textarea
            v-model="playingLog.otherPartInpression"
            placeholder="難しそうだった"
            rows="3"
            max-rows="6"
          ></b-form-textarea>
        </b-form-group>

        <b-form-group label="非公開の自分用メモ">
          <b-form-textarea
            v-model="playingLog.secretMemo"
            placeholder="もうやりたくない"
            rows="3"
            max-rows="6"
          ></b-form-textarea>
        </b-form-group>
        <b-form-group label="下書き">
          <b-form-checkbox v-model="playingLog.isDraft"> </b-form-checkbox>
        </b-form-group>
        <b-button block type="submit" variant="primary">作成</b-button>
      </b-form>
      <nuxt-link to="/tunes/new">曲作成</nuxt-link>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { User } from '~/models/User';
import { PlayingLog, PlayerLevel } from '~/models/PlayingLog';
import { Instrument } from '../../models/Instrument';
import TuneSelector from '../../components/TuneSelector.vue';
import { Composer } from '../../models/Composer';
import { Tune } from '../../models/Tune';

@Component({
  components: {
    TuneSelector
  },
  async asyncData({ app }) {
    const composersData = await app.$api.getComposers();
    const instrumentsData = await app.$api.getInstruments();
    return { composers: composersData, instruments: instrumentsData };
  }
})
export default class Index extends Vue {
  composers: Composer[] = [];
  instruments: Instrument[] = [];
  playingLog: PlayingLog = new PlayingLog();
  playerLevelList: Object = PlayerLevel;
  async createPlayingLog() {
    const savedPlayingLog = await this.$api.createPlayingLog(this.playingLog);
    this.$router.push(savedPlayingLog.id!);
  }
  // TuneSelector で選択された tune を playingLog にセットする
  selectTune(tune: Tune) {
    this.playingLog.tune = tune;
  }
}
</script>
