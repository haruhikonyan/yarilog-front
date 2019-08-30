<template>
  <div>
    <b-modal id="modal-tune-selector" scrollable title="演奏曲選択">
      <b-list-group v-if="selectMode === SELECT_MODE.PLAYSTYLE">
        <b-list-group-item v-for="playstyle in playstyles" :key="playstyle.id" @click="selectPlaystyle(playstyle.id)">
          <span>{{ playstyle.name }} </span>
        </b-list-group-item>
      </b-list-group>
      <b-list-group v-if="selectMode === SELECT_MODE.COMPOSER">
        <b-list-group-item
          v-for="composer in selectingComposers"
          :key="composer.id"
          @click="selectComposer(composer.id)"
        >
          <span>{{ composer.displayName }} </span>
        </b-list-group-item>
      </b-list-group>
      <b-list-group v-if="selectMode === SELECT_MODE.TUNE">
        <b-list-group-item v-for="tune in selectingTunes" :key="tune.id" @click="selectTune(tune)">
          <span>{{ tune.title }}</span>
        </b-list-group-item>
      </b-list-group>
      <div slot="modal-footer" class="w-100">
        <b-button v-if="selectMode === SELECT_MODE.COMPOSER" class="float-left" @click="cancelSelectComposer">
          演奏形態選択へ戻る
        </b-button>
        <b-button v-if="selectMode === SELECT_MODE.TUNE" class="float-left" @click="cancelSelectTune">
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
import { PropType } from 'vue';
import { Composer } from '../models/Composer';
import { Tune, PlayStyle } from '../models/Tune';
import { PlayingLog } from '../models/PlayingLog';

enum SELECT_MODE {
  PLAYSTYLE,
  COMPOSER,
  TUNE
}

// 演奏形態ごとにグルーピングされた作曲家クラス
class ComposersGroupByPlaystyle {
  constructor(playstyleId) {
    this.playstyleId = playstyleId;
  }
  playstyleId!: number;
  tgbcs: TunesGroupByComposer[] = [];
}

// 作曲家ごとにグルーピングされた曲クラス
class TunesGroupByComposer {
  constructor(composer: Composer) {
    this.composer = composer;
  }
  composer!: Composer;
  tunes: Tune[] = [];
}

@Component({})
export default class TuneSelector extends Vue {
  // 曲を検索するための演奏形態一覧を受け取る
  @Prop({ type: Array as PropType<PlayStyle[]>, required: true })
  playstyles!: PlayStyle[];
  // template から参照できるように代入
  SELECT_MODE = SELECT_MODE;

  selectedPlaystyleId: number | null = null;
  selectedComposerId: number | null = null;
  composersGroupByPlaystyle: ComposersGroupByPlaystyle[] = [];

  get selectMode(): SELECT_MODE {
    if (this.selectedPlaystyleId && this.selectedComposerId) {
      return SELECT_MODE.TUNE;
    } else if (this.selectedPlaystyleId && !this.selectedComposerId) {
      return SELECT_MODE.COMPOSER;
    }
    return SELECT_MODE.PLAYSTYLE;
  }

  async selectPlaystyle(playstyleId: number) {
    // まだ演奏形態で作曲家が取得されていなければ API を叩いて作曲家を取得しにいく
    if (!this.composersGroupByPlaystyle.some(t => t.playstyleId === playstyleId)) {
      const cgbp = new ComposersGroupByPlaystyle(playstyleId);
      const composers = await this.$api.getComposersByPlaystyleId(playstyleId.toString());
      // 作曲家の分だけ TunesGroupByComposer(曲を入れる箱)を new する
      cgbp.tgbcs = composers.map(c => new TunesGroupByComposer(c));
      this.composersGroupByPlaystyle.push(cgbp);
    }
    this.selectedPlaystyleId = playstyleId;
  }

  async selectComposer(composerId: number) {
    const targetCgbp = this.composersGroupByPlaystyle.find(cgbp => cgbp.playstyleId === this.selectedPlaystyleId);
    const targetTgbp = targetCgbp!.tgbcs.find(tgbc => tgbc.composer.id === composerId);
    // 曲が1件も取得されていなければ API を叩いて曲を取得しにいく
    if (targetTgbp!.tunes.length === 0) {
      // 作曲家と演奏形態で曲一覧を取得する
      targetTgbp!.tunes = await this.$api.getTuneforSelector(composerId, this.selectedPlaystyleId!);
    }
    this.selectedComposerId = composerId;
  }

  get selectingComposers(): Composer[] {
    // 演奏形態が選択されていなければ空を返す(ありえないはず)
    if (!this.selectedPlaystyleId) {
      return [];
    }
    // 選択されてる演奏形態から作曲家を絞り込む
    const targetTgbp = this.composersGroupByPlaystyle.find(cgbp => cgbp.playstyleId === this.selectedPlaystyleId);
    if (targetTgbp) {
      // 演奏形態でグルーピングされた作曲家から曲を返す
      return targetTgbp.tgbcs.map(tgbc => tgbc.composer);
    } else {
      return [];
    }
  }
  // 選択する tunes を返す
  get selectingTunes(): Tune[] {
    const targetCgbp = this.composersGroupByPlaystyle.find(cgbp => cgbp.playstyleId === this.selectedPlaystyleId);
    const targetTgbp = targetCgbp!.tgbcs.find(tgbc => tgbc.composer.id === this.selectedComposerId);
    return targetTgbp!.tunes;
  }

  @Emit('select-tune')
  selectTune(tune: Tune) {
    // モーダルを閉じる
    this.$bvModal.hide('modal-tune-selector');
    // 作曲家、演奏形態を未選択状態にする
    this.selectedPlaystyleId = null;
    this.selectedComposerId = null;
    return tune;
  }

  cancelSelectTune() {
    this.selectedComposerId = null;
  }
  cancelSelectComposer() {
    this.selectedPlaystyleId = null;
  }
}
</script>
