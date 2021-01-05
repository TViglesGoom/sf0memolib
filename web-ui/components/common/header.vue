<template>
  <div id="web-ui-header" class="text-gray-700 body-font bg-gray-100 w-screen">
    <div class="container mx-auto flex flex-wrap p-0 flex-col md:flex-row items-center">
      <a class="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
        <span class="ml-3 text-xl">sf0port web-ui</span>
      </a>

      <nav class="md:ml-auto flex flex-wrap items-center text-base justify-center">
        <a class="mr-5 hover:text-gray-900">
          MemoLib ( {{ numOfMemosInCollection }} docs)
        </a>
        <a class="mr-5 hover:text-gray-900">Taxonomy</a>
      </nav>

      <form v-on:submit.prevent="triggerSearch">
        <div class="relative text-gray-600 focus-within:text-gray-400">
          <span class="absolute inset-y-0 left-0 flex items-center pl-2">
            <button @click="triggerSearch"
              class="p-1 focus:outline-none focus:shadow-outline">
              <svg
                fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"
                class="w-6 h-6">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </button>
          </span>
          <input
            v-model="searchTerm"
            type="search" placeholder="keyword search memo library" autocomplete="off"
            class="py-1 text-sm text-white bg-gray-300 rounded-md pl-10 focus:outline-none focus:bg-white focus:text-gray-900">
        </div>
      </form>

    </div>
  </div>
</template>

<style scope="scss" scoped>
#web-ui-header {
  height: auto;
  padding: 10px 0;
}
</style>

<script lang="ts">
import Vue from 'vue'
import { mapActions, mapGetters } from 'vuex'

export default Vue.extend({
  data: () => {
    return {
      searchTerm: '',
    }
  },
  computed: {
    ...mapGetters({
      numOfMemosInCollection: 'memos/memosListLength',
      //numOfSearchResults: 'memos/memosSearchResultsLength',
    })
  },
  methods: {
    ...mapActions({
      loadMemoLibrary: 'memos/reloadLib',
      searchMemoLibrary: 'memos/searchLib',
    }),
    async triggerSearch() {
      if (this.searchTerm.length > 1) { // @todo min number of characters to search
        await this.searchMemoLibrary( this.searchTerm );
      } else {
        await this.loadMemoLibrary();
      }
    }
  }
})
</script>
