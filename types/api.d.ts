import { Api } from "~/plugins/api";

declare module '@nuxt/vue-app' {
    interface Context {
      $api: Api
    }
  }
  
  declare module 'vue/types/vue' {
    interface Vue {
      $api: Api
    }
  }
