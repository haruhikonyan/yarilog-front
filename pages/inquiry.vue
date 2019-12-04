<template>
  <section class="container">
    <b-alert class="yrl-pre-wrap text-center" :show="flushMessage">{{ flushMessage }}</b-alert>
    <h1 class="text-center">
      お問い合わせ
    </h1>
    <b-form @submit.prevent="submitHandler">
      <b-form-group label="問い合わせ種別">
        <b-form-select v-model="inquiry.inquiryType" required>
          <option v-for="inquiryType in inquiryTypes" :key="inquiryType.id" :value="inquiryType">
            {{ inquiryType.type }}
          </option>
        </b-form-select>
      </b-form-group>

      <b-form-group label="返信用メールアドレス" description="返信が必要ない方は不要です">
        <b-form-input v-model="inquiry.mailAddress" type="email" placeholder="info.musig@gmail.com"></b-form-input>
      </b-form-group>

      <b-form-group label="問い合わせ内容">
        <b-form-textarea v-model="inquiry.content" rows="5" max-rows="8" required></b-form-textarea>
      </b-form-group>

      <b-button block type="submit" variant="primary">送信</b-button>
    </b-form>
    <div class="text-center mt-2">
      <div>メールで直接の問い合わせはこちらまで</div>
      <div>info.musig☆gmail.com</div>
      <small>
        「☆」を半角の「@」に変更してご利用ください
      </small>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Inquiry } from '../models/Inquiry';

@Component({
  components: {},
  async asyncData({ app, query }) {
    const inquiryTypes = await app.$api.getInquiryTypes();
    const inquiry = new Inquiry();

    inquiry.inquiryType = query.inquiryTypeId
      ? inquiryTypes.find(i => i.id.toString() === query.inquiryTypeId)
      : inquiryTypes.find(i => i.id === 1);
    if (query.content) {
      inquiry.content = query.content as string;
    }

    return { inquiryTypes, inquiry };
  }
})
export default class Index extends Vue {
  inquiry!: Inquiry;
  flushMessage: string | null = null;
  async submitHandler() {
    await this.$api.createInquiry(this.inquiry);
    // 初期化
    this.inquiry = new Inquiry();
    this.flushMessage = `お問い合わせありがとうございます！
運営からの返信をお待ちください`;
  }
}
</script>
