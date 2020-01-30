<template>
  <section class="container">
    <h1 class="text-center mb-4">
      ユーザーログイン
    </h1>
    <OauthLoginLink :is-register="false" :callback-path="callbackPath" />
    <h5 class="yrl-between-string-separator my-4 text-primary font-weight-bold">OR</h5>
    <b-form @submit.prevent="postLogin">
      <b-form-group label="ユーザ名/メールアドレス">
        <b-form-input v-model="loginObject.loginId" required></b-form-input>
      </b-form-group>
      <b-form-group label="パスワード">
        <b-form-input v-model="loginObject.password" type="password" required></b-form-input>
      </b-form-group>

      <b-button block type="submit" variant="primary">ログイン</b-button>
    </b-form>
    <b-alert v-if="loginErrorMessage" show variant="danger">{{ loginErrorMessage }}</b-alert>
    <h4 class="text-center mt-4">
      <nuxt-link :to="createUserLocation">
        初めての方はこちら<font-awesome-icon icon="angle-right" size="lg" class="ml-auto"
      /></nuxt-link>
    </h4>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Cookie from 'js-cookie';
import { LoginObject } from '~/models/LoginObject';
import OauthLoginLink from '~/components/OauthLoginLink.vue';

@Component({
  components: {
    OauthLoginLink
  },
  middleware: 'notAuthenticated',
  asyncData({ query }) {
    return {
      callbackPath: query.callbackPath
    };
  }
})
export default class Index extends Vue {
  loginObject: LoginObject = new LoginObject();
  loginErrorMessage: string | null = null;
  callbackPath: string | undefined;

  /**
   * ユーザ新規作成(own)の Location を生成する
   */
  get createUserLocation() {
    // collbackPath があればつける
    return { path: '/users/new', query: { callbackPath: this.callbackPath } };
  }
  async postLogin() {
    // TODO 全部 try でかこうのも let 使わなきゃいけないのもどっちも嫌い
    try {
      const loginReultObject = await this.$api.login({
        loginId: this.loginObject.loginId,
        password: this.loginObject.password
      });
      this.$store.commit('setAuth', loginReultObject); // mutating to store for client rendering
      Cookie.set('token', loginReultObject.token); // saving token in cookie for server rendering
      this.$axios.setToken(loginReultObject.token, 'Bearer');
      this.$api.updateLatestLoginAt();
      this.$router.push(this.callbackPath || '/mypage');
    } catch (e) {
      if (e.response.status === 401) {
        this.loginErrorMessage = 'ユーザ名/メールアドレス もしくは パスワードが間違っています';
      }
    }
  }
}
</script>
