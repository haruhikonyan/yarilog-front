<template>
  <section class="container">
    <div>
      <h1 class="title">
        ログインページ
      </h1>
      <form>
        <div class="form-group">
          <label>ユーザ名/メールアドレス</label>
          <input v-model="loginObject.loginId" type="text" />
        </div>
        <div class="form-group">
          <label>パスワード</label>
          <input id="password" v-model="loginObject.password" type="password" />
        </div>
      </form>
      <button type="submit" class="btn btn-primary" @click="postLogin">ログイン</button>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { User } from '~/models/User';
import Cookie from 'js-cookie';
import { LoginObject } from '~/models/LoginObject';

@Component({
  middleware: 'notAuthenticated'
})
export default class Index extends Vue {
  loginObject: LoginObject = new LoginObject();
  async postLogin() {
    const token = await this.$api.login({
      loginId: this.loginObject.loginId,
      password: this.loginObject.password
    });
    const auth = {
      accessToken: token
    };
    this.$store.commit('setAuth', auth); // mutating to store for client rendering
    Cookie.set('auth', auth); // saving token in cookie for server rendering
    this.$axios.setToken(token, 'Bearer');
    this.$router.push('/');
  }
}
</script>
