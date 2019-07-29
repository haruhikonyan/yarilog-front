<template>
  <p>
    <nuxt-link :to="`/playing-logs/${playingLog.id}`"
      >{{ playingLog.tune.composer.lastName }}作曲 {{ playingLog.tune.title }}</nuxt-link
    >
  </p>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { PlayingLog } from '../models/PlayingLog';

@Component({})
export default class PlayingLogCard extends Vue {
  // type 指定したいが API から取得したモデルは new してないため Object と判断されてしまう？
  @Prop({ type: Object, required: true })
  playingLog!: PlayingLog;
}
</script>
