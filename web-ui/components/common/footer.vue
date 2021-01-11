<template>
  <div id="web-ui-footer" class="bg-gray-100">
    <p class="text-xs ml-2">
      Web API: <a :href="WebAPI_URL">{{ WebAPI_URL }}</a>
      <span class="divider">|</span>
      CouchDB Fauxton UI: <a :href="CouchAdminUI_URL">{{CouchAdminUI_URL}}</a>
      <span class="divider">|</span>
      CouchDB collection API: <a :href="CouchDB_API_URL">{{CouchDB_API_URL}}</a>
    </p>
  </div>
</template>

<style lang="scss" scoped>
// @enhance use CouchDB and Fauxton logos (remove one in `~/assets` and use from https://devicon.dev/)
#web-ui-footer {
  height: 36px;
  background-color: #403940;
  color: #fff;
  text-align: center;
  p {
    line-height: 36px;
    a {
      //color: blue;
      :hover {
        text-decoration: underline;
      }
    }
    .divider {
      margin-left: 4px;
      margin-right: 4px;
    }
  }
}
</style>

<script lang="ts">
import Vue from 'vue'

import conf from '../../../app.config.js'
const { defaultCollection } = conf

export default Vue.extend({
  data: () => {
    return {
      WebAPI_URL: `${process.env.API_HOST}:${process.env.API_PORT}/${process.env.API_VERSION}/`,
      CouchAdminUI_URL: `${process.env.COUCHDB_HOST}:${process.env.COUCHDB_PORT}/${process.env.COUCHDB_ADMIN_PREFIX}/`,
      CouchDB_API_URL: `${process.env.COUCHDB_HOST}:${process.env.COUCHDB_PORT}/${defaultCollection}/`,
    }
  },
})
</script>
