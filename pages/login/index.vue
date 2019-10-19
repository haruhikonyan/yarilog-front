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
      </b-form>
      <b-alert v-if="loginErrorMessage" show variant="danger">{{ loginErrorMessage }}</b-alert>
      <small><nuxt-link to="/users/new">ユーザ新規登録</nuxt-link></small>
    </div>
    <b-button block variant="secondary" @click="authTwitter">
      twitterでログイン
    </b-button>
    <b-button block variant="secondary" @click="authFacebook">
      facebookでログイン
    </b-button>
    <b-button block variant="secondary" @click="authGoogle">
      googleでログイン
    </b-button>
    <b-button block variant="secondary" @click="authLine">
      lineでログイン
    </b-button>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Cookie from 'js-cookie';
import { LoginObject } from '~/models/LoginObject';

@Component({
  middleware: 'notAuthenticated',
  asyncData({ env, query }) {
    return {
      twitterLoginUrl: `${env.baseBrouserApiUrl}/auth/twitter`,
      facebookLoginUrl: `${env.baseBrouserApiUrl}/auth/facebook`,
      googleLoginUrl: `${env.baseBrouserApiUrl}/auth/google`,
      lineLoginUrl: `${env.baseBrouserApiUrl}/auth/line`,
      callbackPath: query.callbackPath
    };
  }
})
export default class Index extends Vue {
  loginObject: LoginObject = new LoginObject();
  loginErrorMessage: string | null = null;
  callbackPath: string | undefined;
  twitterLoginUrl!: string;
  facebookLoginUrl!: string;
  googleLoginUrl!: string;
  lineLoginUrl!: string;
  async postLogin() {
    // TODO 全部 try でかこうのも let 使わなきゃいけないのもどっちも嫌い
    try {
      const loginReultObject = await this.$api.login({
        loginId: this.loginObject.loginId,
        password: this.loginObject.password
      });
      this.$store.commit('setAuth', loginReultObject); // mutating to store for client rendering
      Cookie.set('auth', loginReultObject); // saving token in cookie for server rendering
      this.$axios.setToken(loginReultObject.token, 'Bearer');
      this.$router.push(this.callbackPath || '/mypage');
    } catch (e) {
      if (e.response.status === 401) {
        this.loginErrorMessage = 'ユーザ名/メールアドレス もしくは パスワードが間違っています';
      }
    }
  }
  authTwitter() {
    this.saveCallbackPathToSessionStorage();
    location.href = this.twitterLoginUrl;
  }
  authFacebook() {
    this.saveCallbackPathToSessionStorage();
    location.href = this.facebookLoginUrl;
  }
  authGoogle() {
    this.saveCallbackPathToSessionStorage();
    location.href = this.googleLoginUrl;
  }
  authLine() {
    this.saveCallbackPathToSessionStorage();
    location.href = this.lineLoginUrl;
  }
  private saveCallbackPathToSessionStorage() {
    if (this.callbackPath) {
      sessionStorage.setItem('callbackPath', this.callbackPath);
    }
  }
}
</script>
