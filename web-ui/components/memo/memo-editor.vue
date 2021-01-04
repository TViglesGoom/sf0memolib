<script lang="ts">
import Vue from 'vue'
import VueTagsInput from '@johmun/vue-tags-input';

import AceEditorComponent from '@/components/editors/ace.editor.vue';
import TUIEditorComponent from '@/components/editors/tui.editor.vue';
import { mapActions, mapGetters } from 'vuex';

export default Vue.extend({
  data() {
    return {
      tag: '',
    };
  },
	components: {
    VueTagsInput, // @ref: http://www.vue-tags-input.com/#/ , https://github.com/JohMun/vue-tags-input
    'editor': AceEditorComponent,
    //'editor': TUIEditorComponent,
  },
  computed: {
    ...mapGetters({
      memoDocumentOpenInEditor: 'memos/memoDocumentOpenInEditor',
      editorDocumentChanged: 'memos/editorDocumentChanged',
      docTitle: 'memos/editorDocumentTitle',
      docTaxonomy: 'memos/editorDocumentTaxonomy',
    }),
    memoTitle: {
      get() {
        return this.docTitle;
      },
      set(newTitle) {
        this.$store.dispatch('memos/updateEditedMemoTitle', newTitle)
      }
    },
    memoTaxonomy: {
      get() {
        return this.docTaxonomy.map((tagText: string) => {
          return {
            text: tagText,
            tiClasses: ["ti-valid"],
          }
        });
      },
      set(newTaxonomy: any[]) {
        this.$store.dispatch(
          'memos/updateEditedMemoTaxonomy',
          newTaxonomy.map(tag => tag.text)
        );
      }
    }
  },
  methods: {
    ...mapActions({
      newEditorMemo: 'memos/openNewInEditor',
      saveEditorMemo: 'memos/saveMemoInEditor',
      closeEditorMemo: 'memos/closeMemoInEditor',
      dropEditorMemo: 'memos/deleteMemo',
    })
  }
});
</script>

<template>
  <!--<div id="memo-editor-container" class="px-4 py-5 bg-white space-y-6 sm:p-6 m-auto shadow sm:rounded-md sm:overflow-hidden">-->
  <div id="memo-editor-container">

    <div v-if="!memoDocumentOpenInEditor" id="memo-editor-vacant" class="my-1 px-4 py-5 space-y-6 sm:p-6 sm:overflow-hidden object-center">
      <p class="text-center text-md font-sm text-gray-700 leading-loose">
        Memo Editor is vacant<br/>
        Create <button
          @click="newEditorMemo()"
          class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-olive-600 hover:bg-olive-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-olive-500"
        >New Memo</button> <br/>or open existing from collection &rarr;<br/>
        ..and fix this fucking box to an <u>unhurt my eyes</u> standard or higher
      </p>
    </div>

    <div v-else id="memo-editor-occupied" class="my-1 px-4 py-5 space-y-6 sm:p-6 m-auto sm:overflow-hidden">
      <div v-if="true" class="mt-6 border-gray-300">
        <div class="mt-1 flex rounded-md shadow-sm">
          <input type="text" name="memo_title" id="memo_title"
            class="flex-1 block w-full text-sm rounded-md sm:text-xs"
            placeholder="memo title" v-model="memoTitle">
        </div>
      </div>

      <div>
        <editor class="mt-1 flex rounded-md shadow-sm"
          id="editor-driver"
        ></editor>
      </div>

      <div v-if="true" class="mt-6 border-gray-300"><!-- @todo taxonomy -->
        <label class="block text-xs font-medium text-gray-700 mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <client-only>
            <vue-tags-input
              v-model="tag"
              :tags="memoTaxonomy"
              @tags-changed="newTags => memoTaxonomy = newTags"
            />
          </client-only>
        </label>

      </div>

      <div v-if="true" class="mt-6"><!-- @todo file uploads -->
        <label class="block text-xs font-medium text-gray-700">
          Attach files (will be stored as CouchDB document attachments)
        </label>
        <div class="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div class="space-y-1 text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <div class="flex text-sm text-gray-600">
              <label for="file-upload"
                class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                <span>Upload a file</span>
                <input id="file-upload" name="file-upload" type="file" class="sr-only">
              </label>
              <p class="pl-1">or drag and drop</p>
            </div>
            <p class="text-xs text-gray-500">
              PNG, JPG, GIF up to 10MB
            </p>
          </div>
        </div>
      </div>

      <div class="px-4 py-3 text-right sm:px-6">
        <button @click="dropEditorMemo()"
          class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-olive-500">
          Delete
        </button>
        <button @click="closeEditorMemo()"
          class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-olive-600 hover:bg-olive-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-olive-500">
          <span v-if="editorDocumentChanged">Discard</span>
          <span v-else>Close</span>
        </button>
        <button @click="saveEditorMemo()"
          class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Save
        </button>
      </div>
    </div>

  </div>

</template>

<style lang="scss" scoped>
#memo-editor-container {
  height: calc(100vh - 72px);
  #memo-editor-vacant {
    //width: auto;
    //height: auto;
    background: white;
  }
  #memo-editor-occupied {
    //height: calc(100vh - 72px);
    background: white;

    #editor-driver {
      //
    }
  }
}
</style>
