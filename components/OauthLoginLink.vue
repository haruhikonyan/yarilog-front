<template>
  <section>
    <div class="row">
      <div class="col-12 col-md-6 mb-2">
        <b-button block class="rounded text-white px-5" style="background-color: #3b5998" @click="authFacebook">
          <div class="d-flex align-items-center">
            <font-awesome-icon class="mr-3 ml-md-5" size="2x" :icon="['fab', 'facebook']" />
            <h5 class="mb-0">{{ `Facebookで${isRegister ? '登録' : 'ログイン'}` }}</h5>
          </div>
        </b-button>
      </div>
      <div class="col-12 col-md-6 mb-2">
        <b-button block class="rounded bg-white px-5" @click="authGoogle">
          <div class="d-flex align-items-center">
            <font-awesome-icon class="mr-3 ml-md-5" size="2x" :icon="['fab', 'google']" />
            <h5 class="mb-0">{{ `Googleで${isRegister ? '登録' : 'ログイン'}` }}</h5>
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
        </b-button>
      </div>
      <div class="col-12 col-md-6 mb-2">
        <b-button block class="rounded text-white px-5" style="background-color: #55acee" @click="authTwitter">
          <div class="d-flex align-items-center">
            <font-awesome-icon class="mr-3 ml-md-5" size="2x" :icon="['fab', 'twitter']" />
            <h5 class="mb-0">{{ `Twitterで${isRegister ? '登録' : 'ログイン'}` }}</h5>
          </div>
        </b-button>
      </div>
      <div class="col-12 col-md-6 mb-2">
        <b-button block class="rounded text-white px-5" style="background-color: #00B900" @click="authLine">
          <div class="d-flex align-items-center">
            <font-awesome-icon class="mr-3 ml-md-5" size="2x" :icon="['fab', 'line']" />
            <h5 class="mb-0">{{ `LINEで${isRegister ? '登録' : 'ログイン'}` }}</h5>
          </div>
        </b-button>
      </div>
    </div>
    <small>※許可なくSNSに投稿されることはありません。</small>
  </section>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({})
export default class OauthLoginLink extends Vue {
  @Prop({ type: Boolean, default: false })
  isRegister!: Boolean;
  @Prop({ type: String })
  callbackPath: string | undefined;

  authTwitter() {
    this.saveCallbackPathToSessionStorage();
    location.href = `${process.env.baseBrouserApiUrl}/auth/twitter`;
  }
  authFacebook() {
    this.saveCallbackPathToSessionStorage();
    location.href = `${process.env.baseBrouserApiUrl}/auth/facebook`;
  }
  authGoogle() {
    this.saveCallbackPathToSessionStorage();
    location.href = `${process.env.baseBrouserApiUrl}/auth/google`;
  }
  authLine() {
    this.saveCallbackPathToSessionStorage();
    location.href = `${process.env.baseBrouserApiUrl}/auth/line`;
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
