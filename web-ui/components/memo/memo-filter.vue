<template xmlns="http://www.w3.org/1999/html">
  <div id="filter-component">
    <ul id="sort-list">
      <li :class="`sort-item ${sortingValues.fieldToSort === 'created_at' ? 'active' : ''}`">
        <label class="sort-label" for="created_at">
          <span>created_at </span>
          <input id="created_at" type="checkbox" class="sort-input" @change="triggerSort" />
          <span class="arrow-down">&#8595;</span>
        </label>
      </li>
      <li :class="`sort-item ${sortingValues.fieldToSort === 'updated_at' ? 'active' : ''}`">
        <label class="sort-label" for="updated_at">
          <span>updated_at </span>
          <input id="updated_at" type="checkbox" class="sort-input" @change="triggerSort" />
          <span class="arrow-down">&#8595;</span>
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
      sortingValues: 'memos/sortingValues',
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
      this.$store.dispatch('memos/setSort', {
        fieldToSort: e.target.id,
        isSortingUp: e.target.checked,
      })
      this.$store.dispatch('memos/sortMemosBy')
    },
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
  #sort-list {
    padding: 5px;
    color: #fff;
    display: flex;
    flex-wrap: wrap;
    border-bottom: solid #fff 1px;
    justify-content: space-around;
    align-content: center;
    .sort-item {
      border: solid #fff 1px;
      padding: 0 16px;
      line-height: 30px;
      margin-bottom: 10px;
      cursor: pointer;
      &.active {
        background-color: #0dd;
        color: #333;
      }
      &:hover {
        background-color: #fff;
        color: #333;
        border-color: #0dd;
      }
      .sort-label {
        cursor: pointer;
        .arrow-down {
          display: inline-block;
          transform: scale(1.3);
        }
        .sort-input {
          display: none;
          position: relative;
          &:checked + .arrow-down {
            transform: rotateX(180deg) scale(1.3);
          }
        }
      }
    }
  }
  #tags-list {
    display: flex;
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
        background-color: #0dd;
        color: #333;
      }
      &:hover {
        background-color: #fff;
        color: #333;
        border-color: #0dd;
      }
      .tags-input {
        display: none;
      }
    }
  }
}
</style>
