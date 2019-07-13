<template>
  <section class="container">
    <div>
      <logo />
      <h1 class="title">
        ユーザ新規登録
      </h1>
      <h2 class="subtitle">
        yarilog frontend system by Nuxt.js
      </h2>
      <form>
        <div class="form-group">
          <label>ユーザ名</label>
          <input v-model="newUser.username" type="text" placeholder="ログインに使用します" />
        </div>
        <div class="form-group">
          <label>メールアドレス</label>
          <input v-model="newUser.mailAddress" type="email" placeholder="yarilog@gmail.com" />
        </div>
        <div class="form-group">
          <label>パスワード</label>
          <input v-model="newUser.password" type="password" />
        </div>
        <div class="form-group">
          <label>表示名</label>
          <input v-model="newUser.nickname" type="text" placeholder="投稿に表示される名前です" />
        </div>
      </form>
      <button class="btn btn-primary" @click="createUser">Submit</button>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import $axios from '@nuxtjs/axios';
import Logo from '~/components/Logo.vue';
import { User } from '~/models/User';

@Component({
  components: {
    Logo
  }
})
export default class Index extends Vue {
  newUser: User = new User();
  async createUser() {
    await this.$api.createUser(this.newUser);
    // TODO マイページ的なところに遷移
    this.$router.push('/');
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
