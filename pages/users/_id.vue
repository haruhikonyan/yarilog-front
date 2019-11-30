<template>
  <section class="container">
    <div>
      <h1>{{ user.nickname }} さん</h1>
      <p>
        自己紹介
      </p>
      <pre>{{ user.description }}</pre>

      <PlayingLogCard v-for="playingLog in playingLogs" :key="playingLog.id" :playing-log="playingLog" />
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { User } from '../../models/User';
import PlayingLogCard from '../../components/PlayingLogCard.vue';

@Component({
  components: {
    PlayingLogCard
  },
  async asyncData({ app, params }) {
    const user = await app.$api.getUser(params.id);
    const playingLogs = await app.$api.getPlayingLogsByUser(params.id, 0, 0);
    return { user, playingLogs };
  },
  head(this: Index) {
    return {
      title: `${this.user!.nickname} さんの演奏記録 - みゅーぐ`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: `${this.user!.nickname} さんの演奏記録 ${this.user!.description}`
        }
      ]
    };
  }
})
export default class Index extends Vue {
  user!: User;
}
</script>
