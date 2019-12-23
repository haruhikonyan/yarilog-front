<template>
  <section class="container">
    <Breadcrumb :playing-log="playingLog" class="mb-0" />
    <adsbygoogle :ad-slot="topAdId" ad-format="horizontal" />
    <nuxt-link v-if="showEditButton" :to="`/playing-logs/${playingLog.id}/edit`">編集する</nuxt-link>
    <div class="d-flex">
      <!-- TODO ジャンルがたくさんついた時のレイアウト -->
      <small class="text-muted align-self-end">
        {{ playingLog.playstyle.name }}
        <GenreBadge
          v-for="genre in playingLog.tune.genres"
          :key="genre.id"
          :genre="genre"
          :is-linkable="true"
          class="mr-1"
        />
      </small>
      <ShareIcons :share-text="shareText" :share-path="sharePath" class="ml-auto" />
    </div>
    <h4 class="mb-0">
      <nuxt-link :to="`/tunes/${playingLog.tune.id}`">{{ playingLog.tune.title }}</nuxt-link>
    </h4>
    <small class="text-muted mb-1">
      {{ playingLog.tune.composer.displayName }}作曲{{ playingLog.arranger | displayArranger
      }}{{ playingLog.edition | displayEdition }}
    </small>
    <h5 class="text-center mb-0">
      面白さ: {{ playingLog.interesting || '-' }} 体力: {{ playingLog.physicality || '-' }} 難易度:
      {{ playingLog.difficulty || '-' }}
    </h5>
    <div class="text-muted text-center mb-3">
      {{ playingLog.instrument.name }} {{ playingLog.position }}
      <b-badge>{{ playingLog.playerLevel }}</b-badge>
    </div>
    <b-card v-if="playingLog.impressionOfInteresting" class="mb-2" title="面白かったところ">
      <b-card-text>
        <!-- TODO pre タグで文字を入れるとなんかエラーが出る -->
        <pre class="yrl-pre-wrap">{{ playingLog.impressionOfInteresting }}</pre>
      </b-card-text>
    </b-card>
    <b-card v-if="playingLog.impressionOfDifficulty" class="mb-2" title="難しかったところ">
      <b-card-text>
        <pre class="yrl-pre-wrap mb-0">{{ playingLog.impressionOfDifficulty }}</pre>
      </b-card-text>
    </b-card>
    <b-card v-if="playingLog.reflectionForNext" class="mb-2">
      <b-card-title>
        次回への反省やアドバイス<span class="d-none d-sm-inline">、</span><br class="d-sm-none" />譜面情報
      </b-card-title>
      <b-card-text>
        <pre class="yrl-pre-wrap mb-0">{{ playingLog.reflectionForNext }}</pre>
      </b-card-text>
    </b-card>
    <b-card v-if="playingLog.otherPartInpression" class="mb-2" title="全体の感想">
      <b-card-text>
        <pre class="yrl-pre-wrap mb-0">{{ playingLog.otherPartInpression }}</pre>
      </b-card-text>
    </b-card>
    <b-card v-if="playingLog.secretMemo" class="mb-2" title="非公開の自分用メモ" sub-title="自分にしか見えません">
      <b-card-text>
        <pre class="yrl-pre-wrap mb-0">{{ playingLog.secretMemo }}</pre>
      </b-card-text>
    </b-card>
    <h4>
      <nuxt-link :to="`/users/${playingLog.user.id}`">{{ playingLog.user.nickname }}さん</nuxt-link>
    </h4>
    {{ playingLog | displayPlayInfo }}
    <nuxt-link class="small d-block text-right my-2" :to="createPlayingLogLocation">
      この曲の演奏記録を書く
    </nuxt-link>
    <!-- TODO 同じ曲の演奏記録や同じ人の演奏記録を出す -->
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import * as urljoin from 'url-join';
import { PlayingLog } from '~/models/PlayingLog';
import Breadcrumb from '~/components/Breadcrumb.vue';
import ShareIcons from '~/components/ShareIcons.vue';
import GenreBadge from '~/components/GenreBadge.vue';
@Component({
  components: {
    Breadcrumb,
    ShareIcons,
    GenreBadge
  },
  async asyncData({ app, params, route, env }) {
    const playingLog = await app.$api.getPlayingLog(params.id);
    const sharePath = urljoin(env.frontUrl, route.path);
    return { playingLog, sharePath, topAdId: env.topAdId };
  },
  head(this: Index) {
    const position = this.playingLog.position || '';
    const displayArranger = this.$options.filters!.displayArranger(this.playingLog.arranger);
    const displayEdition = this.$options.filters!.displayEdition(this.playingLog.edition);
    // なければ空文字列を入れて title に出てくるのを防ぐ
    const title = `${this.playingLog.tune.composer.displayName}作曲 ${
      this.playingLog.tune.title
    }${displayArranger}${displayEdition} ${this.playingLog.instrument.name}${position} ${
      this.playingLog.user.nickname
    }さん演奏 - みゅーぐ`;
    // TODO ブラッシュアップ
    const description =
      this.playingLog.impressionOfInteresting ||
      this.playingLog.impressionOfDifficulty ||
      this.playingLog.reflectionForNext ||
      this.playingLog.otherPartInpression ||
      title;
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
  playingLog!: PlayingLog;

  get createPlayingLogLocation() {
    return { path: '/playing-logs/new', query: { tuneId: this.playingLog.tune.id!.toString() } };
  }
  // TODO ブラッシュアップ
  get shareText(): string {
    const nickname = this.playingLog.user.nickname;
    const playInfo = this.$options.filters!.displayPlayInfo(this.playingLog);
    const composerName = this.playingLog.tune.composer.displayName;
    const tuneTitle = this.playingLog.tune.title;
    // playingLog.position が null のときは空文字列を入れてshareTextのコメントに出てくるのを防ぐ
    const position = `${this.playingLog.instrument.shortName}${this.playingLog.position || ''}`;
    return `${nickname}さんの${playInfo}された、${composerName}作曲${tuneTitle}の${position}での演奏記録`;
  }
  get showEditButton(): boolean {
    // ログインユーザと id が一致していれば編集ボタンを出す(どこだろうと出すことにする)
    return this.$store.state.auth ? this.$store.state.auth.userId === this.playingLog.user!.id : false;
  }
}
</script>
