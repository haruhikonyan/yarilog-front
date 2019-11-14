<template>
  <div>
    <b-card header-tag="header" footer-tag="footer" body-class="py-2" class="my-3">
      <nuxt-link slot="header" class="d-flex justify-content-between" :to="`/tunes/${tune.id}`">
        <div>
          <h6 class="text-muted mb-0">
            {{ tune.playstyle.name }}
            <b-badge v-for="genre in tune.genres" :key="genre.id" class="mr-1">
              {{ genre.name }}
            </b-badge>
          </h6>
          <h4>{{ tune.title }}</h4>
          <h6 class="text-muted mb-0">{{ tune.composer.displayName }}作曲</h6>
          <div>
            面白さ<StarRating :rate="(tune.averageInteresting / 5) * 100" />{{ tune.averageInteresting || '-' }}
          </div>
          <div>体力<StarRating :rate="(tune.averagePhysicality / 5) * 100" />{{ tune.averagePhysicality || '-' }}</div>
          <div>難易度<StarRating :rate="(tune.averageDifficulty / 5) * 100" />{{ tune.averageDifficulty || '-' }}</div>
          <font-awesome-icon icon="comment-dots" />{{ tune.countPlayingLogs }}件
        </div>
      </nuxt-link>
      <div v-for="playingLog in tune.playingLogs" :key="playingLog.id">
        <PlayingLogSummary :playing-log="playingLog" />
        <!-- TODO 区切りのブラッシュアップと最後には表示しないようにする -->
        <hr />
      </div>
    </b-card>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue';
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Tune } from '../models/Tune';
import PlayingLogSummary from '~/components/PlayingLogSummary.vue';
import StarRating from '~/components/StarRating.vue';

@Component({
  components: {
    PlayingLogSummary,
    StarRating
  }
})
export default class TuneCard extends Vue {
  @Prop({ type: Object as PropType<Tune>, required: true })
  tune!: Tune;
}
</script>
