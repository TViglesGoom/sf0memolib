<template>
  <div v-if="data.isAsking" id="container">
    <div id="black-bg" />
    <div id="inner-container">
      <h3 id="title" class="regular-text">{{ data.message }}</h3>
      <div id="btn-container">
        <button
          id="confirm-btn"
          class="fuller-button white"
          @click="
            () => {
              data.confirmMethod()
              clearData()
            }
          "
        >
          Confirm
        </button>
        <button
          id="cancel-btn"
          class="fuller-button red"
          @click="
            () => {
              data.cancelMethod()
              clearData()
            }
          "
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'

export default Vue.extend({
  computed: {
    ...mapGetters({
      data: 'memos/confirmModalState',
    }),
  },
  methods: {
    ...mapActions({
      clearData: 'memos/setConfirmModalState',
    }),
  },
})
</script>

<style lang="scss" scoped>
#container {
  z-index: 10;
  #black-bg {
    //z-index: -1;
    position: absolute;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    background-color: rgba(51, 51, 51, 0.5);
  }
  #inner-container {
    padding: 20px;
    position: absolute;
    top: 20%;
    left: 50%;
    transform: translateX(-50%);
    background-color: #333;
    box-shadow: inset 0 0 1em rgba(0, 170, 170, 0.5),
    0 0 1em rgba(0, 170, 170, 0.5);
    border: #0dd solid 1px;
    border-radius: 0;

    #title {
      margin-bottom: 20px;
      max-width: 360px;
    }
    #btn-container {
      display: flex;
      justify-content: space-between;
      .fuller-button {
        font-size: 14px;
        letter-spacing: 4px;
        padding: 8px 16px;
      }
    }
  }
}
</style>
