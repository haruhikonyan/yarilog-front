<template>
  <section class="container">
    <div>
      <h1>
        マイページ
      </h1>
      <p>
        {{ usernameOrProviderName }}
      </p>
      <p v-if="!isMailAddressEditing">
        メールアドレス：{{ user.mailAddress }}
        <b-button size="sm" @click="editMailAddress">編集</b-button>
      </p>
      <b-form v-else inline>
        <b-form-input v-model="editingMailAddress" type="email"></b-form-input>
        <b-button size="sm" variant="primary" :disabled="!editingMailAddress" class="mr-2" @click="updateMailAddress">
          保存
        </b-button>
        <b-button size="sm" @click="isMailAddressEditing = false">キャンセル</b-button>
      </b-form>
      <p v-if="!isNicknameEditing">
        ニックネーム：{{ user.nickname }}
        <b-button size="sm" @click="editNickname">編集</b-button>
      </p>
      <b-form v-else inline>
        <b-form-input v-model="editingNickname"></b-form-input>
        <b-button size="sm" variant="primary" :disabled="!editingNickname" class="mr-2" @click="updateNickname">
          保存
        </b-button>
        <b-button size="sm" @click="isNicknameEditing = false">キャンセル</b-button>
      </b-form>
      <template v-if="!isDescriptionEditing">
        <p>
          自己紹介
          <b-button size="sm" @click="editDescription">編集</b-button>
        </p>
        <pre class="yrl-pre-wrap">{{ user.description }}</pre>
      </template>
      <b-form v-else inline class="mb-3">
        <b-form-textarea v-model="editingDescription" rows="6"></b-form-textarea>
        <b-button
          size="sm"
          variant="primary"
          :disabled="editingDescription == null"
          class="mr-2"
          @click="updateDescription"
        >
          保存
        </b-button>
        <b-button size="sm" @click="isDescriptionEditing = false">キャンセル</b-button>
      </b-form>

      <b-button block to="/playing-logs/new" variant="primary" class="mb-3">演奏記録をつける</b-button>
      <div>
        <h3>{{ user.nickname }}の演奏記録</h3>
      </div>
      <div class="row">
        <div v-for="playingLog in playingLogs" :key="playingLog.id" class="mb-2 col-md-6">
          <PlayingLogCard :playing-log="playingLog" />
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { User } from '../models/User';
import PlayingLogCard from '../components/PlayingLogCard.vue';
import { PlayingLog } from '../models/PlayingLog';

@Component({
  components: {
    PlayingLogCard
  },
  middleware: 'authenticated',
  async asyncData({ app }) {
    const user = await app.$api.me();
    return { user };
  }
})
export default class Index extends Vue {
  user!: User;
  playingLogs: PlayingLog[] = [];
  isMailAddressEditing: boolean = false;
  isNicknameEditing: boolean = false;
  isDescriptionEditing: boolean = false;
  editingMailAddress: string | null = null;
  editingNickname: string | null = null;
  editingDescription: string | null = null;

  get usernameOrProviderName() {
    return this.user.username && !this.user.externalAccount
      ? `ユーザ名：${this.user.username}`
      : `ログインアカウント： ${this.user.externalAccount!.providerType}`;
  }

  async created() {
    // 全件表示
    this.playingLogs = await this.$api.getPlayingLogsByUser(this.user.id!, 0, 0);
  }

  editMailAddress() {
    this.editingMailAddress = this.user.mailAddress;
    this.isMailAddressEditing = true;
  }

  async updateMailAddress() {
    if (!this.editingMailAddress) {
      return;
    }
    this.user = await this.$api.updateUserMailAddress(this.editingMailAddress);
    this.isMailAddressEditing = false;
  }

  editNickname() {
    this.editingNickname = this.user.nickname;
    this.isNicknameEditing = true;
  }

  async updateNickname() {
    if (!this.editingNickname) {
      return;
    }
    this.user = await this.$api.updateUserNickname(this.editingNickname);
    this.isNicknameEditing = false;
  }

  editDescription() {
    this.editingDescription = this.user.description;
    this.isDescriptionEditing = true;
  }

  async updateDescription() {
    if (this.editingDescription == null) {
      return;
    }
    this.user = await this.$api.updateUserDescription(this.editingDescription);
    this.isDescriptionEditing = false;
  }
}
</script>
