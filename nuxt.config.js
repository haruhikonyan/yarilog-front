export default {
  mode: 'universal',
  buildModules: [
    [
      '@nuxt/typescript-build',
      {
        typeCheck: true,
        ignoreNotFoundWarnings: true
      }
    ]
  ],

  /*
   ** Headers of the page
   */
  head: {
    title: '音楽を奏でるすべての人へ 演奏記録の共有サイト みゅーぐ',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content:
          '『みゅーぐ』は楽器、そして演奏を愛する人々が演奏した記録・思い出を曲のレビュー(演奏記録)という形で残していけるWebサービスです。'
      },
      {
        hid: 'og:site_name',
        property: 'og:site_name',
        content: '音楽を奏でるすべての人へ 演奏記録の共有サイト みゅーぐ'
      },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      { hid: 'og:url', property: 'og:url', content: process.env.frontUrl },
      { hid: 'og:title', property: 'og:title', content: '音楽を奏でるすべての人へ 演奏記録の共有サイト みゅーぐ' },
      {
        hid: 'og:description',
        property: 'og:description',
        content:
          '『みゅーぐ』は楽器、そして演奏を愛する人々が演奏した記録・思い出を曲のレビュー(演奏記録)という形で残していけるWebサービスです。'
      },
      { hid: 'og:image', property: 'og:image', content: `${process.env.frontUrl}/ogp.png` }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },

  /*
   ** Global CSS
   */
  css: ['~/styles/custom.scss'],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['~/plugins/api', '~/plugins/axios', '~/plugins/playing-log-display-filter.ts'],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // Doc: https://bootstrap-vue.js.org/docs/
    'bootstrap-vue/nuxt',
    'nuxt-fontawesome',
    '@nuxtjs/google-analytics',
    [
      '@nuxtjs/google-adsense',
      {
        id: process.env.adsenseId || 'dummy',
        pageLevelAds: true,
        analyticsUacct: process.env.gaId || 'dummy',
        analyticsDomainName: process.env.domainName || 'dummy'
      }
    ]
  ],
  bootstrapVue: {
    bootstrapCSS: false, // Or `css: false`
    bootstrapVueCSS: false // Or `bvCSS: false`
  },
  /*
   ** Axios module configuration
   */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    baseURL: process.env.baseApiUrl,
    browserBaseURL: process.env.baseBrouserApiUrl
  },
  fontawesome: {
    imports: [
      {
        set: '@fortawesome/free-solid-svg-icons',
        icons: ['fas']
      },
      {
        set: '@fortawesome/free-brands-svg-icons',
        icons: ['fab']
      }
    ]
  },
  googleAnalytics: {
    id: process.env.gaId || 'dummy'
    // debug: {
    //   enabled: true,
    //   sendHitTask: true
    // }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.devtool = 'inline-cheap-module-source-map';
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        });
      }
    }
  },
  env: {
    baseBrouserApiUrl: process.env.baseBrouserApiUrl,
    frontUrl: process.env.frontUrl
  }
};
