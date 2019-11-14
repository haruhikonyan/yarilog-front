<template>
  <nuxt-link :to="`/playing-logs/${playingLog.id}`">
    <b-card header-tag="header" footer-tag="footer" header-class="pt-1" body-class="py-2" class="my-3">
      <div slot="header" class="d-flex justify-content-between">
        <div>
          <small class="text-muted mb-0">
            {{ playingLog.tune.playstyle.name }}
            <b-badge v-for="genre in playingLog.tune.genres" :key="genre.id" class="mr-1">
              {{ genre.name }}
            </b-badge>
          </small>
          <h4>{{ playingLog.tune.title }}</h4>
          <h6 class="text-muted mb-0">
            {{ playingLog.tune.composer.displayName }}作曲{{ playingLog.arranger | displayArranger }}
          </h6>
        </div>
        <b-button
          v-if="showEditButton"
          size="sm"
          class="align-self-start text-nowrap mr-n3 mt-2"
          @click.prevent="editClickHandler"
          >編集</b-button
        >
      </div>
      <b-card-text class="mb-1">{{ playingLog.user.nickname }}さんの{{ playingLog.playDate }}演奏</b-card-text>
      <pre class="text-muted mb-0 yrl-pre-wrap yrl-truncate-three-line">{{ playingLog.impressionOfInteresting }}</pre>
      <div slot="footer">
        面白さ: {{ playingLog.interesting || '-' }} 体力: {{ playingLog.physicality || '-' }} 難易度:
        {{ playingLog.difficulty || '-' }}
        <div>
          <b-badge>{{ playingLog.playerLevel }}</b-badge>
          <b-badge>{{ playingLog.instrument.shortName }} {{ playingLog.position }}</b-badge>
        </div>
      </div>
    </b-card>
  </nuxt-link>
</template>

<script lang="ts">
import { PropType } from 'vue';
import { Component, Vue, Prop } from 'vue-property-decorator';
import { PlayingLog } from '../models/PlayingLog';

@Component({})
export default class PlayingLogCard extends Vue {
  @Prop({ type: Object as PropType<PlayingLog>, required: true })
  playingLog!: PlayingLog;

  get showEditButton(): boolean {
    // ログインユーザと id が一致していれば編集ボタンを出す(どこだろうと出すことにする)
    return this.$store.state.auth ? this.$store.state.auth.userId === this.playingLog.user!.id : false;
  }
  editClickHandler() {
    this.$router.push(`/playing-logs/${this.playingLog.id}/edit`);
  }
}
</script>
<style lang="scss" scoped>
// 3行に固定して余った分は省略
.yrl-truncate-three-line {
  display: -webkit-box;
  /* autoprefixer: off */
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
</style>
