<template>
  <b-carousel :interval="5000" indicators>
    <b-carousel-slide v-for="playingLog in playingLogs" :key="playingLog.id" class="yrl-playing-log-carousel-item">
      <PlayingLogCard class="text-left" :playing-log="playingLog" />
    </b-carousel-slide>
  </b-carousel>
</template>

<script lang="ts">
import { PropType } from 'vue';
import { Component, Vue, Prop } from 'vue-property-decorator';
import { PlayingLog } from '../../models/PlayingLog';
import PlayingLogCard from '../../components/PlayingLogCard.vue';

@Component({
  components: {
    PlayingLogCard
  }
})
export default class PlayingLogCarousel extends Vue {
  @Prop({ type: Array as PropType<PlayingLog[]>, required: true })
  playingLogs!: PlayingLog[];
}
</script>

<style lang="scss">
.yrl-playing-log-carousel-item {
  .carousel-caption {
    position: relative;
    top: 0;
    right: 0;
    left: 0;
  }
}
</style>
