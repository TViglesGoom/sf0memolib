<template>
  <div id="filter-component">
    <ul id="sort-list">
      <li class="sort-item">
        <label for="created_at">
          created_at
          <input id="created_at" type="checkbox" @change="triggerSort"/>
        </label>
        <label for="updated_at">
          updated_at
          <input id="updated_at" type="checkbox" @change="triggerSort"/>
        </label>
      </li>
    </ul>
    <ul id="tags-list">
      <li v-for="tag in taxonomyList" :key="tag">
        <label :for="tag" :class="`tags-list-item ${activeTaxonomyList.indexOf(tag) !== -1 ? 'active' : ''}`">
          {{ tag }}
          <input
            :id="tag"
            :key="tag"
            class="tags-input"
            type="checkbox"
            :checked="activeTaxonomyList.indexOf(tag) !== -1"
            @change="triggerTaxonomy"
          />
        </label>
      </li>
    </ul>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapActions, mapGetters } from 'vuex'
export default Vue.extend({
  computed: {
    ...mapGetters({
      taxonomyList: 'memos/taxonomyList',
      activeTaxonomyList: 'memos/activeTaxonomyList',
      isAdvancedSearch: 'memos/isAdvancedSearch',
    }),
  },
  methods: {
    ...mapActions({
      toggleTaxonomy: 'memos/toggleTaxonomy',
      advancedSearchMemoLibrary: 'memos/advancedSearchLib',
    }),
    async triggerTaxonomy(e) {
      e.target.closest('.tags-list-item').classList.toggle('active')
      this.toggleTaxonomy(e.target.id)
      await this.advancedSearchMemoLibrary()
    },
    triggerSort(e) {
      this.$store.dispatch('memos/sortMemosBy', {
        fieldToSort: e.target.id,
        isSortingUp: e.target.checked,
      })
    }
  },
})
</script>

<style lang="scss" scoped>
#filter-component {
  padding: 2px 6px;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  overflow-y: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
  #tags-list {
    display: inline-flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    align-content: flex-start;
    .tags-list-item {
      display: block;
      cursor: pointer;
      user-select: none;
      color: #fff;
      border: solid 1px white;
      padding: 2px 6px;
      margin: 8px 3px;
      &.active {
        background-color: #fff;
        color: #000;
      }
      .tags-input {
        display: none;
      }
    }
  }
}
</style>
