<template>
  <section class="container">
    <div>
      <h1>
        利用規約
      </h1>
      <pre class="yrl-pre-wrap">
        {{ tos }}
      </pre>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {},
  async asyncData({ app }) {
    const tos = await app.$api.getLatestTos();
    return { tos };
  }
})
export default class Index extends Vue {}
</script>
