import { Api } from '~/plugins/api';
import Vue from 'vue';

declare module '@nuxt/vue-app' {
  interface Context {
    $api: Api;
    // TODO analytics-module がバージョンアップして最新の vue-analytics に追従すれば型情報が取れる
    $ga: any;
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $api: Api;
    // TODO analytics-module がバージョンアップして最新の vue-analytics に追従すれば型情報が取れる
    $ga: any;
  }
}
