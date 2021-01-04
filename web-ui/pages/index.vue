<template>
  <div id="horizon" class="h-screen w-screen">
    <app-notification-group class="z-0 absolute"></app-notification-group>

    <header-component></header-component>

    <div id="web-ui-main" class="grid grid-cols-2 gap-4">

      <div id="web-ui-left-col" class="relative h-full">
        <memo-editor></memo-editor>
      </div>
      <div id="web-ui-right-col" class="relative h-full">
        <memo-list></memo-list>
      </div>
    </div>

    <footer-component></footer-component>
  </div>
</template>

<style lang="scss" scoped>
#horizon {
  // @ref: https://www.heropatterns.com/
  background-color: #e2e5db;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%2392a9ac' fill-opacity='1' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E");
  #web-ui-main {
    height: calc(100vh - 72px);
    #web-ui-left-col {
      //border: 1px solid gray;
    }
    #web-ui-right-col {
      //border: 1px solid gray;
    }
  }
}
</style>

<script lang="ts">
import Vue from 'vue'
import { mapActions, mapGetters } from 'vuex'

import NotificationGroup from '@/components/notifications/notification-group.vue';
import HeaderComponent from '@/components/common/header.vue';
import FooterComponent from '@/components/common/footer.vue';
import MemoEditorComponent from '@/components/memo/memo-editor.vue';
import MemoListComponent from '@/components/memo/memo-list.vue';
import MemoViewerComponent from '@/components/memo/memo-viewer.vue';
import TaxonomyManagerComponent from '@/components/taxonomy/taxonomy-manager.vue';

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
    })
  },
  methods: {
    ...mapActions({
      loadMemoLibrary: 'memos/reloadLib',
      editMemo: 'memos/openMemoInEditor',
    }),
  },

  async mounted() {
    await this.loadMemoLibrary();
  }
})
</script>
