module.exports = {
  plugins: ['~/plugins/infinite-loading.js', '~/plugins/datepicker.js'],
  modules: ['@nuxtjs/axios', ['@nuxtjs/google-analytics', { id: 'UA-3536169-22' }]],
  css: ['~/assets/css/base.scss'],
  env: {
    PPTV_DATA_URL: process.env.PPTV_DATA_URL
  },
  /*
  ** Headers of the page
  */
  head: {
    title: 'プープーテレビ検索',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'プープーテレビの全動画を検索します' },
      {
        property: 'og:title',
        content: 'プープーテレビ検索',
        hid: 'ogTitle'
      },
      { property: 'og:site_name', content: 'プープーテレビ検索' },
      { property: 'og:url', content: 'https://pptv.netlify.com', hid: 'ogUrl' },
      { property: 'og:type', content: 'article' },
      { property: 'og:locale', content: 'ja_JP' },
      {
        property: 'og:description',
        content: `プープーテレビの全動画を検索します`,
        hid: 'ogDesc'
      },
      {
        property: 'og:image',
        content: 'https://pptv.netlify.com/img/pptv-ogp.png',
        hid: 'ogImage'
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon/favicon.ico' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon/favicon-16x16.png' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon/favicon-32x32.png' }
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    extend(config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
