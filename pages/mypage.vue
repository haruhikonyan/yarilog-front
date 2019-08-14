<template>
  <section class="container">
    <div>
      <h1>
        マイページ
      </h1>
      <p>ユーザ名：{{ user.username }}</p>
      <p>メールアドレス：{{ user.mailAddress }}</p>
      <p>ニックネーム：{{ user.nickname }}</p>

      <b-button to="/playing-logs/new" variant="primary" class="mb-3">演奏ログをつける</b-button>
      <div>
        <h3>{{ user.nickname }}の演奏記録</h3>
      </div>
      <PlayingLogCard v-for="playingLog in playingLogs" :key="playingLog.id" :playing-log="playingLog" />
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { User } from '../models/User';
import PlayingLogCard from '../components/PlayingLogCard.vue';
import { PlayingLog } from '../models/PlayingLog';

@Component({
  components: {
    PlayingLogCard
  },
  middleware: 'authenticated',
  async asyncData({ app }) {
    const user = await app.$api.me();
    return { user };
  }
})
export default class Index extends Vue {
  user!: User;
  playingLogs: PlayingLog[] = [];

  public async created() {
    // 全件表示
    this.playingLogs = await this.$api.getPlayingLogsByUser(this.user.id!, 0, 0);
  }
}
</script>
