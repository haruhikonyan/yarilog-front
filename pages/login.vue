<template>
  <div class="container">
    <h1>Sign in to access the secret page</h1>
    <div>
      <label for="email">
        <input id="email" v-model="loginObject.loginId" type="text" />
      </label>
      <label for="password">
        <input id="password" v-model="loginObject.password" type="password" />
      </label>
      <button @click="postLogin">
        login
      </button>
      <p>The credentials are not verified for the example purpose.</p>
      <nuxt-link to="/">トップへ戻る</nuxt-link>
    </div>
  </div>
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
