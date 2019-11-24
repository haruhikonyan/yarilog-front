<template>
  <section class="container">
    <Breadcrumb :playing-log="playingLog" />
    <ShareIcons :share-text="shareText" :share-path="sharePath" class="float-right" />
    <div>
      <small class="text-muted mb-0">
        {{ playingLog.tune.playstyle.name }}
        <GenreBadge
          v-for="genre in playingLog.tune.genres"
          :key="genre.id"
          :genre="genre"
          :is-linkable="true"
          class="mr-1"
        />
      </small>
      <h4 class="mb-0">
        <nuxt-link :to="`/tunes/${playingLog.tune.id}`">{{ playingLog.tune.title }}</nuxt-link>
      </h4>
      <small class="text-muted mb-1">
        {{ playingLog.tune.composer.displayName }}作曲{{ playingLog.arranger | displayArranger }}
      </small>
      <h5 class="text-center mb-0">
        面白さ: {{ playingLog.interesting || '-' }} 体力: {{ playingLog.physicality || '-' }} 難易度:
        {{ playingLog.difficulty || '-' }}
      </h5>
      <div class="text-muted text-center mb-3">
        {{ playingLog.instrument.name }} {{ playingLog.position }}
        <b-badge style="background-color: rgb(246, 206, 173);">{{ playingLog.playerLevel }}</b-badge>
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
      <b-card v-if="playingLog.reflectionForNext" class="mb-2" title="次回への反省やアドバイス">
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
    </div>
    <!-- TODO 同じ曲の演奏ログや同じ人の演奏ログを出す -->
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
    return { playingLog, sharePath };
  },
  head(this: Index) {
    // なければ空文字列を入れて title に出てくるのを防ぐ
    const position = this.playingLog.position || '';
    return {
      title: `${this.playingLog.tune.title} ${this.playingLog.instrument.name}${position} ${
        this.playingLog.user.nickname
      }さん演奏 - みゅーぐ`,
      meta: [{ hid: 'description', name: 'description', content: `${this.playingLog.impressionOfInteresting}` }]
    };
  }
})
export default class Index extends Vue {
  playingLog!: PlayingLog;
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
}
</script>
