<template>
  <section class="container">
    <div>
      <h4 class="mb-0">{{ tune.title }}</h4>
      <small class="text-muted mb-1">{{ tune.composer.displayName }}作曲</small>
    </div>
    <!-- TODO 同じ曲の演奏ログや同じ人の演奏ログを出す -->
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Tune } from '../../../models/Tune';

@Component({
  components: {},
  async asyncData({ app, params }) {
    const tune = await app.$api.getTune(params.id);
    return { tune };
  },
  head(this: Index) {
    return {
      title: `${this.tune.title} ${this.tune.composer.fullName}作曲 - 演りログ`,
      meta: [{ hid: 'description', name: 'description', content: `${this.tune.description}` }]
    };
  }
})
export default class Index extends Vue {
  tune!: Tune;
}
</script>
