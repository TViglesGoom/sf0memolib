<template>
  <client-only>
    <notificationGroup class="notif-group" group="appNotifications">
      <div>
        <notification v-slot="{ notifications }">
          <div
            v-for="notification in notifications"
            :key="notification.id"
            class=""
          >
            <notification-info
              v-if="notification.type === 'info'"
              :message="notification.text"
            ></notification-info>
            <notification-success
              v-if="notification.type === 'success'"
              :message="notification.text"
            ></notification-success>
            <notification-error
              v-if="notification.type === 'error'"
              :message="notification.text"
            ></notification-error>
          </div>
        </notification>
      </div>
    </notificationGroup>
  </client-only>
</template>

<script lang="ts">
import Vue from 'vue'

import NotificationInfo from '@/components/notifications/notification-info.vue'
import NotificationSuccess from '@/components/notifications/notification-success.vue'
import NotificationError from '@/components/notifications/notification-error.vue'

export default Vue.extend({
  components: {
    NotificationInfo,
    NotificationSuccess,
    NotificationError,
  },
})
</script>

<style lang="scss">
.notif-group {
  position: absolute;
  right: 20px;
  top: 80px;
  z-index: 10;
  .notification-container {
    //fixed inset-0 flex px-4 py-6 pointer-events-none p-6 items-start justify-end z-10
    padding: 10px;
    display: flex;
    align-items: center;
    column-gap: 8px;
    width: 300px;
    margin-bottom: 10px;
    .notification-message {
      word-break: break-all;
      color: #fff;
    }
    .notification-icon-container {
      width: 40px;
      .notification-icon {
        //height: 40px;
        fill: #fff;
      }
    }
  }
}
</style>
