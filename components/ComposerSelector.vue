<template>
  <!-- TODO しかたがないので defaultComposer があるかないかで分けている
   :value と v-model もしくは @select の併用はできない -->
  <vue-simple-suggest
    v-if="defaultComposer"
    ref="suggestComponent"
    :value="defaultComposer"
    :styles="autoCompleteStyle"
    mode="select"
    :list="simpleSuggestionList"
    :debounce="200"
    :placeholder="placeholder"
    :display-attribute="displayAttribute"
    type="search"
    :nullable-select="true"
    @input="inputHandler"
    @blur="blurHandler"
  >
    <div slot="suggestion-item" slot-scope="{ suggestion }">
      <span>{{ suggestion[displayAttribute] }}</span>
    </div>
  </vue-simple-suggest>
  <vue-simple-suggest
    v-else
    ref="suggestComponent"
    v-model="selectedComposer"
    :styles="autoCompleteStyle"
    mode="select"
    :list="simpleSuggestionList"
    :debounce="200"
    :placeholder="placeholder"
    :display-attribute="displayAttribute"
    type="search"
    :nullable-select="true"
    @input="inputHandler"
    @blur="blurHandler"
  >
    <div slot="suggestion-item" slot-scope="{ suggestion }">
      <span>{{ suggestion[displayAttribute] }}</span>
    </div>
  </vue-simple-suggest>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import { PropType } from 'vue';
import VueSimpleSuggest from 'vue-simple-suggest';
import 'vue-simple-suggest/dist/styles.css'; // Optional CSS
import { Composer } from '../models/Composer';

@Component({
  components: {
    VueSimpleSuggest
  }
})
export default class ComposerSelector extends Vue {
  @Prop({ type: Object as PropType<Composer>, default: null })
  defaultComposer!: Composer | null;

  @Prop({ type: String, default: '' })
  placeholder!: string;

  @Prop({ type: String, default: 'displayName' })
  displayAttribute!: string;

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
    // 2文字以上であれば作曲家を検索してサジェストする
    return searchWord.length > 1 ? this.$api.searchComposers(searchWord) : Promise.resolve([]);
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
    if (this.suggestComponent.text !== this.selectedComposer[this.displayAttribute]) {
      this.selectedComposer = null;
      this.suggestComponent.setText('');
    }
  }
  // input からフォーカスが外れた際に実行される
  // サジェストされたものと全く同じのを入力し、選択してなかった場合その選択肢を反映させる
  blurHandler() {
    // 作曲家が選択されてないかつ、入力された文字がある時
    if (!this.selectedComposer && this.suggestComponent.text) {
      // 入力された文字列に一致する作曲家が存在すればそれを選択する
      const someInputComposer = (this.suggestComponent.suggestions as Composer[]).find(
        c => c[this.displayAttribute] === this.suggestComponent.text
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
