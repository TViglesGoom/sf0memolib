<template>
  <div id="horizon">
    <confirm />
    <app-notification-group class="z-0 absolute"></app-notification-group>

    <header-component></header-component>

    <div id="web-ui-main">
      <div id="web-ui-left-col">
        <memo-editor />
      </div>
      <div id="web-ui-right-col">
        <memo-list />
      </div>
      <!--      <div id="web-ui-right-col"></div>-->
      <div v-if="isAdvancedSearch" id="memo-filter">
        <memo-filter />
      </div>
    </div>

    <footer-component></footer-component>
  </div>
</template>

<style lang="scss" scoped>
@import url('http://fonts.googleapis.com/css?family=Roboto');

#horizon {
  // @ref: https://www.heropatterns.com/
  position: relative;
  font-family: Roboto, Arial, serif;
  display: flex;
  height: 100vh;
  flex-flow: column;
  background-color: #333;

  #web-ui-main {
    display: inline-flex;
    flex: auto;

    #web-ui-left-col {
      position: relative;
      flex: 2;
      padding: 4px 16px;
      border-right: solid 1px #fff;
      color: #fff;
      height: 100%;
    }

    #web-ui-right-col {
      position: relative;
      flex: 2;
      height: 100%;
      padding: 12px;
    }
    #memo-filter {
      position: relative;
      flex: 1;
      border-left: solid 1px white;
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
import Confirm from '@/components/common/confirm.vue'
import MemoEditorComponent from '@/components/memo/memo-editor.vue'
import MemoListComponent from '@/components/memo/memo-list.vue'
import MemoViewerComponent from '@/components/memo/memo-viewer.vue'
import TaxonomyManagerComponent from '@/components/taxonomy/taxonomy-manager.vue'
import MemoFilter from '@/components/memo/memo-filter.vue'

export default Vue.extend({
  components: {
    'app-notification-group': NotificationGroup,
    'header-component': HeaderComponent,
    'footer-component': FooterComponent,
    'memo-editor': MemoEditorComponent,
    'memo-viewer': MemoViewerComponent,
    'memo-list': MemoListComponent,
    confirm: Confirm,
    'taxonomy-manager': TaxonomyManagerComponent,
    'memo-filter': MemoFilter,
  },
  computed: {
    ...mapGetters({
      memosList: 'memos/memosList',
      isAdvancedSearch: 'memos/isAdvancedSearch',
      state: 'memos/confirmModalState',
    }),
  },
  async mounted() {
    await this.loadMemoLibrary()
  },
  methods: {
    ...mapActions({
      loadMemoLibrary: 'memos/reloadLib',
      editMemo: 'memos/openMemoInEditor',
      setData: 'memos/setConfirmModalState'
    }),
  },
})
</script>
