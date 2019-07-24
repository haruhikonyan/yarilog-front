<template>
  <section class="container">
    <div>
      <h1>
        曲新規作成ページ
      </h1>
      <b-form @submit="createTune">
        <b-form-group label="作曲者">
          <b-form-select v-model="newTune.composer" class="mb-3">
            <option v-for="composer in composers" :key="composer.id" :value="composer">
              {{ composer.fullName }}
            </option>
          </b-form-select>
        </b-form-group>
        <b-form-group label="タイトル" description="作曲家の名前は含めないように">
          <b-form-input v-model="newTune.title" required placeholder="交響曲第1番 ハ長調"></b-form-input>
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
import { User } from '~/models/User';
import { Country } from '~/models/Country';
import { Composer } from '~/models/Composer';
import { PlayingLog } from '~/models/PlayingLog';
import { Tune } from '~/models/Tune';

@Component({
  components: {},
  async asyncData({ app }) {
    const composersData = await app.$api.getComposers();
    return { composers: composersData };
  }
})
export default class Index extends Vue {
  composers: Composer[] = [];
  newTune: Tune = new Tune();
  async createTune() {
    await this.$api.createTune(this.newTune);
  }
}
</script>
