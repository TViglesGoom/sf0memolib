<script lang="ts">
// https://github.com/nhn/tui.editor/tree/master/apps/vue-editor
// `npm install --save @toast-ui/vue-editor`

import Vue from 'vue'
import { Editor } from '@toast-ui/vue-editor';

//import 'codemirror/lib/codemirror.css';
//import '@toast-ui/editor/dist/toastui-editor.css';

export default Vue.extend({
	components: {
    editor: Editor,
  },
  computed: {
    editorContent: {
      get: () => '',
      set: (content) => console.log(content),
    }
  },

})
</script>


<template>
  <div class="tui-editor-instance">
    @todo TUI Editor
  </div>
</template>

<style lang="scss">
.tui-editor-instance {
  background: #00f2f2;
}
</style>
