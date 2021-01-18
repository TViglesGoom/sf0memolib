<template>
  <client-only>
    <notificationGroup class="notif-group" group="appNotifications">
      <div class="notif-container">
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
  top: 20px;
  .notif-container {
    //fixed inset-0 flex px-4 py-6 pointer-events-none p-6 items-start justify-end z-10
    background-color: #fff;
  }
}
</style>
