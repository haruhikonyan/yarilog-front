<template>
  <b-badge v-if="isLinkable" :to="`/genres/${genre.id}`">
    <span>{{ genre.name }}</span>
  </b-badge>
  <b-badge v-else>
    <span>{{ genre.name }}</span>
  </b-badge>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { PropType } from 'vue';
import { Genre } from '../models/Tune';

@Component({})
export default class GenreBadge extends Vue {
  @Prop({ type: Object as PropType<Genre> })
  genre!: Genre;
  @Prop({ type: Boolean, default: false })
  isLinkable!: Boolean;
}
</script>
