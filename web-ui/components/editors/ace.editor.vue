<script lang="ts">
import Vue from 'vue'
import { mapActions, mapGetters } from 'vuex';

export default Vue.extend({
	components: {
    editor: require('vue2-ace-editor'),
  },
  computed: {
    ...mapGetters({
      couchDocContent: 'memos/editorDocumentContent',
    }),
    editorContent: {
      get() {
        return this.couchDocContent || '';
      },
      set(content: String) {
        console.log(`updating couchDoc, length: ${content.length}`);
        this.$store.dispatch('memos/updateEditedMemoContent', content.split('\n'));
      },
    }
  },
  methods: {
    //...mapActions({
    //  updateDocContent: 'memos/updateMemoDocumentContent',
    //}),
    editorInit: function () {
      require('brace/ext/language_tools'); //language extension prerequsite
      require('brace/mode/html');
      require('brace/theme/chrome');
      require('brace/mode/markdown');
      //require('brace/snippets/javascript') //snippet
      //require('brace/mode/javascript')    //language
      //require('brace/mode/less')
    }
  },
})
</script>

<template>
  <editor v-model="editorContent"
    @init="editorInit"
    lang="markdown" theme="chrome"
     height="200px"
    class="ace-editor-instance"
  ></editor>
</template>

<style lang="scss">
// @ref: https://github.com/chairuosen/vue2-ace-editor
.ace-editor-instance {
  position: relative;

  // @enhance: line numbers column width to stay fixed for 9 lines - 100000 lines line numbers
  // hack to reduce gutter (editor line numbers column) width, @ref: https://github.com/ajaxorg/ace/issues/1104
  .ace_gutter-layer {
    /* original width is 48px */
    width: 32px !important;
  }
  .ace_gutter-layer > * {
    /* 48 - 32 = 16 */
    margin-left: -16px;
  }
}
</style>
