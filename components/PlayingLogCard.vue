<template>
  <nuxt-link :to="`/playing-logs/${playingLog.id}`">
    <b-card header-tag="header" footer-tag="footer" header-class="pt-1 px-3" body-class="py-2 px-3" footer-class="px-1">
      <div slot="header">
        <font-awesome-icon
          v-if="showEditButton"
          class="yrl-edit-btn-absolute"
          icon="pencil-alt"
          size="lg"
          @click.prevent="editClickHandler"
        />
        <div v-if="playingLog.isDraft" class="text-center">下書き</div>
        <div class="text-muted small text-center mb-0">
          {{ playingLog.playstyle.name }}
        </div>
        <GenreBadge v-for="genre in playingLog.tune.genres" :key="genre.id" :genre="genre" class="mr-1" />
        <h6>{{ playingLog.tune.title }}</h6>
        <h6 class="text-muted mb-0">
          {{ playingLog.tune.composer.displayName }}作曲{{ playingLog.arranger | displayArranger
          }}{{ playingLog.edition | displayEdition }}
        </h6>
      </div>
      <b-card-text class="mb-1" style="font-size: 12px;"
        >{{ playingLog.user.nickname }}さんの{{ playingLog.playDate }}演奏</b-card-text
      >
      <pre class="text-muted mb-0 yrl-pre-wrap yrl-truncate-three-line">{{ playingLog.impressionOfInteresting }}</pre>
      <div slot="footer">
        <div class="row no-gutters text-center">
          <div class="col-4">
            <div>面白さ</div>
            <div>{{ playingLog.interesting || '-' }}</div>
          </div>
          <div class="col-4">
            <div>体力</div>
            <div>{{ playingLog.physicality || '-' }}</div>
          </div>
          <div class="col-4">
            <div>難易度</div>
            <div>{{ playingLog.difficulty || '-' }}</div>
          </div>
        </div>
      </div>
      <b-badge>{{ playingLog.playerLevel }}</b-badge>
      <b-badge>{{ playingLog.instrument.shortName }} {{ playingLog.position }}</b-badge>
    </b-card>
  </nuxt-link>
</template>

<script lang="ts">
import { PropType } from 'vue';
import { Component, Vue, Prop } from 'vue-property-decorator';
import { PlayingLog } from '../models/PlayingLog';
import GenreBadge from './GenreBadge.vue';

@Component({
  components: {
    GenreBadge
  }
})
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
@import 'bootstrap/scss/_functions.scss';
@import 'bootstrap/scss/_variables.scss';
@import 'bootstrap/scss/mixins/_breakpoints.scss';
// 3行に固定して余った分は省略
.yrl-truncate-three-line {
  display: -webkit-box;
  /* autoprefixer: off */
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  font-size: 10px;
  @include media-breakpoint-up(md) {
    // md 以上は3行分確保する(15px * 3)
    height: 45px;
  }
}
.yrl-edit-btn-absolute {
  position: absolute;
  top: 6px;
  right: 6px;
}
</style>
