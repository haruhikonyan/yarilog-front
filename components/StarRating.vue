<template>
  <div class="star-rating">
    <div class="star-rating-item" :style="{ width: `${rate}%` }"></div>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue';
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({})
export default class StarRating extends Vue {
  @Prop({ type: Number, required: true })
  rate!: number;
}
</script>

<style lang="scss" scoped>
.star-rating {
  position: relative;
  display: inline-block;
}
.star-rating .star-rating-item {
  position: absolute;
  overflow: hidden;
  overflow-wrap: normal;
}
.star-rating .star-rating-item:before {
  content: '★★★★★';
  color: #ffcc33;
}
.star-rating:after {
  content: '★★★★★';
  color: #ccc;
}
</style>
