<template>
  <section class="container">
    <div>
      <logo />
      <h1 class="title">
        ユーザ新規登録
      </h1>
      <b-form @submit.prevent="createUser">
        <b-form-group label="ユーザ名" description="ログインに利用します(半角英数のみ)">
          <b-form-input
            v-model="newUser.username"
            required
            pattern="^[0-9A-Za-z]+$"
            placeholder="musigman"
          ></b-form-input>
        </b-form-group>
        <b-form-group label="メールアドレス">
          <b-form-input
            v-model="newUser.mailAddress"
            type="email"
            required
            placeholder="info.musig@gmail.com"
          ></b-form-input>
        </b-form-group>
        <b-form-group label="パスワード">
          <b-form-input v-model="newUser.password" type="password" required></b-form-input>
        </b-form-group>
        <b-form-group label="表示名">
          <b-form-input v-model="newUser.nickname" required placeholder="みゅーぐまん"></b-form-input>
        </b-form-group>

        <b-button type="submit" variant="primary">ユーザ登録</b-button>
      </b-form>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { User } from '~/models/User';

@Component({
  components: {},
  middleware: 'notAuthenticated'
})
export default class Index extends Vue {
  newUser: User = new User();
  async createUser() {
    await this.$api.createUser(this.newUser);
    // TODO 自動的にログインしてマイページに飛ばしたい
    this.$router.push({ path: '/login', query: { callbackPath: this.$route.query.callbackPath } });
  }
}
</script>
