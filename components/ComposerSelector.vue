<template>
  <vue-simple-suggest
    ref="suggestComponent"
    :value="defaultComposer"
    :styles="autoCompleteStyle"
    mode="select"
    :list="simpleSuggestionList"
    :debounce="200"
    placeholder="作曲家で絞る"
    display-attribute="displayName"
    type="search"
    :nullable-select="true"
    @input="inputHandler"
    @blur="blurHandler"
  >
    <div slot="suggestion-item" slot-scope="{ suggestion }">
      <span>{{ suggestion.displayName }}</span>
    </div>
  </vue-simple-suggest>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import { PropType } from 'vue';
import VueSimpleSuggest from 'vue-simple-suggest';
import 'vue-simple-suggest/dist/styles.css'; // Optional CSS
import { PlayingLog } from '../models/PlayingLog';
import { Instrument } from '../models/Instrument';
import { Composer } from '../models/Composer';

@Component({
  components: {
    VueSimpleSuggest
  }
})
export default class ComposerSelector extends Vue {
  @Prop({ type: Object as PropType<Composer>, default: null })
  defaultComposer!: Composer | null;

  get selectedComposer(): Composer | null {
    return this.defaultComposer;
  }
  set selectedComposer(value) {
    this.onSelect(value);
  }

  get suggestComponent(): any {
    return this.$refs.suggestComponent;
  }

  // bootstrap 用の style
  get autoCompleteStyle() {
    return {
      vueSimpleSuggest: 'position-relative',
      inputWrapper: '',
      defaultInput: 'form-control',
      suggestions: 'position-absolute list-group z-1000',
      suggestItem: 'list-group-item'
    };
  }

  simpleSuggestionList(searchWord): Promise<Composer[]> {
    return this.$api.searchComposers(searchWord);
  }
  @Emit('on-select')
  onSelect(composer: Composer | null): Composer | null {
    return composer;
  }
  // input ボックスに入力した際に実行される
  inputHandler() {
    // 作曲家が何も選択されていなければ何もしない
    if (!this.selectedComposer) {
      return;
    }
    // 選択済みで選択済みの作曲家以外のものを入力しようとすると作曲家の選択と input を初期化する
    if (this.suggestComponent.text !== this.selectedComposer.displayName) {
      this.selectedComposer = null;
      this.suggestComponent.setText('');
    }
  }
  // input からフォーカスが外れた際に実行される
  // なぜか v-model や @select を利用すると :value を指定してるにも関わらず null で一旦初期化される
  // select 等利用せず、すべてはここで決めるようにする(フォーカスが外れた瞬間にselect判断を行っている)
  blurHandler() {
    // 作曲家が選択されてないかつ、入力された文字がある時
    if (!this.selectedComposer && this.suggestComponent.text) {
      // 入力された文字列に一致する作曲家が存在すればそれを選択する
      const someInputComposer = (this.suggestComponent.suggestions as Composer[]).find(
        c => c.displayName === this.suggestComponent.text
      );
      if (someInputComposer) {
        this.selectedComposer = someInputComposer;
      } else {
        // 存在しなければ input を初期化する
        this.suggestComponent.setText('');
      }
    }
  }
}
</script>
