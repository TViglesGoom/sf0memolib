<template>
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
  },
})
</script>

<style lang="scss" scoped>
#tags-list {
  display: inline-flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  padding: 2px 6px;
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
</style>
