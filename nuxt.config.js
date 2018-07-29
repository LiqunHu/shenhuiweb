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
    'bootstrap/dist/css/bootstrap.css',
    'font-awesome/css/font-awesome.min.css',
    '~/css/style.min.css',
    '~/css/style-responsive.min.css',
    '~/css/default.css',
  ],
  plugins: [
    // ssr: false to only include it on client-side
    { src: '~/plugins/apps.min.js', ssr: false }
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

