export default {
  // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
  ssr: false,

  // Target (https://go.nuxtjs.dev/config-target)
  target: 'static',

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'sf0web-ui',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    //link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
    '~/assets/css/main.scss',
    '~/assets/themes/prism-ghcolors.css',
    'normalize.css/normalize.css',
    //'knopf.css',
    //'fomantic-ui-css/semantic.min.css',
    //'github-markdown-css/github-markdown.css',
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    { src: '~/plugins/vue-tags-input', ssr: false },
    { src: '~/plugins/vt-notifications.js', ssr: false},
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',

    // @techdebt: "TypeError: GoogleFontsHelper is not a constructor"
    // Doc: https://github.com/nuxt-community/google-fonts-module
    //"@nuxtjs/google-fonts",
    ['@nuxtjs/dotenv', { path: '../' }],
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    // https://go.nuxtjs.dev/content
    '@nuxt/content',
  ],

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)

  // Content module configuration (https://go.nuxtjs.dev/config-content)
  content: {
    editor: '~/.nuxt/content/editor.vue', // @ref: https://github.com/nuxt/content/blob/master/packages/content/templates/editor.vue
    apiPrefix: '_content',
    dir: 'content',
    fullTextSearchFields: ['title', 'description', 'slug', 'text'],
    nestedProperties: [],
    liveEdit: false,
    markdown: {
      remarkPlugins: [
        'remark-squeeze-paragraphs',
        'remark-slug',
        'remark-autolink-headings',
        'remark-external-links',
        'remark-footnotes'
      ],
      rehypePlugins: [
        'rehype-minify-whitespace',
        'rehype-sort-attribute-values',
        'rehype-sort-attributes',
        'rehype-raw'
      ],
      prism: {
        //├── node_modules/prismjs
        //│   ├── node_modules/prismjs/components
        //│   ├── node_modules/prismjs/plugins
        //│   │   ├── node_modules/prismjs/plugins/autolinker
        //│   │   ├── node_modules/prismjs/plugins/autoloader
        //│   │   ├── node_modules/prismjs/plugins/command-line
        //│   │   ├── node_modules/prismjs/plugins/copy-to-clipboard
        //│   │   ├── node_modules/prismjs/plugins/custom-class
        //│   │   ├── node_modules/prismjs/plugins/data-uri-highlight
        //│   │   ├── node_modules/prismjs/plugins/diff-highlight
        //│   │   ├── node_modules/prismjs/plugins/download-button
        //│   │   ├── node_modules/prismjs/plugins/file-highlight
        //│   │   ├── node_modules/prismjs/plugins/filter-highlight-all
        //│   │   ├── node_modules/prismjs/plugins/highlight-keywords
        //│   │   ├── node_modules/prismjs/plugins/inline-color
        //│   │   ├── node_modules/prismjs/plugins/jsonp-highlight
        //│   │   ├── node_modules/prismjs/plugins/keep-markup
        //│   │   ├── node_modules/prismjs/plugins/line-highlight
        //│   │   ├── node_modules/prismjs/plugins/line-numbers
        //│   │   ├── node_modules/prismjs/plugins/match-braces
        //│   │   ├── node_modules/prismjs/plugins/normalize-whitespace
        //│   │   ├── node_modules/prismjs/plugins/previewers
        //│   │   ├── node_modules/prismjs/plugins/remove-initial-line-feed
        //│   │   ├── node_modules/prismjs/plugins/show-invisibles
        //│   │   ├── node_modules/prismjs/plugins/show-language
        //│   │   ├── node_modules/prismjs/plugins/toolbar
        //│   │   ├── node_modules/prismjs/plugins/treeview
        //│   │   ├── node_modules/prismjs/plugins/unescaped-markup
        //│   │   └── node_modules/prismjs/plugins/wpd
        //│   └── node_modules/prismjs/themes
        //theme: '@/assets/themes/prism-ghcolors.css',
      }
    },
    yaml: {}, // @ref: https://github.com/nodeca/js-yaml#api
    csv: {}, // @ref: https://github.com/Keyang/node-csvtojson#parameters
    xml: {}, // @ref: https://www.npmjs.com/package/xml2js#options
    extendParser: {
      '.txt': file => file.split('\n').map(line => line.trim())
    }
  },

  // @techdebt: "TypeError: GoogleFontsHelper is not a constructor"
  //googleFonts: {
  //  families: {
  //    Inter: true
  //  }
  //},

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    vendor: [
      '@johmun/vue-tags-input',
      'vt-notifications'
    ],
  },
}
