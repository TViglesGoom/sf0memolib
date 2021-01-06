<template>
  <client-only>
    <notificationGroup group="appNotifications">
      <div
        class="fixed inset-0 flex px-4 py-6 pointer-events-none p-6 items-start justify-end z-10"
      >
        <div class="max-w-sm w-full">
          <notification v-slot="{ notifications, close }">
            <div
              class="flex max-w-sm w-full mx-auto bg-white shadow-md rounded-lg overflow-hidden mt-4 z-20"
              v-for="notification in notifications"
              :key="notification.id"
            >
              <notification-info
                :message="notification.text"
                v-if="notification.type === 'info'"
              ></notification-info>
              <notification-success
                :message="notification.text"
                v-if="notification.type === 'success'"
              ></notification-success>
              <notification-error
                :message="notification.text"
                v-if="notification.type === 'error'"
              ></notification-error>
            </div>
          </notification>
        </div>
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
