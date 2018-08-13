const webpack = require('webpack')
module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'shenhui',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  css: [
    'github-markdown-css/github-markdown.css',
    '~/plugins/bootstrap/css/bootstrap.css',
    '~/plugins/font-awesome/css/font-awesome.min.css',
    '~/assets/css/style.css',
    '~/assets/css/style-responsive.min.css',
    '~/assets/css/theme/default.css',
  ],
  plugins: [
    // ssr: false to only include it on client-side
    // { src: '~/plugins/jquery/jquery-1.9.1.min.js', ssr: false },
    { src: '~/plugins/bootstrap/js/bootstrap.min.js', ssr: false },
    // { src: '~/plugins/pace/pace.js', ssr: false },
    // { src: '~/plugins/scrollMonitor/scrollMonitor.js', ssr: false },
    // { src: '~/plugins/apps.js', ssr: false }
  ],
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  build: {
    vendor: ['jquery'],
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery'
        // ...etc.
      })
    ],
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
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

