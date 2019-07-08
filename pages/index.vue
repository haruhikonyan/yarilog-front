<template>
  <section class="container">
    <div>
      <logo />
      <h1 class="title">
        yarilog-front
      </h1>
      <h2 class="subtitle">
        yarilog frontend system by Nuxt.js
      </h2>
      <div class="links">
        <nuxt-link to="/login">login page</nuxt-link>
        <a href="https://nuxtjs.org/" target="_blank" class="button--green">Documentation</a>
        <a href="https://github.com/nuxt/nuxt.js" target="_blank" class="button--grey">GitHub</a>
        <p v-for="user in users" :key="user.id">ID：{{ user.id }} 名前：{{ user.name }} 詳細：{{ user.description }}</p>
        <div>
          <button class="btn btn-primary" @click="createUser">
            ユーザ追加
          </button>
          <button class="btn btn-primary" @click="createComposer">
            ベートーヴェン追加
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import $axios from '@nuxtjs/axios';
import Logo from '~/components/Logo.vue';
import { User } from '~/models/User';
import { Country } from 'models/Country';
import { Composer } from 'models/Composer';

@Component({
  components: {
    Logo
  },
  async asyncData({ app }) {
    const data = await app.$api.getUsers();
    return { users: data };
  }
})
export default class Index extends Vue {
  users: User[] = [];
  // TODO フォームから値を受け取ってその値で保存する
  async createUser() {
    const newUser = new User();
    newUser.name = 'ゆーざめい';
    newUser.description = 'ですく';
    const createdUser = await this.$api.createUser(newUser);
    this.users.push(createdUser);
  }
  async createComposer() {
    const country: Country = {
      id: 1,
      name: 'ドイツ',
      description: 'ヨーロッパの国'
    };
    const composerData: Composer = {
      id: null,
      lastName: 'ベートーヴェン',
      fullName: 'ルードヴィヒ・ヴァン・ベートーヴェン',
      description: '運命とかで有名なあの人',
      countries: [country]
    };
    await this.$api.createComposer(composerData);
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
