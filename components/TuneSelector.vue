<template>
  <div>
    <b-modal id="modal-tune-selector" title-class="flex-grow-1" content-class="yrl-tune-selector-modal" scrollable>
      <div slot="modal-title">
        演奏曲選択{{ displaySelectedComposerName }}
        <b-form-input
          v-if="selectMode === SELECT_MODE.TUNE"
          v-model="filterStrings"
          size="sm"
          placeholder="絞り込む"
          class="mt-1"
        />
      </div>
      <div v-if="selectMode === SELECT_MODE.COMPOSER">
        <ComposerSelector placeholder="作曲家検索" display-attribute="fullName" @on-select="onSelectComposer($event)" />
        <div class="mt-2">
          作曲家が見つからない場合は
        </div>
        <nuxt-link :to="getInquiryLocation(3)">こちらからリクエスト</nuxt-link>するか、<br />
        <nuxt-link to="/composers/new">作曲家の新規作成</nuxt-link>をお願いします。
      </div>
      <div v-if="selectMode === SELECT_MODE.TUNE">
        <b-list-group>
          <b-list-group-item v-for="tune in selectingTunes" :key="tune.id" @click="selectTune(tune)">
            <span>{{ tune.title }}</span>
          </b-list-group-item>
        </b-list-group>
        <div class="mt-2">{{ displayCreateTuneReccomendString }}</div>
        <nuxt-link :to="getInquiryLocation(3)">こちらから曲をリクエスト</nuxt-link>するか、<br />
        <nuxt-link to="/tunes/new">曲の新規作成</nuxt-link>をお願いします。
      </div>
      <div slot="modal-footer" class="w-100">
        <b-button v-if="selectMode === SELECT_MODE.TUNE" class="float-left" @click="cancelSelectTune">
          作曲家検索へ戻る
        </b-button>
        <b-button variant="primary" class="float-right" @click="$bvModal.hide('modal-tune-selector')">
          閉じる
        </b-button>
      </div>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Emit } from 'vue-property-decorator';
import { Composer } from '../models/Composer';
import { Tune } from '../models/Tune';
import ComposerSelector from './ComposerSelector.vue';

enum SELECT_MODE {
  COMPOSER,
  TUNE
}

// 作曲家ごとにグルーピングされた曲クラス
class TunesGroupByComposer {
  constructor(composer: Composer) {
    this.composer = composer;
  }
  composer!: Composer;
  tunes: Tune[] = [];
}

@Component({
  components: {
    ComposerSelector
  }
})
export default class TuneSelector extends Vue {
  // template から参照できるように代入
  SELECT_MODE = SELECT_MODE;

  selectedComposer: Composer | null = null;
  tunesGroupByComposerList: TunesGroupByComposer[] = [];

  // 絞り込み文字列
  filterStrings = '';

  get selectMode(): SELECT_MODE {
    return this.selectedComposer ? SELECT_MODE.TUNE : SELECT_MODE.COMPOSER;
  }

  async onSelectComposer(composer: Composer) {
    if (!composer) {
      return;
    }
    const targetTgbp = this.tunesGroupByComposerList.find(tgbc => tgbc.composer.id === composer.id);
    // 作曲家に対して曲が未取得であれば API を叩いて曲を取得しにいく
    if (!targetTgbp) {
      // 新しく TunesGroupByComposer を作って曲をセットし、リストに加える
      const newTgbc = new TunesGroupByComposer(composer);
      newTgbc.tunes = await this.$api.getTunesByComposerId(composer.id!);
      this.tunesGroupByComposerList.push(newTgbc);
    }
    this.selectedComposer = composer;
    this.filterStrings = '';
  }

  // 選択する tunes を返す
  get selectingTunes(): Tune[] {
    if (!this.selectedComposer) {
      return [];
    }
    const targetTgbp = this.tunesGroupByComposerList.find(tgbc => tgbc.composer.id === this.selectedComposer!.id);
    const tunes = targetTgbp!.tunes.filter(tune => tune.title.includes(this.filterStrings));
    return this.sortTunes(tunes);
  }

  get displaySelectedComposerName() {
    return this.selectedComposer ? ` / ${this.selectedComposer.displayName}` : '';
  }

  get displayCreateTuneReccomendString() {
    return this.selectingTunes.length === 0 ? 'まだ曲が登録されていません。' : '曲が見つからない場合は、';
  }

  // TODO 共通化 utilプラグインとか？
  getInquiryLocation(inquiryTypeId: number) {
    return { path: '/inquiry', query: { inquiryTypeId: inquiryTypeId.toString() } };
  }

  sortTunes(tunes: Tune[]): Tune[] {
    // return するソート後の配列
    const sortedTunes: Tune[] = [];
    // ソートする要素のまとまりたち
    const symphonyList: Tune[] = [];
    const symphonicPoem: Tune[] = [];
    const concertoTunes: Tune[] = [];
    const operaTunes: Tune[] = [];
    const overtureTunes: Tune[] = [];
    // 抽出しないのこりの曲
    const remainingTunes: Tune[] = [];
    tunes.forEach(t => {
      // TODO ジャンルを使えばもっといい感じになるか？
      if (t.title.includes('交響曲')) {
        symphonyList.push(t);
        return;
      }
      if (t.title.includes('交響詩')) {
        symphonicPoem.push(t);
        return;
      }
      if (t.title.includes('協奏曲')) {
        concertoTunes.push(t);
        return;
      }
      if (t.title.includes('歌劇')) {
        operaTunes.push(t);
        return;
      }
      if (t.title.includes('序曲')) {
        overtureTunes.push(t);
        return;
      }
      remainingTunes.push(t);
    });
    // のこりはソート
    remainingTunes.sort((a, b) => {
      return a.title < b.title ? -1 : 1;
    });
    // 抽出したものを上から積み上げ、最後にのこりを結合
    sortedTunes.push(
      ...symphonyList,
      ...symphonicPoem,
      ...concertoTunes,
      ...operaTunes,
      ...overtureTunes,
      ...remainingTunes
    );
    return sortedTunes;
  }

  @Emit('select-tune')
  selectTune(tune: Tune) {
    // モーダルを閉じる
    this.$bvModal.hide('modal-tune-selector');
    // 作曲家を未選択状態にする
    this.selectedComposer = null;
    this.filterStrings = '';
    return tune;
  }

  cancelSelectTune() {
    this.filterStrings = '';
    this.selectedComposer = null;
  }
}
</script>
<style lang="scss">
.yrl-tune-selector-modal {
  height: calc(100vh - 5rem);
}
</style>
