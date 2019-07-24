<template>
  <section class="container">
    <div>
      <logo />
      <h1 class="title">
        曲新規作成ページ
      </h1>
      <h2 class="subtitle">
        yarilog frontend system by Nuxt.js
      </h2>
      <form>
        <div class="form-group">
          <label>タイトル</label>
          <input v-model="newTune.title" placeholder="作曲家の名前は含めないように" />
        </div>
        <div class="form-group">
          <label>作曲家</label>
          <select v-model="newTune.composer">
            <option v-for="composer in composers" :key="composer.id" :value="composer">
              {{ composer.fullName }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label>曲詳細</label>
          <textarea
            v-model="newTune.description"
            placeholder="後からこの項目は管理者より修正する場合がございます"
          ></textarea>
        </div>
        <button type="submit" class="btn btn-primary" @click="createTune">Submit</button>
      </form>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import $axios from '@nuxtjs/axios';
import Logo from '~/components/Logo.vue';
import { User } from '~/models/User';
import { Country } from '~/models/Country';
import { Composer } from '~/models/Composer';
import { PlayingLog } from '~/models/PlayingLog';
import { Tune } from '~/models/Tune';

@Component({
  components: {
    Logo
  },
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
