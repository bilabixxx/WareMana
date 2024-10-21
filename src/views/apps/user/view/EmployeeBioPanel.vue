<script setup>
import { ref } from 'vue';

// Definisci i props per ricevere i dati dell'utente
const props = defineProps({
  userData: {
    type: Object,
    required: true
  }
})

const userTab = ref(null)

// Funzione per ottenere l'avatar (iniziali dell'utente)
const avatarText = (fullName) => {
  return fullName.split(' ').map((n) => n[0]).join('')
}

// Funzione per risolvere il ruolo dell'utente
const resolveUserRoleVariant = role => {
  if (role === 'subscriber')
    return {
      color: 'warning',
      icon: 'bx-user',
    }
  if (role === 'author')
    return {
      color: 'success',
      icon: 'bx-check-circle',
    }
  if (role === 'maintainer')
    return {
      color: 'primary',
      icon: 'bx-pie-chart-alt',
    }
  if (role === 'editor')
    return {
      color: 'info',
      icon: 'bx-pencil',
    }
  if (role === 'admin')
    return {
      color: 'secondary',
      icon: 'bx-server',
    }

  return {
    color: 'primary',
    icon: 'bx-user',
  }
}
</script>
<template>
  <VRow>
    <!-- SECTION User Details -->
    <VCol cols="12">
      <VCard>
        <VCardText class="text-center pt-12">
          <!-- 👉 Avatar -->
          <VAvatar rounded :size="120" :color="!props.userData.avatar ? 'primary' : undefined"
            :variant="!props.userData.avatar ? 'tonal' : undefined">
            <VImg v-if="props.userData.avatar" :src="props.userData.avatar" />
            <span v-else class="text-5xl font-weight-medium">
              {{ avatarText(props.userData.name) }}
            </span>
          </VAvatar>

          <!-- 👉 User fullName -->
          <h5 class="text-h5 mt-4">
            {{ props.userData.name }} {{ props.userData.surname }}
          </h5>

          <!-- 👉 Role chip -->
          <VChip label :color="resolveUserRoleVariant(props.userData.role).color" size="small"
            class="text-capitalize mt-4">
            {{ props.userData.role }}
          </VChip>
        </VCardText>

        <VCardText>
          <!-- 👉 Details -->
          <h5 class="text-h5">
            Dettagli
          </h5>

          <VDivider class="my-4" />

          <!-- 👉 User Details list -->
          <VList class="card-list mt-2">
            <VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  Email:
                  <div class="d-inline-block text-body-1">
                    {{ props.userData.email }}
                  </div>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  Settore:
                  <span class="text-body-1 d-inline-block">
                    {{ props.userData.role }}
                  </span>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  Stato:
                  <div class="d-inline-block text-body-1 text-capitalize">
                    {{ props.userData.status }}
                  </div>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  Telefono:
                  <div class="d-inline-block text-capitalize text-body-1">
                    {{ props.userData.mobilePhone || 'N/A' }}
                  </div>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  Indirizzo:
                  <div class="d-inline-block text-body-1">
                    {{ props.userData.address?.street || '' }}, {{ props.userData.address?.zipCode || '' }} {{
                      props.userData.address?.city || 'N/A' }}
                  </div>
                </h6>
              </VListItemTitle>
            </VListItem>
          </VList>
        </VCardText>

        <!-- 👉 Edit and Suspend button -->
        <VCardText class="d-flex justify-center gap-x-4">
          <VBtn variant="elevated" @click="isUserInfoEditDialogVisible = true">
            Modifica
          </VBtn>

          <VBtn variant="tonal" color="error">
            Disattiva
          </VBtn>
        </VCardText>
      </VCard>
    </VCol>
    <!-- !SECTION -->
  </VRow>

  <!-- 👉 Edit user info dialog -->
  <UserInfoEditDialog v-model:isDialogVisible="isUserInfoEditDialogVisible" :user-data="props.userData" />

  <!-- 👉 Upgrade plan dialog -->
  <UserUpgradePlanDialog v-model:isDialogVisible="isUpgradePlanDialogVisible" />
</template>
