<template>
  <!-- TODO ブラッシュアップ -->
  <section>ログイン中です<b-spinner label="Spinning" /></section>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Cookie from 'js-cookie';
import { LoginResultObject } from '../../models/LoginResultObject';

@Component({
  middleware: 'notAuthenticated',
  fetch({ query, store, app, redirect }) {
    // パラメータが足りなければログインページへ
    if (!query.token || !query.userId || !query.consentTos) {
      redirect('/login');
    }
    const auth: LoginResultObject = {
      token: query.token as string,
      userId: query.userId as string,
      consentTos: query.consentTos === 'true'
    };
    store.commit('setAuth', auth);
    app.$axios.setToken(query.token, 'Bearer');
    app.$api.updateLatestLoginAt();
  }
})
export default class Index extends Vue {
  beforeCreate() {
    Cookie.set('token', this.$store.state.auth.token);
  }
  beforeMount() {
    // 新規登録であればアナリティクスへイベントを送る
    const newUserProvider = this.$route.query.newUserProvider;
    if (newUserProvider) {
      this.$ga.event('新規ユーザ登録', 'create', newUserProvider, 1);
    }
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
