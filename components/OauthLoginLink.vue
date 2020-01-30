<template>
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
