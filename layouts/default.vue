<template>
  <div class="yrl-navbar-padding">
    <div class="mb-3">
      <b-navbar toggleable type="dark" variant="primary" fixed="top" class="py-0">
        <b-navbar-brand to="/" class="py-1 mr-auto">
          <img src="~/assets/logo.png" class="yrl-logo" alt="みゅーぐ" />
        </b-navbar-brand>
        <nuxt-link to="/tunes" class="text-white d-flex align-items-center mr-4">
          <font-awesome-icon icon="search" size="2x" />
        </nuxt-link>
        <nuxt-link v-if="$store.state.auth" to="/mypage" class="text-white d-flex align-items-center mr-3">
          <font-awesome-icon icon="user" size="2x" />
        </nuxt-link>
        <nuxt-link v-else to="/login" class="text-white d-flex align-items-center mr-3">
          <font-awesome-icon icon="lock" size="2x" />
        </nuxt-link>
        <no-ssr>
          <!-- see: https://github.com/mbj36/vue-burger-menu/issues/67 -->
          <Slide
            right
            width="300"
            :burger-icon="false"
            :cross-icon="false"
            :is-open="slideIsOpen"
            no-overlay
            @openMenu="openSlide"
            @closeMenu="closeSlide"
          >
            <div class="yrl-slide-close-btn bg-primary d-flex align-items-center">
              <div class="ml-auto mr-2">
                <font-awesome-icon icon="times" size="2x" class="text-white" @click="toggleSlide" />
              </div>
            </div>
            <div class="border-bottom px-4">
              <b-button v-if="$store.state.auth" variant="info" block class="yrl-nav-btn-text" to="/playing-logs/new">
                演奏記録を書く
              </b-button>
              <div v-else>
                <p class="my-2 yrl-login-info">演奏記録の作成を行うにはユーザ登録および、ログインが必要です。</p>
                <b-button variant="outline-primary" block class="yrl-nav-btn-text mb-3" to="/login">
                  ログイン
                </b-button>
                <b-button variant="info" block class="yrl-nav-btn-text" to="/users/new">
                  無料ユーザ登録
                </b-button>
              </div>
            </div>
            <div class="text-primary yrl-slide-menu-content p-0">
              <nuxt-link
                v-if="$store.state.auth"
                to="/mypage"
                class="border-bottom d-flex align-items-center px-4 py-1"
              >
                <font-awesome-icon icon="user" size="lg" />
                <span class="ml-2">マイページ</span>
                <font-awesome-icon icon="angle-right" size="lg" class="ml-auto" />
              </nuxt-link>
              <nuxt-link to="/tunes" class="border-bottom d-flex align-items-center px-4 py-1">
                <font-awesome-icon icon="search" size="lg" />
                <span class="ml-2">演奏記録を探す</span>
                <font-awesome-icon icon="angle-right" size="lg" class="ml-auto" />
              </nuxt-link>
              <nuxt-link to="/about" class="border-bottom d-flex align-items-center px-4 py-1">
                <font-awesome-icon icon="question-circle" size="lg" />
                <span class="ml-2">みゅーぐについて</span>
                <font-awesome-icon icon="angle-right" size="lg" class="ml-auto" />
              </nuxt-link>
              <nuxt-link
                v-if="$store.state.auth"
                to="/settings"
                class="border-bottom d-flex align-items-center px-4 py-1"
              >
                <font-awesome-icon icon="cog" size="lg" />
                <span class="ml-2">基本情報設定</span>
                <font-awesome-icon icon="angle-right" size="lg" class="ml-auto" />
              </nuxt-link>
              <nuxt-link to="/inquiry" class="border-bottom d-flex align-items-center px-4 py-1">
                <font-awesome-icon icon="envelope" size="lg" />
                <span class="ml-2">お問い合わせ</span>
                <font-awesome-icon icon="angle-right" size="lg" class="ml-auto" />
              </nuxt-link>
            </div>
            <div v-if="$store.state.auth" class="px-5 pt-4">
              <b-button variant="warning" block class="yrl-nav-btn-text" to="/playing-logs/new" @click="logout">
                ログアウト
              </b-button>
            </div>
          </Slide>
          <!-- 自前で影をつける 
          https://github.com/mbj36/vue-burger-menu/pull/83 マージまち-->
          <div v-if="slideIsOpen" class="yrl-bm-overlay" />
        </no-ssr>
        <button class="navbar-toggler" @click="toggleSlide"><span class="navbar-toggler-icon"></span></button>
      </b-navbar>
    </div>
    <nuxt />
    <adsbygoogle :ad-slot="bottomAdId" ad-format="horizontal" class="mt-5 text-center" />
    <div class="text-center">
      <hr />
      <ShareIcons :share-text="shareText" :share-path="sharePath" />
      <div>
        <nuxt-link to="/terms/tos" class="mr-1">利用規約</nuxt-link>
        <nuxt-link to="/terms/privacy-policy" class="mr-1">プライバシーポリシー</nuxt-link>
        <nuxt-link to="/inquiry">お問い合わせ</nuxt-link>
      </div>
      <a href="https://twitter.com/musig_net" target="_blank">
        <font-awesome-icon icon="external-link-alt" />
        公式twitter
      </a>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Cookie from 'js-cookie';
import ShareIcons from '~/components/ShareIcons.vue';

@Component({
  components: {
    ShareIcons
  }
})
export default class Index extends Vue {
  slideIsOpen: boolean = false;

  openSlide() {
    this.slideIsOpen = true;
  }
  closeSlide() {
    this.slideIsOpen = false;
  }
  toggleSlide(e) {
    e.preventDefault();
    e.stopPropagation();
    this.slideIsOpen = !this.slideIsOpen;
  }
  // TODO 共通化
  logout() {
    Cookie.remove('token');
    this.$store.commit('setAuth', null);
    this.$axios.setToken(false);
    this.$router.push('/');
  }
  // TODO ブラッシュアップ
  get shareText(): string {
    return '音楽を奏でるすべての人へ 演奏記録の共有サイト みゅーぐ';
  }
  get sharePath(): string {
    return process.env.frontUrl!;
  }
  get bottomAdId(): string {
    return process.env.bottomAdId!;
  }
}
</script>
<style lang="scss">
.yrl-navbar-padding {
  padding-top: 48px;
}
.yrl-logo {
  height: 40px;
}
.yrl-bm-overlay {
  position: absolute;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.3);
  // ドロワーが1000
  z-index: 999;
}
.yrl-slide-close-btn {
  height: 48px;
}
.bm-menu {
  background-color: white !important;
  padding-top: 0 !important;
  .bm-item-list {
    margin-left: 0;
    color: black;
  }
  .bm-item-list > * {
    display: inherit;
  }
}
.yrl-nav-btn-text {
  font-size: 24px;
}
.yrl-login-info {
  font-size: 12px;
}
</style>
