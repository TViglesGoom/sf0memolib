<template>
  <div id="memo-list">
    <!-- @enhance: add "active" styling for when document is open for editing -->
    <div
      v-for="memo in memosList"
      :id="`memo-list-item-${memo['_id']}`"
      :key="memo._id"
      :title="`Open document in memo editor`"
      @click="openMemo(memo['_id'])"
    >
<!--      <div>-->
        <!--        <div class="memo-list-item-icon mr-3 p-2">-->
        <!--          <svg-->
        <!--            xmlns="http://www.w3.org/2000/svg"-->
        <!--            fill="none"-->
        <!--            viewBox="0 0 24 24"-->
        <!--            stroke="gray"-->
        <!--            class="rounded-full h-12 w-12 m-auto"-->
        <!--          >-->
        <!--            <path-->
        <!--              stroke-linecap="round"-->
        <!--              stroke-linejoin="round"-->
        <!--              stroke-width="1"-->
        <!--              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"-->
        <!--            />-->
        <!--          </svg>-->
        <!--        </div>-->
        <div id="doc-info">
          <div>
            <p>{{ memo.title }}</p>
            <span v-if="false"> | </span>
            <span v-if="false">
              <span class="readout-label">created: </span>
              <span class="readout-value">00:00:00<!-- @todo --></span>
            </span>
            <span v-if="false"> | </span>
            <span v-if="false">
              <span class="readout-label">updated: </span>
              <span class="readout-value">00:00:00<!-- @todo --></span>
            </span>
          </div>
          <p>
            <span>src: </span>
            <span>{{ memo.source }}</span>
          </p>
          <span>
            <span>wc -l: </span>
            <span>{{ memo.stats['wc -l'] }}</span>
          </span>
          <span> | </span>
          <span>
            <span class="readout-label">tags: </span>
            <span class="readout-value">
              <!--{{memo.stats['tags #']}}-->
              {{ memo.stats['tags'] }}
            </span>
          </span>
          <!--          <p>-->
          <!--            <span>_id: </span>-->
          <!--            <span>{{ memo._id }}</span>-->
          <!--          </p>-->
          <!--          <p>-->
          <!--            <span>_rev: </span>-->
          <!--            <span>{{ memo._rev }}</span>-->
          <!--          </p>-->
        </div>
      </div>

      <!--<button
        @click="openMemo(memo['_id'])" :title="`Edit MEMO:\n{\n\t_id: ${memo._id}\n\t_rev: ${memo._id}\n}`"
        :class="ctrlButtonClassList">
        <svg class="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
            />
        </svg>
      </button>-->
      <!--<button
        @click="saveMemo()" :title="`Save changes to MEMO:\n{\n\t_id: ${memo._id}\n\t_rev: ${memo._id}\n}`"
        :class="ctrlButtonClassList">
        <svg class="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z"
          />
        </svg>
      </button>-->
      <!--<button
        @click="deleteMemo(memo['_id'])" :title="`PERMANENTLY(!) delete MEMO:\n{\n\t_id: ${memo._id}\n\t_rev: ${memo._id}\n}`"
        :class="ctrlButtonClassList">
        <svg class="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
          />
        </svg>
      </button>-->
    </div>
<!--  </div>-->
</template>

<style lang="scss" scoped>
#memo-list {
  position: relative;
  height: 100%;
  table-layout: fixed;
  overflow-y: scroll;
  padding-right: 20px;
  max-height: inherit;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
  #doc-info {
    position: relative;
    z-index: 1;
    top: 10px;
    left: 10px;
    color: #fff;
    font-family: Roboto, Arial, serif;
    cursor: pointer;
    border: solid 1px #fff;
    padding: 6px 10px;
    margin-bottom: 10px;
  }
}
</style>

<script lang="ts">
// @todo fix typescript
import Vue from 'vue'
import { mapActions, mapGetters } from 'vuex'

export default Vue.extend({
  data: () => {
    return {
      ctrlButtonClassList: [
        'bg-olive-100',
        'hover:bg-olive-400',
        'focus:outline-none',
        'focus:ring-1',
        'focus:ring-purple-100',
        'focus:ring-opacity-50',
        'justify-center',
        'py-2',
        'px-4',
        'border',
        'border-transparent',
        'shadow-sm',
        'text-xs',
        'font-medium',
        'rounded-md',
        'text-grey-900',
        'w-6',
        'h-6',
      ],
    }
  },
  // @ref: https://github.com/davidroyer/nuxt-api-example/blob/master/components/Header.vue
  computed: {
    ...mapGetters({
      memosList: 'memos/memosList',
    }),
  },
  methods: {
    ...mapActions({
      openMemo: 'memos/openMemoInEditor',
      saveMemo: 'memos/saveMemoInEditor',
      deleteMemo: 'memos/deleteMemo',
    }),
  },
})
</script>
