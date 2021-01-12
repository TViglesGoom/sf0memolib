<template>
  <ul>
    <li v-for="tag in taxonomyList">
      <label :for="tag">
        {{ tag }}
        <input
          :id="tag"
          :key="tag"
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
    }),
  },
  methods: {
    ...mapActions({
      toggleTaxonomy: 'memos/toggleTaxonomy',
      advancedSearchMemoLibrary: 'memos/advancedSearchLib',
    }),
    async triggerTaxonomy(e) {
      this.toggleTaxonomy(e.target.id)
      await this.advancedSearchMemoLibrary()
    },
  },
})
</script>

<!--<style scoped>-->

<!--</style>-->
