<template xmlns="http://www.w3.org/1999/html">
  <div id="filter-component">
    <div id="sort-component">
      <select id="sort-method" :value="sortMethod" @change="triggerSort">
        <option value="title">title</option>
        <option value="created_at">created_at</option>
        <option value="updated_at">updated_at</option>
        <option value="lines_count">lines count</option>
        <option value="content_size">content size</option>
        <option value="has_attachment">has attachment</option>
      </select>
      <input id="up-input" v-model="isSortUp" type="checkbox" />
      <label for="up-input">
        <svg
          id="arrow"
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          viewBox="0 0 292.362 292.362"
          xml:space="preserve"
          style="enable-background:new 0 0 292.362 292.362;"
        >
          <g>
            <path
              d="M286.935,69.377c-3.614-3.617-7.898-5.424-12.848-5.424H18.274c-4.952,0-9.233,1.807-12.85,5.424
            C1.807,72.998,0,77.279,0,82.228c0,4.948,1.807,9.229,5.424,12.847l127.907,127.907c3.621,3.617,7.902,5.428,12.85,5.428
            s9.233-1.811,12.847-5.428L286.935,95.074c3.613-3.617,5.427-7.898,5.427-12.847C292.362,77.279,290.548,72.998,286.935,69.377z"
            />
          </g>
        </svg>
      </label>
    </div>
    <ul id="tags-list">
      <li v-for="tag in taxonomyList" :key="tag">
        <label
          :for="tag"
          :class="`tags-list-item ${
            activeTaxonomyList.indexOf(tag) !== -1 ? 'active' : ''
          }`"
        >
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
      sortMethod: 'memos/sortMethod',
    }),
    isSortUp: {
      set(value) {
        this.$store.dispatch('memos/setIsSortUp', value)
      },
      get() {
        return this.$store.getters['memos/isSortUp']
      },
    },
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
      this.$store.dispatch('memos/setSortMethod', e.target.value)
    },
  },
})
</script>

<style lang="scss" scoped>
#filter-component {
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
  #sort-component {
    display: flex;
    justify-content: center;
    align-items: center;
    column-gap: 8px;
    border-bottom: solid #fff 1px;
    padding: 6px;
    #sort-method {
      color: #fff;
      background-color: #333;
      cursor: pointer;

      &:hover {
        background-color: #fff;
        color: #333;
        border-color: #0dd;
      }
    }
    #arrow {
      width: 15px;
      height: 15px;
      fill: #fff;
    }
    #up-input {
      display: none;
      &:checked + label {
        transform: rotateX(180deg);
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
