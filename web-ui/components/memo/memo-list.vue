<template>
  <div id="memo-list" class="text-gray-900 overflow-y-scroll overscroll-y-contain overflow-x-none container">
    <!-- @enhance: add "active" styling for when document is open for editing -->
    <div
      @click="openMemo(memo['_id'])" :id="`memo-list-item-${memo['_id']}`"
      v-for="memo in memosList" :key="memo._id" :title="`Open document in memo editor`"
      class="memo-list-item inline-block border-b border-light-blue-400 flex justify-between items-center shadow mx-1 my-1 cursor-pointer hover:bg-gray-100 bg-gray-50">

      <div class="flex items-start w-6/10">
        <div class="memo-list-item-icon mr-3 p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="gray"
            class="rounded-full h-12 w-12 m-auto"
          >
            <path
              stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <div class="memo-list-item-info flex-1 overflow-hidden">
          <div class="memo-list-item-info-stats">
            <span class="stats-readout text-gray-700 text-xs">
              <span class="readout-label">wc -l: </span>
              <span class="readout-value">{{memo.stats['wc -l']}}</span>
            </span>
            <span class="stats-divider text-gray-400"> | </span>
            <span class="stats-readout text-gray-700 text-xs">
              <span class="readout-label">tags: </span>
              <span class="readout-value">
                <!--{{memo.stats['tags #']}}-->
                {{memo.stats['tags']}}
              </span>
            </span>
            <span class="stats-divider text-gray-400" v-if="false"> | </span>
            <span class="stats-readout text-gray-700 text-xs"  v-if="false">
              <span class="readout-label">created: </span>
              <span class="readout-value">00:00:00<!-- @todo --></span>
            </span>
            <span class="stats-divider text-gray-400" v-if="false"> | </span>
            <span class="stats-readout text-gray-700 text-xs" v-if="false">
              <span class="readout-label">updated: </span>
              <span class="readout-value">00:00:00<!-- @todo --></span>
            </span>
          </div>
          <p class="memo-list-item-info-metadata-line text-gray-700 text-xs">
            <span class="metadata-line-label">src: </span>
            <span class="metadata-line-value">{{ memo.source }}</span>
          </p>
          <p class="memo-list-item-info-metadata-line text-gray-700 text-xs">
            <span class="metadata-line-label">_id: </span>
            <span class="metadata-line-value">{{ memo._id }}</span>
          </p>
          <p class="memo-list-item-info-metadata-line text-gray-700 text-xs">
            <span class="metadata-line-label">_rev: </span>
            <span class="metadata-line-value">{{ memo._rev }}</span>
          </p>
        </div>
      </div>
      <p class="memo-list-item-title w-4/10 text-right text-gray-700 text-sm mr-2">{{ memo.title }}</p>

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
  </div>
</template>

<style lang="scss" scoped>
#memo-list {
  height: calc(100vh - 72px);

  .memo-list-item {
    font-size: 0.76em;
    .memo-list-item-icon {
      opacity: .4;
    }
    .memo-list-item-info {
      .memo-list-item-info-stats {
        span.stats-readout {
          span.readout-label {
            font-style: normal;
            opacity: .8;
          }
          span.readout-value {
            font-weight: normal;
            font-family: 'Courier New', Courier, monospace;
          }
        }
        span.stats-divider {
          // todo
        }
      }
      .memo-list-item-info-metadata-line {
        .metadata-line-label {
          font-style: normal;
          opacity: .8;
          display: inline-block;
          min-width: 36px;
        }
        .metadata-line-value {
          font-weight: normal;
          font-family: 'Courier New', Courier, monospace;
        }
      }
    }
    .memo-list-item-title {
      font-family: 'Courier New', Courier, monospace;
    }
  }
}
</style>

<script lang="ts">
// @todo fix typescript
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';

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
        'w-6', 'h-6'
      ]
    }
  },
  // @ref: https://github.com/davidroyer/nuxt-api-example/blob/master/components/Header.vue
  computed: {
    ...mapGetters({
      memosList: 'memos/memosList',
    })
  },
  methods: {
    ...mapActions({
      openMemo: 'memos/openMemoInEditor',
      saveMemo: 'memos/saveMemoInEditor',
      deleteMemo: 'memos/deleteMemo',
    })
  }
});
</script>
