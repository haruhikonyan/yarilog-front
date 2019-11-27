<template>
  <div class="yrl-navber-padding">
    <div class="mb-3">
      <b-navbar toggleable="lg" type="dark" variant="primary" fixed="top" class="py-0">
        <b-navbar-brand to="/" class="py-0">
          <img src="~/assets/logo.png" class="yrl-logo" alt="みゅーぐ" />
        </b-navbar-brand>

        <b-navbar-toggle v-if="$store.state.auth" target="nav-collapse"></b-navbar-toggle>

        <b-collapse v-if="$store.state.auth" id="nav-collapse" is-nav>
          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <b-dropdown-item to="/mypage">マイページ</b-dropdown-item>
            <b-dropdown-item to="/playing-logs/new">演奏記録をつける</b-dropdown-item>
            <b-dropdown-item @click="logout">ログアウト</b-dropdown-item>
          </b-navbar-nav>
        </b-collapse>
        <b-navbar-brand v-if="!$store.state.auth" class="ml-auto" to="/login">ログイン</b-navbar-brand>
      </b-navbar>
    </div>
    <nuxt />
    <div class="text-center">
      <hr />
      <div>
        <nuxt-link to="/terms/tos">利用規約</nuxt-link>
        <nuxt-link to="/terms/privacy-policy">プライバシーポリシー</nuxt-link>
      </div>
      <div>
        <a href="https://twitter.com/musig_net" target="_blank" class="d-block">
          <font-awesome-icon icon="external-link-alt" />
          公式twitter
        </a>
      </div>
      <div class="mt-1">
        <div>問い合わせはこちらまで</div>
        <div>info.musig☆gmail.com</div>
        <small>
          「☆」を半角の「@」に変更してご利用ください
        </small>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Cookie from 'js-cookie';

@Component({
  components: {},
  head: {
    title: 'みゅーぐ',
    meta: [
      {
        hid: 'description',
        name: 'description',
        content:
          '自分が演奏した曲を演奏記録という形で記録のできるサイトです。他人が書いた演奏記録を検索して自分の演奏や選曲の参考にしたり、自分の演奏した履歴を忘れないように記録することができます。'
      }
    ]
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
}
</script>
<style lang="scss" scoped>
.yrl-navber-padding {
  padding-top: 48px;
}
.yrl-logo {
  height: 40px;
}
</style>
