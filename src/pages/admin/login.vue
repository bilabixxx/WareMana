<script setup>
import { db } from '@/firebase/config'; // Importa Firestore dalla tua configurazione esistente
import AuthProvider from '@/views/pages/authentication/AuthProvider.vue';
import authV2LoginIllustration from '@images/pages/auth-v2-login-illustration.png';
import { VNodeRenderer } from '@layouts/components/VNodeRenderer';
import { themeConfig } from '@themeConfig';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; // Importa le funzioni di Firestore
import { VForm } from 'vuetify/components/VForm';

definePage({
  meta: {
    layout: 'blank',
    unauthenticatedOnly: true,
  },
});

const isPasswordVisible = ref(false);
const route = useRoute();
const router = useRouter();
const ability = useAbility();

const errors = ref({
  email: undefined,
  password: undefined,
  general: undefined,
});

const refVForm = ref();
const credentials = ref({
  username: '',
  password: '',
});

const rememberMe = ref(false);
const isLoading = ref(false); // Variabile per gestire lo stato di caricamento

const auth = getAuth(); // Inizializza l'autenticazione da Firebase

const login = async () => {
  isLoading.value = true; // Inizia il caricamento
  try {
    const userCredential = await signInWithEmailAndPassword(auth, credentials.value.username, credentials.value.password);
    const user = userCredential.user;
    const userId = user.uid;

    const adminDocRef = doc(db, "admin", userId);
    const adminDoc = await getDoc(adminDocRef);

    if (adminDoc.exists()) {
      const userAbilityRules = [
        {
          "action": "manage",
          "subject": "all",
        },
      ];

      useCookie('userAbilityRules').value = userAbilityRules;
      ability.update(userAbilityRules);

      useCookie('userData').value = { uid: userId, email: user.email, role: 'admin' };

      await nextTick(() => {
        router.replace(route.query.to ? String(route.query.to) : '/');
      });
    } else {
      throw { status: 401, message: "Unauthorized: You are not an admin" };
    }
  } catch (err) {
    if (err.status === 401) {
      errors.value.general = "Accesso non autorizzato. Non sei un admin.";
    } else {
      errors.value.general = "Errore durante il login. Verifica le credenziali.";
    }
  } finally {
    isLoading.value = false; // Fine del caricamento
  }
};

const onSubmit = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid) login();
  });
};
</script>

<template>
  <!-- Spinner di caricamento sopra l'intera pagina -->
  <VDialog v-model="isLoading" persistent max-width="none" hide-overlay transition="dialog-transition"
    style="z-index: 9999; text-align: center;" class="flex items-center justify-center text-center">
    <VCard flat class="flex items-center justify-center align-center text-center"
      style="background-color: rgba(0, 0, 0, 50%); block-size: 100vh;">
      <VProgressCircular indeterminate color="primary" size="100" />
    </VCard>
  </VDialog>

  <RouterLink to="/">
    <div class="auth-logo d-flex align-center gap-x-2">
      <VNodeRenderer :nodes="themeConfig.app.logo" />
      <h1 class="auth-title">
        {{ themeConfig.app.title }}
      </h1>
    </div>
  </RouterLink>

  <VRow no-gutters class="auth-wrapper bg-surface">
    <VCol md="8" class="d-none d-md-flex">
      <div class="position-relative bg-background w-100 pa-8">
        <div class="d-flex align-center justify-center w-100 h-100">
          <VImg max-width="700" :src="authV2LoginIllustration" class="auth-illustration" />
        </div>
      </div>
    </VCol>

    <VCol cols="12" md="4" class="auth-card-v2 d-flex align-center justify-center">
      <VCard flat :max-width="500" class="mt-12 mt-sm-0 pa-6">
        <VCardText>
          <h4 class="text-h4 mb-1">
            Benvenuto su <span class="text-capitalize"> WareMana </span>👋🏻
          </h4>
          <p class="mb-0">
            Accedi ora
          </p>
        </VCardText>
        <VCardText>
          <VForm ref="refVForm" @submit.prevent="onSubmit">
            <VRow>
              <!-- Username -->
              <VCol cols="12">
                <AppTextField v-model="credentials.username" label="Email" placeholder="Inserisci l'email" type="text"
                  autofocus :rules="[requiredValidator]" />
              </VCol>

              <!-- Password -->
              <VCol cols="12">
                <AppTextField v-model="credentials.password" label="Password" placeholder="············"
                  :rules="[requiredValidator]" :type="isPasswordVisible ? 'text' : 'password'"
                  :error-messages="errors.password" :append-inner-icon="isPasswordVisible ? 'bx-hide' : 'bx-show'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible" />
              </VCol>

              <div v-if="errors.general" class="error-message">{{ errors.general }}</div>

              <!-- Remember Me and Forgot Password -->
              <VCol cols="12">
                <div class="d-flex align-center flex-wrap justify-space-between my-6">
                  <VCheckbox v-model="rememberMe" label="Ricordami" />
                  <RouterLink class="text-primary" :to="{ name: 'forgot-password' }">
                    Password dimenticata?
                  </RouterLink>
                </div>

                <VBtn block type="submit">
                  Login
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>
