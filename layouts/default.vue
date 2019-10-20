<template>
  <div>
    <div class="mb-3">
      <b-navbar toggleable="lg" type="dark" variant="primary">
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
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Cookie from 'js-cookie';

@Component({
  components: {},
  head: {
    title: '演りログ',
    meta: [{ hid: 'description', name: 'description', content: '演奏した曲のレビューサイト' }]
  }
})
export default class Index extends Vue {
  logout() {
    Cookie.remove('token');
    this.$store.commit('setAuth', null);
    this.$axios.setToken(false);
    this.$router.push('/');
  }
}
</script>
<style lang="scss" scoped>
.yrl-logo {
  height: 40px;
}
</style>
