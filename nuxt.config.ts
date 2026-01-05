// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/app.scss'],
  ssr: true,

  app: {
    head: {
      title: 'Panka Pergola',
      htmlAttrs: {
        lang: 'hu',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          hid: 'description',
          name: 'description',
          content:
            'Panka Pergola - Modern és egyedi pergolák tervezése és kivitelezése teraszokra és kertekbe. Árnyékolás, stílus és kényelem egész évben.',
        },
        { name: 'format-detection', content: 'telephone=no' },
        { hid: 'robots', name: 'robots', content: 'index, follow' },
        {
          'http-equiv': 'Content-Security-Policy',
          content: `
            default-src 'self' https: data:;
            img-src 'self' https: http: data:;
            font-src 'self' https: data:;
            style-src 'self' https: 'unsafe-inline';
            script-src 'self' https: 'unsafe-inline' 'unsafe-eval';
          `,
        },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'canonical', href: 'https://www.pankapergola.hu' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap',
        },
      ],
    },
  },

  modules: [
    '@nuxt/image',
    '@nuxtjs/sitemap',
  ],

  site: {
    url: 'https://www.pankapergola.hu',
    trailingSlash: true,
  },

  compatibilityDate: '2026-01-05',
})