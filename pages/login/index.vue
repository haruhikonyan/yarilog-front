<template>
  <section class="container">
    <h1 class="text-center mb-4">
      無料会員登録/ログイン
    </h1>
    <div class="row no-gutters">
      <div class="col-6">
        <b-button squared block size="lg" class="border" variant="white" @click="authTwitter">
          <font-awesome-layers>
            <font-awesome-icon :icon="['fab', 'twitter']" style="color: #55acee" />
          </font-awesome-layers>
          Twitter
        </b-button>
      </div>
      <div class="col-6">
        <b-button squared block size="lg" class="border" variant="white" @click="authFacebook">
          <font-awesome-layers>
            <font-awesome-icon :icon="['fab', 'facebook']" style="color: #3b5998" />
          </font-awesome-layers>
          Facebook
        </b-button>
      </div>
      <div class="col-6">
        <b-button squared block size="lg" class="border" variant="white" @click="authGoogle">
          <font-awesome-layers>
            <font-awesome-icon :icon="['fab', 'google']" />
          </font-awesome-layers>
          Google
        </b-button>
        <svg style="width:0;height:0;">
          <defs>
            <linearGradient id="grad1" x1="0%" y1="30%" x2="50%" y2="0%">
              <stop offset="50%" stop-color="#34a853" />
              <stop offset="50%" stop-color="#4285f4" />
            </linearGradient>
            <linearGradient id="grad2" x1="0%" y1="30%" x2="50%" y2="0%">
              <stop offset="50%" stop-color="#fbbc05" />
              <stop offset="50%" stop-color="#ea4335" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div class="col-6">
        <b-button squared block size="lg" class="border" variant="white" @click="authLine">
          <font-awesome-layers>
            <font-awesome-icon :icon="['fab', 'line']" style="color: #00B900" />
          </font-awesome-layers>
          LINE
        </b-button>
      </div>
    </div>
    <b-form class="mt-5" @submit.prevent="postLogin">
      <b-form-group label-size="sm" label="ユーザ名/メールアドレス">
        <b-form-input v-model="loginObject.loginId" size="sm" required></b-form-input>
      </b-form-group>
      <b-form-group label-size="sm" label="パスワード">
        <b-form-input v-model="loginObject.password" size="sm" type="password" required></b-form-input>
      </b-form-group>

      <b-button block type="submit" variant="primary">ログイン</b-button>
    </b-form>
    <b-alert v-if="loginErrorMessage" show variant="danger">{{ loginErrorMessage }}</b-alert>
    <small><nuxt-link :to="createUserLocation">ユーザ新規登録</nuxt-link></small>
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
      this.$router.push(this.callbackPath || '/mypage');
      this.$ga.event('登録', '新規ユーザ作成', 'owned', 1);
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
<style lang="scss">
// see: https://stackoverflow.com/questions/52578726/fontawesome-5-multi-color-icon
.fa-google path {
  fill: url(#grad1);
}
.fa-google + .fa-google path {
  fill: url(#grad2);
}
.icon {
  display: inline-block;
  position: relative;
}
.fa-google + .fa-google {
  position: absolute;
  left: 0;
  top: 0;
  clip-path: polygon(0% 0%, 120% 0%, 0% 75%);
}
</style>
