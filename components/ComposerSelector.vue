<template>
  <div>
    <vue-simple-suggest
      v-model="selectedComposer"
      :styles="autoCompleteStyle"
      mode="select"
      :list="simpleSuggestionList"
      :debounce="200"
      placeholder="全作曲家"
      display-attribute="displayName"
      @select="onSelect"
    >
      <div slot="suggestion-item" slot-scope="{ suggestion }">
        <span>{{ suggestion.displayName }}</span>
      </div>
    </vue-simple-suggest>
  </div>
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
  @Prop({ type: String, default: null })
  defaultComposerId!: string | null;

  selectedComposer: Composer | null = null;

  async created() {
    if (this.defaultComposerId) {
      this.selectedComposer = await this.$api.getComposer(this.defaultComposerId);
    }
  }

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
  onSelect(): number | null {
    return this.selectedComposer ? this.selectedComposer.id! : null;
  }
}
</script>
