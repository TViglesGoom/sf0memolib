<template>
  <div id="horizon">
    <app-notification-group class="z-0 absolute"></app-notification-group>

    <header-component></header-component>

    <div id="web-ui-main">
      <div id="web-ui-left-col">
        <memo-editor></memo-editor>
      </div>
      <div id="web-ui-right-col">
        <memo-list></memo-list>
      </div>
      <!--      <div id="web-ui-right-col"></div>-->
    </div>

    <footer-component></footer-component>
  </div>
</template>

<style lang="scss" scoped>
@import url('http://fonts.googleapis.com/css?family=Roboto');
#horizon {
  // @ref: https://www.heropatterns.com/
  font-family: Roboto, Arial, serif;
  display: flex;
  height: 100vh;
  flex-flow: column;
  background-color: #4a4443;
  #web-ui-main {
    display: inline-flex;
    flex: auto;
    #web-ui-left-col {
      padding: 4px 16px;
      border-right: solid 1px #fff;
      color: #fff;
      flex: 1;
      height: 100%;
      background-color: #333;
    }
    #web-ui-right-col {
      padding: 12px;
      flex: 1;
      height: 100%;
      background-color: #333;
    }
  }
}
</style>

<script lang="ts">
import Vue from 'vue'
import { mapActions, mapGetters } from 'vuex'

import NotificationGroup from '@/components/notifications/notification-group.vue'
import HeaderComponent from '@/components/common/header.vue'
import FooterComponent from '@/components/common/footer.vue'
import MemoEditorComponent from '@/components/memo/memo-editor.vue'
import MemoListComponent from '@/components/memo/memo-list.vue'
import MemoViewerComponent from '@/components/memo/memo-viewer.vue'
import TaxonomyManagerComponent from '@/components/taxonomy/taxonomy-manager.vue'

export default Vue.extend({
  components: {
    'app-notification-group': NotificationGroup,
    'header-component': HeaderComponent,
    'footer-component': FooterComponent,
    'memo-editor': MemoEditorComponent,
    'memo-viewer': MemoViewerComponent,
    'memo-list': MemoListComponent,
    'taxonomy-manager': TaxonomyManagerComponent,
  },
  computed: {
    ...mapGetters({
      memosList: 'memos/memosList',
    }),
  },
  methods: {
    ...mapActions({
      loadMemoLibrary: 'memos/reloadLib',
      editMemo: 'memos/openMemoInEditor',
    }),
  },

  async mounted() {
    await this.loadMemoLibrary()
  },
})
</script>
