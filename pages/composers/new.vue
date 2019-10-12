<template>
  <section class="container">
    <div>
      <h1>
        作曲家新規作成ページ
      </h1>
      <b-form @submit.prevent="createComposer">
        <b-form-group label="フルネーム" description="フルネームでおねがいします">
          <b-form-input
            v-model="newComposer.fullName"
            required
            placeholder="ルードヴィヒ・ヴァン・ベートーヴェン"
          ></b-form-input>
        </b-form-group>
        <b-form-group label="国" description="出身やゆかりのある国を選択してください">
          <b-form-select v-model="newComposer.countries" multiple class="mb-3">
            <option v-for="country in countries" :key="country.id" :value="country">
              {{ country.name }}
            </option>
          </b-form-select>
        </b-form-group>

        <b-form-group label="作曲家詳細">
          <b-form-textarea
            v-model="newComposer.description"
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
import ComposerSelector from '~/components/ComposerSelector.vue';

@Component({
  components: {
    ComposerSelector
  },
  middleware: 'authenticated',
  async asyncData({ app }) {
    const countries = await app.$api.getCountries();
    return { countries };
  }
})
export default class Index extends Vue {
  newComposer: Composer = new Composer();
  async createComposer() {
    // 表示名も一旦フルネームと同じにする
    this.newComposer.displayName = this.newComposer.fullName;
    const composer = await this.$api.createComposer(this.newComposer);
    this.$router.push({ path: '/tunes/new', query: { composerId: composer.id!.toString() } });
  }
}
</script>
