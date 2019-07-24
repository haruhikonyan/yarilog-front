<template>
  <div>
    <div>
      <b-navbar toggleable="lg" type="dark" variant="primary">
        <b-navbar-brand href="/">yarilog</b-navbar-brand>

        <b-navbar-toggle v-if="$store.state.auth" target="nav-collapse"></b-navbar-toggle>

        <b-collapse v-if="$store.state.auth" id="nav-collapse" is-nav>
          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <b-dropdown-item href="/mypage">マイページ</b-dropdown-item>
            <b-dropdown-item href="/playing-logs/new">演奏記録をつける</b-dropdown-item>
            <b-dropdown-item @click="logout">ログアウト</b-dropdown-item>
          </b-navbar-nav>
        </b-collapse>
        <b-navbar-brand v-if="!$store.state.auth" class="ml-auto" href="/login">ログイン</b-navbar-brand>
      </b-navbar>
    </div>
    <nuxt />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Cookie from 'js-cookie';

@Component({
  components: {}
})
export default class Index extends Vue {
  logout() {
    Cookie.remove('auth');
    this.$store.commit('setAuth', null);
    this.$axios.setToken(false);
  }
}
</script>
