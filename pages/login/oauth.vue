<template>
  <!-- TODO ブラッシュアップ -->
  <section>ログイン中です<b-spinner label="Spinning" /></section>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Cookie from 'js-cookie';

@Component({
  middleware: 'notAuthenticated',
  fetch({ query, store, app, redirect }) {
    // パラメータが足りなければログインページへ
    if (!query.token || !query.userId) {
      redirect('/login');
    }
    const auth = {
      accessToken: query.token,
      userId: query.userId
    };
    store.commit('setAuth', auth);
    app.$axios.setToken(query.token, 'Bearer');
  }
})
export default class Index extends Vue {
  beforeCreate() {
    Cookie.set('auth', this.$store.state.auth);
  }
  beforeMount() {
    // beforeMount でやるのがよいかわからない(sessionStorageが使えるのがこのタイミング)
    // callbackPath があればそっちへリダイレクトする
    const callbackPath = sessionStorage.getItem('callbackPath');
    if (callbackPath) {
      sessionStorage.removeItem('callbackPath');
    }
    this.$router.push(callbackPath || '/mypage');
  }
}
</script>
