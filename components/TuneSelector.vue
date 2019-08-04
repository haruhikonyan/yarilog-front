<template>
  <div>
    <b-modal id="modal-tune-selector" scrollable title="演奏曲選択">
      <b-list-group v-if="selectedComposerId == null">
        <b-list-group-item v-for="composer in composers" :key="composer.id" @click="selectComposer(composer.id)">
          <span>{{ composer.displayName }} </span>
        </b-list-group-item>
      </b-list-group>
      <b-list-group v-else>
        <b-list-group-item v-for="tune in selectingTunes" :key="tune.id" @click="selectTune(tune)">
          <span>{{ tune.title }}</span>
        </b-list-group-item>
      </b-list-group>
      <div slot="modal-footer" class="w-100">
        <b-button v-if="selectedComposerId != null" class="float-left" @click="cancelSelectTune">
          作曲家選択へ戻る
        </b-button>
        <b-button variant="primary" class="float-right" @click="$bvModal.hide('modal-tune-selector')">
          閉じる
        </b-button>
      </div>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import { Composer } from '../models/Composer';
import { Tune } from '../models/Tune';
import { PlayingLog } from '../models/PlayingLog';

// 作曲家ごとにグルーピングされた曲クラス
class TunesGroupByComposer {
  constructor(composerId) {
    this.composerId = composerId;
  }
  composerId!: number;
  tunes: Tune[] = [];
}

@Component({})
export default class TuneSelector extends Vue {
  // 曲を検索するための作曲家一覧を受け取る
  @Prop({ type: Array, required: true })
  composers!: Composer[];

  selectedComposerId: number | null = null;
  tunesGroupByComposer: TunesGroupByComposer[] = [];

  async selectComposer(composerId: number) {
    this.selectedComposerId = composerId;
    // 与えられた composerId の TunesGroupByComposer が無ければ新規作成し tunes を取得する
    if (!this.tunesGroupByComposer.some(t => t.composerId === composerId)) {
      const tgbc = new TunesGroupByComposer(composerId);
      tgbc.tunes = await this.$api.getTuneByComposer(composerId.toString());
      this.tunesGroupByComposer.push(tgbc);
    }
  }
  // 選択する tunes を返す
  get selectingTunes(): Tune[] | null {
    const tgbc = this.tunesGroupByComposer.find(tgbc => tgbc.composerId === this.selectedComposerId);
    return tgbc ? tgbc.tunes : null;
  }

  @Emit('select-tune')
  selectTune(tune: Tune) {
    // モーダルを閉じる
    this.$bvModal.hide('modal-tune-selector');
    // 作曲家未選択状態にする
    this.selectedComposerId = null;
    return tune;
  }

  cancelSelectTune() {
    this.selectedComposerId = null;
  }
}
</script>
