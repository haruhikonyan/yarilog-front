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
          <textarea v-model="newTune.title" placeholder="作曲家の名前は含めないように"></textarea>
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
    const userData = await app.$api.getUser('1');
    const composersData = await app.$api.getComposers();
    return { user: userData, composers: composersData };
  }
})
export default class Index extends Vue {
  // 誰が作ったかの記録は取っておきたい
  user: User | undefined;
  composers: Composer[] = [];
  newTune: Tune = new Tune();
  async createTune() {
    await this.$api.createTune(this.newTune);
  }
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue',
    Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
