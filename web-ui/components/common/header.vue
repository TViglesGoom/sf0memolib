<template>
  <header>
    <div id="web-ui-header">
      <div id="left-part">
        <nav>
          <a id="memolib-link">MemoLib ( {{ numOfMemosInCollection }} docs)</a>
        </nav>
      </div>
      <div id="right-part">
        <form @submit.prevent="triggerSearch">
          <div>
            <span>
              <button @click="triggerSearch"></button>
            </span>
            <input
              id="search"
              v-model="searchTerm"
              type="search"
              placeholder="keyword search memo library"
              autocomplete="off"
            />
          </div>
        </form>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
#web-ui-header {
  display: flex;
  width: 100%;
  height: auto;
  padding: 14px 0;
  background-color: #403940;
  color: #fff;

  #left-part {
    flex: 1;
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }

  #right-part {
    display: inline-flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    #memolib-link {
      margin-right: 20px;
    }
    #search {
      background-color: transparent;
      border: solid 1px #fff;
      width: 400px;
      &:focus {
        -webkit-box-shadow: none;
        box-shadow: inset 0 0 0.8em rgba(255, 255, 255, 0.3),
          0 0 0.8em rgba(255, 255, 255, 0.3);
      }
    }
  }
}
</style>

<script lang="ts">
import Vue from 'vue'
import {mapActions, mapGetters} from 'vuex'

export default Vue.extend({
  data: () => {
    return {
      searchTerm: '',
    }
  },
  computed: {
    ...mapGetters({
      numOfMemosInCollection: 'memos/memosListLength',
      // numOfSearchResults: 'memos/memosSearchResultsLength',
    }),
  },
  methods: {
    ...mapActions({
      loadMemoLibrary: 'memos/reloadLib',
      searchMemoLibrary: 'memos/searchLib',
    }),
    async triggerSearch() {
      if (this.searchTerm.length > 1) {
        // @todo min number of characters to search
        await this.searchMemoLibrary(this.searchTerm)
      } else {
        await this.loadMemoLibrary()
      }
    },
  },
})
</script>
