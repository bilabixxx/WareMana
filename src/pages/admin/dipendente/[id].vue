<script setup>
import { db } from '@/firebase/config'; // Assicurati che questo punti alla tua configurazione Firebase
import EmployeeBioPanel from '@/views/apps/user/view/EmployeeBioPanel.vue';
import EmployeeTabAccount from '@/views/apps/user/view/EmployeeTabAccount.vue';
import EmployeeTabDocuments from '@/views/apps/user/view/EmployeeTabDocuments.vue';
import EmployeeTabSecurity from '@/views/apps/user/view/EmployeeTabSecurity.vue';
import { doc, getDoc } from 'firebase/firestore';
import { onMounted, ref } from 'vue';

const route = useRoute('dipendente-id');
const userTab = ref(null);
const userData = ref(null); // Inizializza userData come null per gestire il caricamento
const isLoading = ref(true); // Aggiungi variabile per il caricamento

// Recupera l'utente da Firestore usando l'ID della rotta
const fetchUserData = async (userId) => {
  try {
    const userDocRef = doc(db, 'employees', userId); // Puntiamo alla collezione 'employees'
    const userSnapshot = await getDoc(userDocRef);

    if (userSnapshot.exists()) {
      userData.value = userSnapshot.data(); // Popola userData con i dati ottenuti
    } else {
      console.error(`Nessun utente trovato con l'id ${userId}`);
    }
  } catch (error) {
    console.error('Errore nel recupero dei dati da Firestore:', error);
  } finally {
    isLoading.value = false; // Fine del caricamento
  }
};

// Effettua la chiamata non appena il componente è montato
onMounted(() => {
  const userId = route.params.id; // Ottiene l'id dai parametri della rotta
  if (userId) {
    fetchUserData(userId); // Chiama la funzione per ottenere i dati dell'utente
  } else {
    isLoading.value = false; // Se non c'è un userId, termina il caricamento
  }
});

// Tabs per le sezioni dell'account
const tabs = [
  {
    icon: 'bx-user',
    title: 'Account',
  },
  {
    icon: 'bx-lock-alt',
    title: 'Sicurezza',
  },
  {
    icon: 'bx-link',
    title: 'Documenti',
  },
];
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

  <!-- Contenuto principale, mostrato solo quando i dati sono stati caricati correttamente -->
  <VRow v-if="!isLoading && userData">
    <VCol cols="12" md="5" lg="4">
      <EmployeeBioPanel :user-data="userData" />
    </VCol>

    <VCol cols="12" md="7" lg="8">
      <VTabs v-model="userTab" class="v-tabs-pill">
        <VTab v-for="tab in tabs" :key="tab.icon">
          <VIcon :size="18" :icon="tab.icon" class="me-1" />
          <span>{{ tab.title }}</span>
        </VTab>
      </VTabs>

      <VWindow v-model="userTab" class="mt-6 disable-tab-transition" :touch="false">
        <VWindowItem>
          <EmployeeTabAccount />
        </VWindowItem>

        <VWindowItem>
          <EmployeeTabSecurity />
        </VWindowItem>

        <VWindowItem>
          <EmployeeTabDocuments :employee-id="route.params.id" />
        </VWindowItem>
      </VWindow>
    </VCol>
  </VRow>

  <!-- Messaggio di errore nel caso l'utente non sia trovato e il caricamento è completato -->
  <div v-else-if="!isLoading && !userData">
    <VAlert type="error" variant="tonal">
      Nessun dipendente trovato con l'ID {{ route.params.id }}!
    </VAlert>
  </div>
</template>
