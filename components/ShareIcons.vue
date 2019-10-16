<template>
  <section>
    <a :href="twitterShareLink" target="_blank">
      <font-awesome-layers class="fa-2x">
        <font-awesome-icon :icon="['fab', 'twitter-square']" style="color: #55acee" />
      </font-awesome-layers>
    </a>
    <a :href="facebookShareLink" target="_blank">
      <font-awesome-layers class="fa-2x">
        <font-awesome-icon :icon="['fab', 'facebook-square']" style="color: #3b5998" />
      </font-awesome-layers>
    </a>

    <a :href="lineShareLink" target="_blank">
      <font-awesome-layers class="fa-2x">
        <font-awesome-icon :icon="['fab', 'line']" style="color: #00B900" />
      </font-awesome-layers>
    </a>
  </section>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({})
export default class ShareIcons extends Vue {
  @Prop({ type: String, required: true })
  shareText!: string;
  @Prop({ type: String, required: true })
  sharePath!: string;

  twitterHashtag = 'みゅーぐ';

  twitterShareLink: string = `https://twitter.com/intent/tweet?url=${this.sharePath}&text=${this.shareText}&hashtags=${
    this.twitterHashtag
  }`;
  facebookShareLink: string = `https://www.facebook.com/share.php?u=${this.sharePath}`;
  lineShareLink: string = `https://social-plugins.line.me/lineit/share?url=${this.sharePath}&text=${this.shareText}`;
}
</script>
