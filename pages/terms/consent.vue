<template>
  <section class="container">
    <div>
      <h1>
        規約に同意してください
      </h1>
      <p>利用規約とプライバシーポリシーに目を通し、同意するにチェックを入れ、同意するボタンを押してください</p>
      <a href="tos" target="_blank" class="d-block">
        <font-awesome-icon icon="external-link-alt" />
        利用規約
      </a>
      <a href="privacy-policy" target="_blank" class="d-block">
        <font-awesome-icon icon="external-link-alt" />
        プライバシーポリシー
      </a>
      <b-form inline @submit.prevent="submitHandler">
        <b-form-checkbox v-model="isConsentable">同意する</b-form-checkbox>
        <b-button block type="submit" variant="primary" :disabled="!isConsentable">同意する</b-button>
        <b-button block variant="secondary" @click="logout">同意しない</b-button>
      </b-form>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Cookie from 'js-cookie';
import { LoginResultObject } from '../../models/LoginResultObject';

@Component({
  components: {},
  async asyncData({ app }) {
    const latestTermsId = await app.$api.getLatestTermsId();
    return { latestTermsId };
  },
  middleware({ store, redirect }) {
    const auth: LoginResultObject = store.state.auth;
    // ログインしてないか、すでに同意済みであればトップに飛ばす
    if (!auth || auth.consentTos) {
      return redirect('/');
    }
  }
})
export default class Index extends Vue {
  isConsentable: boolean = false;
  latestTermsId!: number;
  async submitHandler() {
    await this.$api.consentTerms(this.latestTermsId);
    // 最新の状況を取得する
    const auth = await this.$api.getAuthObject();
    this.$store.commit('setAuth', auth);
    const redirectPath = this.$route.query.callbackPath || '/mypage';
    this.$router.push(redirectPath as string);
  }
  // TODO 共通化
  logout() {
    Cookie.remove('token');
    this.$store.commit('setAuth', null);
    this.$axios.setToken(false);
    this.$router.push('/');
  }
}
</script>
