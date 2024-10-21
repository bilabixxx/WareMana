<script setup>
import { auth, db } from '@/firebase/config'; // Configurazione Firebase
import pdf from '@images/icons/project-icons/pdf.png';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { onMounted, ref } from 'vue';
const router = useRouter();
definePage({
  meta: {
    layout: 'blank',
    action: "read",
    subject: "Employee",
  },
});


const isLoading = ref(true); // Modifica iniziale: avvia il caricamento con true
const employeeId = ref(null); // Stato per memorizzare l'ID del dipendente dalla sessione
const documents = ref([]); // Stato per memorizzare i documenti caricati

// Stato per lo snackbar
const snackbar = ref(false);
const snackbarMessage = ref('');
const snackbarColor = ref('');

// Funzione per recuperare l'utente autenticato
const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve(user);
      } else {
        reject(new Error('Nessun utente autenticato'));
      }
      unsubscribe();
    });
  });
};

// Funzione per recuperare i documenti associati all'employeeId
const fetchDocuments = async (employeeId) => {
  try {
    const q = query(collection(db, 'documents'), where('employeeId', '==', employeeId));
    const querySnapshot = await getDocs(q);
    documents.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Debug: Visualizza la lista dei documenti nel console log
    console.log('Documenti recuperati:', documents.value);
  } catch (error) {
    console.error("Errore nel recupero dei documenti:", error);
  } finally {
    isLoading.value = false; // Fine del caricamento
  }
};

// Chiama fetchDocuments e imposta nome e cognome solo dopo aver recuperato l'utente autenticato
onMounted(async () => {
  try {
    const user = await getCurrentUser();
    employeeId.value = user.uid;
    console.log('Employee ID:', employeeId.value); // Debug

    if (employeeId.value) {
      await fetchDocuments(employeeId.value);
    }
  } catch (error) {
    console.error(error.message);
    isLoading.value = false; // Ferma il caricamento in caso di errore
  }
});

// Funzione per scaricare il documento
const downloadDocument = (fileURL) => {
  const link = document.createElement('a');
  link.href = fileURL;
  link.download = ''; // Puoi personalizzare il nome del file da scaricare
  link.click();
};

// Funzione per il logout
const logout = async () => {
  try {
    await signOut(auth);
    snackbarMessage.value = 'Logout avvenuto con successo';
    snackbarColor.value = 'success';
    snackbar.value = true;
    useCookie('userData').value = null; // Rimuovi i dati dell'utente dal cookie
    useCookie('userAbilityRules').value = null; // Rimuovi le regole di abilità dall'utente dal cookie
    // Reindirizza l'utente alla pagina di login dopo il logout
    router.push('/login');
  } catch (error) {
    snackbarMessage.value = 'Errore durante il logout';
    snackbarColor.value = 'error';
    snackbar.value = true;
    console.error("Errore durante il logout:", error);
  }
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

  <!-- Snackbar per notifiche di errore o successo -->
  <VSnackbar v-model="snackbar" :color="snackbarColor" timeout="3000" top>
    {{ snackbarMessage }}
  </VSnackbar>

  <!-- Header con pulsante di logout in alto a destra -->
  <div class="d-flex justify-end " style="margin: 1rem;">
    <VBtn color="error" @click="logout">
      Logout
    </VBtn>
  </div>

  <!-- Titolo con il nome e cognome dell'utente -->
  <VCardText class="d-flex flex-wrap justify-start gap-4">
    <h2>Buongiorno,</h2>
  </VCardText>

  <!-- Card per la gestione dei documenti -->
  <VCard class="user-tab-notification" title="I tuoi documenti" subtitle="Qui puoi gestire tutti i tuoi documenti">
    <VCardText class="px-0">
      <VDivider />
      <VTable class="text-no-wrap">
        <thead>
          <tr>
            <th scope="col">Documento</th>
            <th scope="col">Dimensione</th>
            <th scope="col">Azione</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="document in documents" :key="document.id">
            <td>
              <!-- Link per scaricare il documento -->
              <a :href="document.fileURL" :download="document.fileName">{{ document.fileName }}</a>
            </td>
            <td>{{ (document.fileSize / 1024).toFixed(2) }} KB</td> <!-- Converti le dimensioni del file in KB -->
            <td>
              <!-- Icona di download -->
              <div class="d-inline-flex align-center timeline-chip mt-2">
                <img style="cursor: pointer;" :src="pdf" height="20" class="me-2" alt="img"
                  @click="downloadDocument(document.fileURL)">
              </div>
            </td>
          </tr>
        </tbody>
      </VTable>
      <VDivider />
    </VCardText>
  </VCard>
</template>
