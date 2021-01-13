<script lang="ts">
import Vue from 'vue'
import VueTagsInput from '@johmun/vue-tags-input'

import AceEditorComponent from '@/components/editors/ace.editor.vue'
import TUIEditorComponent from '@/components/editors/tui.editor.vue'
import { mapActions, mapGetters } from 'vuex'

export default Vue.extend({
  components: {
    VueTagsInput, // @ref: http://www.vue-tags-input.com/#/ , https://github.com/JohMun/vue-tags-input
    editor: AceEditorComponent,
    // editor: TUIEditorComponent,
  },
  data() {
    return {
      tag: '',
    }
  },
  computed: {
    ...mapGetters({
      memoDocumentOpenInEditor: 'memos/memoDocumentOpenInEditor',
      editorDocumentChanged: 'memos/editorDocumentChanged',
      docTitle: 'memos/editorDocumentTitle',
      docTaxonomy: 'memos/editorDocumentTaxonomy',
      docImg: 'memos/editorDocumentImg'
    }),
    memoTitle: {
      get() {
        return this.docTitle
      },
      set(newTitle) {
        this.$store.dispatch('memos/updateEditedMemoTitle', newTitle)
      },
    },
    memoTaxonomy: {
      get() {
        return this.docTaxonomy.map((tagText: string) => {
          return {
            text: tagText,
            tiClasses: ['ti-valid'],
          }
        })
      },
      set(newTaxonomy: any[]) {
        this.$store.dispatch(
          'memos/updateEditedMemoTaxonomy',
          newTaxonomy.map((tag) => tag.text)
        )
      },
    },
  },
  methods: {
    ...mapActions({
      newEditorMemo: 'memos/openNewInEditor',
      saveEditorMemo: 'memos/saveMemoInEditor',
      dropEditorMemo: 'memos/deleteMemo',
      setConfirmModalState: 'memos/setConfirmModalState',
    }),
    triggerDiscardCloseButton() {
      if (this.editorDocumentChanged) {
        return this.$store.dispatch('memos/setConfirmModalState', {
          isAsking: true,
          message: 'Are you sure you want to discard changes of this memo?',
          confirmMethod: () => this.$store.dispatch('memos/closeMemoInEditor'),
        })
      }
      this.$store.dispatch('memos/closeMemoInEditor')
    },
    uploadFile(file) {
      if (!file) return
      // 10485760 == 10Mb
      if (file.size > 10485760) {
        return this.$store.dispatch('memos/displayNotificationError', 'Image is too big')
      }
      const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif']
      if (!allowedImageTypes.includes(file.type)) {
        return this.$store.dispatch('memos/displayNotificationError', 'Not allowed image type')
      }
      const reader = new FileReader()
      reader.onload = (ev) => {
        const source = <string>ev.target?.result
        this.$store.dispatch('memos/updateEditedMemoImg', source)
      }
      reader.readAsDataURL(file)
    },
    triggerFileUpload(e) {
      this.uploadFile(e.target.files[0])
    },
    triggerDeleteImage() {
      this.$store.dispatch('memos/setConfirmModalState', {
        isAsking: true,
        message: 'Are you sure you want to delete image of this memo?',
        confirmMethod: () => this.$store.dispatch('memos/updateEditedMemoImg', ''),
      })
    },
    triggerDrop(e) {
      this.triggerDropRelatives(e)
      this.uploadFile(e.dataTransfer.files[0])
      this.triggerDragOut(e)
    },
    triggerDropRelatives(e) {
      e.preventDefault()
      e.stopPropagation()
    },
    triggerDragIn(e) {
      this.triggerDropRelatives(e)
      const el = this.$refs.uploadBtn
      if (el) {
        el.classList.add('active')
      }
    },
    triggerDragOut(e) {
      this.triggerDropRelatives(e)
      const el = this.$refs.uploadBtn
      if (el) {
        el.classList.remove('active')
      }
    }
  },
})
</script>

<template>
  <!--<div id="memo-editor-container" class="px-4 py-5 bg-white space-y-6 sm:p-6 m-auto shadow sm:rounded-md sm:overflow-hidden">-->
  <div id="memo-editor-container">
    <div v-if="!memoDocumentOpenInEditor" id="memo-editor-vacant">
      <p id="new-memo-text">
        Memo Editor is vacant<br />
        Create<br />
        <button
          id="new-memo-btn"
          class="fuller-button white"
          @click="newEditorMemo()"
        >
          New Memo
        </button>
        <br />
        or open existing from collection &rarr;<br />
        ..and fix this fucking box to an <u>unhurt my eyes</u> standard or
        higher
      </p>
    </div>

    <div v-else id="memo-editor-occupied">
      <div v-if="true" id="memo-title-container">
        <input
          id="memo-title"
          v-model="memoTitle"
          type="text"
          name="memo-title"
          placeholder="memo title"
        />
      </div>

      <div>
        <editor id="editor-driver"></editor>
      </div>

      <div v-if="true" id="taxonomy-container">
        <!-- @todo taxonomy -->
        <label id="taxonomy-label">
          <client-only>
            <vue-tags-input
              v-model="tag"
              :tags="memoTaxonomy"
              @tags-changed="(newTags) => (memoTaxonomy = newTags)"
            />
          </client-only>
        </label>
      </div>

      <div v-if="true" id="taxonomy-upload-image">
        <!-- @todo file uploads -->
        <p id="taxonomy-p" class="regular-text">
          Attach files (will be stored as CouchDB document attachments)
        </p>
        <div id="upload-button" class="fuller-button white" ref="uploadBtn"
             @drop="triggerDrop"
             @drag="triggerDropRelatives"
             @dragstart="triggerDropRelatives"
             @dragend="triggerDragOut"
             @dragover="triggerDragIn"
             @dragenter="triggerDragIn"
             @dragleave="triggerDropRelatives"
        >
          <svg
            id="upload-svg"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <label id="upload-label" for="file-upload">
            <p>Upload a file</p>
            <p>or drag and drop</p>
            <p>PNG, JPG, GIF up to 10MB</p>
          </label>
          <input
            id="file-upload"
            name="file-upload"
            type="file"
            class="sr-only"
            @change="triggerFileUpload"
          />
        </div>
        <div id="img-container" v-if="docImg">
          <button id="img-delete-button" type="button" @click="triggerDeleteImage"> X </button>
          <img id="user-input-img" :src="docImg" alt="user input img" />
        </div>
      </div>
      <div id="taxonomy-control-btns">
        <button
          class="fuller-button red"
          @click="
            setConfirmModalState({
              isAsking: true,
              message: 'Are you sure you want to delete this memo?',
              confirmMethod: dropEditorMemo,
            })
          "
        >
          Delete
        </button>
        <button class="fuller-button blue" @click="triggerDiscardCloseButton">
          <span v-if="editorDocumentChanged">Discard</span>
          <span v-else>Close</span>
        </button>
        <button class="fuller-button white" @click="saveEditorMemo()">
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
#memo-editor-container {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow-y: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }

  #memo-editor-vacant {
    //my-1 px-4 py-5 space-y-6 sm:p-6 sm:overflow-hidden object-center
    height: 100%;
    //margin: 1px 0;
    padding: 30% 5px 0;

    #new-memo-text {
      text-align: center;
      margin: 0 50px;
      letter-spacing: 0.2em;
      text-transform: uppercase;

      #new-memo-btn {
        border: solid 2px #fff;
        width: 100%;
        margin-right: 0;
        margin-left: 0;

        //background-color: #00a4db;
        &:hover {
          color: rgba(0, 0, 0, 0.8);
          background-color: #fff;
          box-shadow: inset 0 0 0 rgba(255, 255, 255, 0.3),
            0 0 1.2em rgba(255, 255, 255, 0.5);
        }
      }
    }
  }

  #memo-editor-occupied {
    //height: calc(100vh - 72px);
    #memo-title-container {
      background-color: #000;

      #memo-title {
        width: 100%;
        background-color: #333;
        text-align: center;
      }
    }

    #taxonomy-control-btns {
      display: flex;
      justify-content: space-between;

      button {
        flex: 1;
      }
    }

    #editor-driver {
      //
    }
  }

  #taxonomy-container {
    border: 2px dashed lightgrey;
    border-radius: 5px;
    padding: 10px;

    #taxonomy-label {
      // block text-xs font-medium text-gray-700 mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md
      display: flex;
      justify-content: center;
    }
  }

  #taxonomy-upload-image {
    margin-bottom: 30px;
    text-align: center;
    #taxonomy-p {
      margin-top: 50px;
    }
    #upload-button {
      position: relative;
      text-align: center;
      margin: 30px 60px;
      padding: 0;
      cursor: pointer;
      #upload-label {
        padding: 14px;
        position: relative;
        cursor: pointer;
        display: block;
      }
      #upload-svg {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 30px;
        height: 30px;
      }
    }
    #img-container {
      padding: 0 15px;
      position: relative;
      #img-delete-button {
        position: absolute;
        top: 10px;
        right: 25px;
        background-color: #333;
        width: 25px;
        height: 25px;
        border: solid #fff 1px;
        &:hover {
          background-color: #fff;
          color: #333;
        }
      }
      #user-input-img {
        width: 100%;
      }
    }
  }
}

.fuller-button {
  padding: 0.8em 0;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  -webkit-transition: background-color 0.3s, box-shadow 0.3s, color 0.3s;
  transition: background-color 0.3s, box-shadow 0.3s, color 0.3s;
  box-shadow: inset 0 0 0.8em rgba(255, 255, 255, 0.3),
    0 0 0.8em rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 1);
  background: none;
  border-radius: 0;
  margin: 1em;

  &.blue {
    box-shadow: inset 0 0 1em rgba(0, 170, 170, 0.5),
      0 0 1em rgba(0, 170, 170, 0.5);
    border: #0dd solid 2px;
  }

  &.blue:hover,
  &.blue.active {
    background-color: #0dd;
    box-shadow: inset 0 0 0 rgba(0, 170, 170, 0.5),
      0 0 1.5em rgba(0, 170, 170, 0.7);
  }

  &.red {
    box-shadow: inset 0 0 1em rgba(251, 81, 81, 0.4),
      0 0 1em rgba(251, 81, 81, 0.4);
    border: #fb5454 solid 2px;
  }

  &.red:hover,
  &.red.active{
    background-color: #fb5454;
    box-shadow: inset 0 0 0 rgba(251, 81, 81, 0.4),
      0 0 1.5em rgba(251, 81, 81, 0.6);
  }

  &.white {
    box-shadow: inset 0 0 0.8em rgba(255, 255, 255, 0.3),
      0 0 0.8em rgba(255, 255, 255, 0.3);
    border: #fff solid 2px;
  }

  &.white:hover,
  &.white.active {
    color: rgba(0, 0, 0, 0.8);
    background-color: #fff;
    box-shadow: inset 0 0 0 rgba(255, 255, 255, 0.3),
      0 0 1.2em rgba(255, 255, 255, 0.5);
  }
}

.regular-text {
  color: white;
  font-family: Roboto, Arial, serif;
  text-align: center;
  //font-size: 20px;
  letter-spacing: 2px;
}
</style>
