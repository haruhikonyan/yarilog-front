import pkg from './package';

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
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
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
