<template>
  <header>
    <div id="web-ui-header">
      <div id="right-part">
        <nav>
          <a id="memolib-link">MemoLib ( {{ numOfMemosInCollection }} docs)</a>
        </nav>

        <form @submit.prevent="triggerSearch">
          <div>
            <span>
              <button @click="triggerSearch"></button>
            </span>
            <input
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
    text-align: center;
    align-items: center;
    justify-content: center;
    #logo {
      text-shadow: 0 0 0.9em rgba(255, 255, 255, 1);
      @keyframes flashing {
        0% {
          text-shadow: 0 0 0.9em rgba(255, 255, 255, 0.3);
        }
        3% {
          text-shadow: 0 0 0.9em rgba(255, 255, 255, 1);
        }
        10% {
          text-shadow: 0 0 0.9em rgba(255, 255, 255, 1);
        }
        10.3% {
          text-shadow: 0 0 0.9em rgba(255, 255, 255, 0.3);
        }
        12% {
          text-shadow: 0 0 0.9em rgba(255, 255, 255, 0.3);
        }
        14% {
          text-shadow: 0 0 0.9em rgba(255, 255, 255, 1);
        }
        14.3% {
          text-shadow: 0 0 0.9em rgba(255, 255, 255, 0.3);
        }
        16% {
          text-shadow: 0 0 0.9em rgba(255, 255, 255, 0.3);
        }
        18% {
          text-shadow: 0 0 0.9em rgba(255, 255, 255, 1);
        }
        18.3% {
          text-shadow: 0 0 0.9em rgba(255, 255, 255, 0.3);
        }
        20% {
          text-shadow: 0 0 0.9em rgba(255, 255, 255, 0.3);
        }
        22% {
          text-shadow: 0 0 0.9em rgba(255, 255, 255, 1);
        }
        36% {
          text-shadow: 0 0 0.9em rgba(255, 255, 255, 1);
        }
        36.3% {
          text-shadow: 0 0 0.9em rgba(255, 255, 255, 0.3);
        }
        38% {
          text-shadow: 0 0 0.9em rgba(255, 255, 255, 0.3);
        }
        40% {
          text-shadow: 0 0 0.9em rgba(255, 255, 255, 1);
        }
        76% {
          text-shadow: 0 0 0.9em rgba(255, 255, 255, 1);
        }
        76.3% {
          text-shadow: 0 0 0.9em rgba(255, 255, 255, 0.3);
        }
        78% {
          text-shadow: 0 0 0.9em rgba(255, 255, 255, 0.3);
        }
        80% {
          text-shadow: 0 0 0.9em rgba(255, 255, 255, 1);
        }
        80.3% {
          text-shadow: 0 0 0.9em rgba(255, 255, 255, 0.3);
        }
        82% {
          text-shadow: 0 0 0.9em rgba(255, 255, 255, 0.3);
        }
        84% {
          text-shadow: 0 0 0.9em rgba(255, 255, 255, 1);
        }
        84.3% {
          text-shadow: 0 0 0.9em rgba(255, 255, 255, 0.3);
        }
        86% {
          text-shadow: 0 0 0.9em rgba(255, 255, 255, 1);
        }
        100% {
          text-shadow: 0 0 0.9em rgba(255, 255, 255, 1);
        }
      }

      animation: flashing 6s infinite;
    }
  }

  #right-part {
    display: inline-flex;
    flex: 1;
    justify-content: space-evenly;
    align-items: center;
    #memolib-link {
      margin-right: 20px;
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
