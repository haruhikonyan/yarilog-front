<template>
  <section class="container">
    <div>
      <h1>
        ログインページ
      </h1>
      <b-form @submit.prevent="postLogin">
        <b-form-group label="ユーザ名/メールアドレス">
          <b-form-input v-model="loginObject.loginId" required></b-form-input>
        </b-form-group>
        <b-form-group label="パスワード">
          <b-form-input v-model="loginObject.password" type="password" required></b-form-input>
        </b-form-group>

        <b-button block type="submit" variant="primary">ログイン</b-button>
        <small><nuxt-link to="/users/new">ユーザ新規登録</nuxt-link></small>
      </b-form>
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
    this.$router.push('/mypage');
  }
}
</script>
