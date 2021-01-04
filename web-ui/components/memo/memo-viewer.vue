<script lang="ts">
import Vue from 'vue'
import MarkdownHTMLFixtureComponent from '@/components/memo/markdown-html-fixture.vue';

export default Vue.extend({
	components: {
    'markdown-html-fixture': MarkdownHTMLFixtureComponent,
  },

})
</script>

<template>
  <div class="memo-viewer-component">
    <div class="memo-content markdown-body">
      <markdown-html-fixture></markdown-html-fixture>
    </div>
  </div>
</template>

<style lang="scss">

.memo-viewer-component {
  // 1. github-markdown-css
  // `npm install github-markdown-css`
  // @ref: https://github.com/sindresorhus/generate-github-markdown-css
  // <meta name="viewport" content="width=device-width, initial-scale=1"> // implemented in nuxt/config.js
  // <link rel="stylesheet" href="github-markdown.css"> // implemented in nuxt.config.js
  .markdown-body {
		box-sizing: border-box;
		min-width: 200px;
		max-width: 980px;
		margin: 0 auto;
		padding: 45px;
	}

	@media (max-width: 767px) {
		.markdown-body {
			padding: 15px;
		}
	}

  // 2. https://github.com/simonlc/Markdown-CSS, https://simon.lc/sites/markdown/
  // @todo

  // 3. @ref: https://primer.style/
  // @todo

  // 4. https://github.com/jonschlinkert/remarkable https://jonschlinkert.github.io/remarkable/demo/
  // @todo
}
</style>
