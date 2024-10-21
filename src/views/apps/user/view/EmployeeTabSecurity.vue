<script setup>
const isNewPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)


</script>

<template>
  <VRow>
    <VCol cols="12">
      <!-- 👉 Change password -->
      <VCard title="Modifica Password">
        <VCardText>
          <VAlert closable variant="tonal" color="warning" class="mb-4"
            title="Assicurarsi che questi requisiti siano soddisfatti"
            text="La password deve contenere minimo 6 caratteri" />

          <VForm @submit.prevent="() => { }">
            <VRow>
              <VCol cols="12" md="6">
                <AppTextField label="Nuova Password" placeholder="············"
                  :type="isNewPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isNewPasswordVisible ? 'bx-hide' : 'bx-show'"
                  @click:append-inner="isNewPasswordVisible = !isNewPasswordVisible" />
              </VCol>
              <VCol cols="12" md="6">
                <AppTextField label="Conferma Password" placeholder="············"
                  :type="isConfirmPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isConfirmPasswordVisible ? 'bx-hide' : 'bx-show'"
                  @click:append-inner="isConfirmPasswordVisible = !isConfirmPasswordVisible" />
              </VCol>
            </VRow>

            <VBtn type="submit" class="mt-4">
              Cambia Password
            </VBtn>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
