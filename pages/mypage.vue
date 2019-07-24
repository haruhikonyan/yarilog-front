<template>
  <section class="container">
    <div>
      <h1 class="title">
        マイページ
      </h1>
      <p>ユーザ名：{{ user.username }}</p>
      <p>メールアドレス：{{ user.mailAddress }}</p>
      <p>ニックネーム：{{ user.nickname }}</p>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { User } from '../models/User';

@Component({
  components: {},
  middleware: 'authenticated',
  async asyncData({ app }) {
    const data = await app.$api.me();
    return { user: data };
  }
})
export default class Index extends Vue {
  user: User | null = null;
}
</script>
