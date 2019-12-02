<template>
  <section class="container">
    <div>
      <h1>
        曲新規作成ページ
      </h1>
      <b-form @submit.prevent="createTune">
        <b-form-group label="作曲者">
          <ComposerSelector
            placeholder="作曲家検索"
            display-attribute="fullName"
            :default-composer="newTune.composer"
            @on-select="onSelectComposer($event)"
          />
          <small class="float-right mr-1"><nuxt-link to="/composers/new">作曲家新規登録</nuxt-link></small>
        </b-form-group>
        <b-form-group label="タイトル" description="作曲家の名前は含めないように">
          <b-form-input v-model="newTune.title" required placeholder="交響曲第1番 ハ長調"></b-form-input>
        </b-form-group>
        <b-form-group label="演奏形態">
          <b-form-select v-model="newTune.playstyle" class="mb-3">
            <option v-for="playstyle in playstyles" :key="playstyle.id" :value="playstyle.id.toString()">
              {{ playstyle.name }}
            </option>
          </b-form-select>
        </b-form-group>

        <b-form-group label="曲詳細">
          <b-form-textarea
            v-model="newTune.description"
            placeholder="後からこの項目は管理者より修正する場合がございます"
            rows="3"
            max-rows="6"
          ></b-form-textarea>
        </b-form-group>
        <b-button type="submit" variant="primary">作成</b-button>
      </b-form>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Composer } from '~/models/Composer';
import { Tune } from '~/models/Tune';
import ComposerSelector from '~/components/ComposerSelector.vue';

@Component({
  components: {
    ComposerSelector
  },
  middleware: 'authenticated',
  async asyncData({ app, query }) {
    const playstyles = await app.$api.getPlaystyles();
    const newTune = new Tune();
    const composerId = query.composerId;
    if (composerId) {
      newTune.composer = await app.$api.getComposer(composerId);
    }
    return { playstyles, newTune };
  }
})
export default class Index extends Vue {
  composers: Composer[] = [];
  // TODO fix WARN  Cannot stringify arbitrary non-POJOs Tune
  newTune!: Tune;
  async createTune() {
    await this.$api.createTune(this.newTune);
    this.$router.push('/playing-logs/new');
  }

  onSelectComposer(composer: Composer) {
    this.newTune.composer = composer;
  }
}
</script>
