<template>
  <section class="container">
    <div>
      <h1>
        プライバシーポリシー
      </h1>
      <pre>
        {{ privacyPolicy }}
      </pre>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {},
  async asyncData({ app }) {
    const privacyPolicy = await app.$api.getPrivacyPolicy();
    return { privacyPolicy };
  }
})
export default class Index extends Vue {}
</script>
