<template>
  <div class="container">
    <h1>Sign in to access the secret page</h1>
    <div>
      <label for="email">
        <input id="email" v-model="loginId" type="text" />
      </label>
      <label for="password">
        <input id="password" v-model="password" type="password" />
      </label>
      <button @click="postLogin">
        login
      </button>
      <p>The credentials are not verified for the example purpose.</p>
      <nuxt-link to="/">トップへ戻る</nuxt-link>
    </div>
  </div>
</template>

<script>
const Cookie = process.client ? require('js-cookie') : undefined;

export default {
  middleware: 'notAuthenticated',
  methods: {
    async postLogin() {
      const token = await this.$api.login({
        loginId: this.loginId,
        password: this.password
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
};
</script>
