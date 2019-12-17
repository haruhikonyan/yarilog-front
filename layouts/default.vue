<template>
  <div class="yrl-navbar-padding">
    <div class="mb-3">
      <b-navbar toggleable="lg" type="dark" variant="primary" fixed="top" class="py-0">
        <b-navbar-brand to="/" class="py-1">
          <img src="~/assets/logo.png" class="yrl-logo" alt="みゅーぐ" />
        </b-navbar-brand>

        <b-navbar-toggle v-if="$store.state.auth" target="nav-collapse"></b-navbar-toggle>

        <b-collapse v-if="$store.state.auth" id="nav-collapse" is-nav>
          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <b-dropdown-item to="/mypage"><span class="text-white">マイページ</span></b-dropdown-item>
            <b-dropdown-item to="/playing-logs/new"><span class="text-white">演奏記録をつける</span></b-dropdown-item>
            <b-dropdown-item @click="logout"><span class="text-white">ログアウト</span></b-dropdown-item>
          </b-navbar-nav>
        </b-collapse>
        <b-navbar-brand v-if="!$store.state.auth" class="ml-auto" to="/login">ログイン</b-navbar-brand>
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
<style lang="scss" scoped>
.yrl-navbar-padding {
  padding-top: 48px;
}
.yrl-logo {
  height: 40px;
}
</style>
