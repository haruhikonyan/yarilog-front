<template>
  <section class="container">
    <h1>{{ user.nickname }} さん</h1>
    <adsbygoogle :ad-slot="topAdId" ad-format="horizontal" />
    <p>
      自己紹介
    </p>
    <pre class="yrl-pre-wrap">{{ user.description }}</pre>
    <div class="row">
      <div v-for="playingLog in playingLogs" :key="playingLog.id" class="mb-2 col-md-6">
        <PlayingLogCard :playing-log="playingLog" />
      </div>
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
  async asyncData({ app, params, env }) {
    const user = await app.$api.getUser(params.id);
    const playingLogs = await app.$api.getPlayingLogsByUser(params.id, 0, 0);
    return { user, playingLogs, topAdId: env.topAdId };
  },
  head(this: Index) {
    const title = `${this.user!.nickname} さんの演奏記録 - みゅーぐ`;
    const description = `${this.user!.nickname} さんの演奏記録 ${this.user!.description}`;
    return {
      title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: description
        },
        { hid: 'og:title', property: 'og:title', content: title },
        {
          hid: 'og:description',
          property: 'og:description',
          content: description
        }
      ]
    };
  }
})
export default class Index extends Vue {
  user!: User;
}
</script>
