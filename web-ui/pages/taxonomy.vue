<template>
  <!-- @todo dual-col -->
  <article class="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto">
    <h1>{{ page.title }}</h1>
    <nuxt-content :document="page"></nuxt-content>
  </article>
</template>

<script lang="ts">
import Vue from 'vue'
//import DualColComponent from '@/components/dualcol.vue';

export default Vue.extend({
  //components: {
  //  'dual-col': DualColComponent,
  //},
  async asyncData ({ $content }) {
    const page = await $content('hello').fetch()

    return {
      page
    }
  }
})
</script>

<style lang="scss">
#taxonomy-manager-container {
  margin: 0;
  padding: 0;
  height: 100vh;
  width: 800px;
  border: 1px solid red;
}
</style>
