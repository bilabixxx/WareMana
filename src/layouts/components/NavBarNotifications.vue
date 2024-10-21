<script setup>
import avatar4 from '@images/avatars/avatar-4.png';
import avatar5 from '@images/avatars/avatar-5.png';

const notifications = ref([
  {
    id: 1,
    img: avatar4,
    title: 'Report settimanale',
    subtitle: 'Il report settimanale è pronto per essere analizzato',
    time: 'Adesso',
    isSeen: true,
  },
  {
    id: 2,
    text: 'Richiesta permesso ferie',
    title: 'Mario Rossi ha richiesto un permesso ferie',
    time: '2 ore fa',
    isSeen: false,
  },
  {
    id: 3,
    img: avatar5,
    title: 'Nuovo messaggio👋🏻',
    subtitle: 'Hai ricevuto un nuovo messaggio da Maria',
    time: '3 ore fa',
    isSeen: true,
  },
  // {
  //   id: 4,
  //   img: paypal,
  //   title: 'PayPal',
  //   subtitle: 'Received Payment',
  //   time: '25 May',
  //   isSeen: false,
  //   color: 'error',
  // },
  // {
  //   id: 5,
  //   img: avatar3,
  //   title: 'Received Order 📦',
  //   subtitle: 'New order received from john',
  //   time: '19 Mar',
  //   isSeen: true,
  // },
])

const removeNotification = notificationId => {
  notifications.value.forEach((item, index) => {
    if (notificationId === item.id)
      notifications.value.splice(index, 1)
  })
}

const markRead = notificationId => {
  notifications.value.forEach(item => {
    notificationId.forEach(id => {
      if (id === item.id)
        item.isSeen = true
    })
  })
}

const markUnRead = notificationId => {
  notifications.value.forEach(item => {
    notificationId.forEach(id => {
      if (id === item.id)
        item.isSeen = false
    })
  })
}

const handleNotificationClick = notification => {
  if (!notification.isSeen)
    markRead([notification.id])
}
</script>

<template>
  <Notifications :notifications="notifications" @remove="removeNotification" @read="markRead" @unread="markUnRead"
    @click:notification="handleNotificationClick" />
</template>
