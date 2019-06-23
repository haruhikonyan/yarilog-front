<template>
  <section class="container">
    <div>
      <logo />
      <h1 class="title">
        演奏ログ新規作成ページ
      </h1>
      <h2 class="subtitle">
        yarilog frontend system by Nuxt.js
      </h2>
      <div class="links">
        <a href="https://nuxtjs.org/" target="_blank" class="button--green"
          >Documentation</a
        >
        <a
          href="https://github.com/nuxt/nuxt.js"
          target="_blank"
          class="button--grey"
          >GitHub</a
        >
        <p>
          ID：{{ user.id }} 名前：{{ user.name }} 詳細：{{ user.description }}
        </p>
        <button class="btn btn-primary" @click="createPlayingLog">
          演奏ログ追加
        </button>
        <button class="btn btn-primary" @click="createTune">
          曲追加
        </button>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import $axios from '@nuxtjs/axios'
import Logo from '~/components/Logo.vue'
import { User } from '~/models/User'
import { Country } from 'models/Country'
import { Composer } from 'models/Composer'
import { PlayingLog } from 'models/PlayingLog'
import { Tune } from 'models/Tune'

@Component({
  components: {
    Logo
  },
  async asyncData({ app }) {
    const data = await app.$api.getUser('1')
    return { user: data }
  }
})
export default class Index extends Vue {
  user: User | null = null
  async createPlayingLog() {
    const country: Country = {
      id: '1',
      name: 'ドイツ',
      description: 'ヨーロッパの国'
    }
    const composer: Composer = {
      id: null,
      lastName: 'ベートーヴェン',
      fullName: 'ルードヴィヒ・ヴァン・ベートーヴェン',
      description: '運命とかで有名なあの人',
      countries: [country]
    }
    const tune: Tune = {
      id: '1',
      title: '交響曲第1番',
      description: '意欲作',
      composer: composer
    }
    const playingLogData: PlayingLog = {
      id: null,
      description: '詳細やでえええええ',
      tune: tune,
      user: this.user!
    }
    await this.$api.createPlayingLog(playingLogData)
  }
  async createTune() {
    const country: Country = {
      id: '1',
      name: 'ドイツ',
      description: 'ヨーロッパの国'
    }
    const composer: Composer = {
      id: '1',
      lastName: 'ベートーヴェン',
      fullName: 'ルードヴィヒ・ヴァン・ベートーヴェン',
      description: '運命とかで有名なあの人',
      countries: [country]
    }
    const tuneData: Tune = {
      id: null,
      title: '交響曲第1番',
      description: '意欲作',
      composer: composer
    }
    await this.$api.createTune(tuneData)
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
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
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
