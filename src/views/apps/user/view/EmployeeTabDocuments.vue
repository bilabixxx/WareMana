<script setup>
import { auth, db, storage } from '@/firebase/config'; // Configurazione Firebase
import pdf from '@images/icons/project-icons/pdf.png';
import { onAuthStateChanged } from 'firebase/auth';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage';
import { onMounted, ref } from 'vue';

const props = defineProps({
  employeeId: {
    type: String,
    required: true,
  }
});

const maxFileSize = 5000000; // Imposta la dimensione massima del file (5MB)

const rules = [
  file => !file || file.size < maxFileSize || 'La dimensione del file deve essere inferiore a 5 MB!'
];

// Stato per il dialog e il form
const isDialogVisible = ref(false);
const isLoading = ref(true); // Modifica iniziale: avvia il caricamento con true
const formData = ref({
  file: null,
  visibleToEmployee: false,
});
const userId = ref(null); // Stato per memorizzare l'ID dell'utente autenticato
const documents = ref([]); // Stato per memorizzare i documenti caricati

// Stato per lo snackbar
const snackbar = ref(false);
const snackbarMessage = ref('');
const snackbarColor = ref('');

// Debug: Verifica che 'storage' sia definito
console.log('Firebase Storage:', storage);

// Ottieni l'utente autenticato
onAuthStateChanged(auth, (user) => {
  if (user) {
    userId.value = user.uid; // Imposta l'ID dell'utente autenticato
  }
});

// Funzione per gestire il caricamento del file nello storage di Firebase
const uploadFileToStorage = async (file, employeeId) => {
  if (!file) {
    throw new Error('Nessun file selezionato');
  }
  if (!employeeId) {
    throw new Error('ID dipendente non valido');
  }

  console.log('Uploading file:', file.name, 'for employee:', employeeId); // Debug

  const fileRef = storageRef(storage, `documents/${employeeId}/${file.name}`);
  await uploadBytes(fileRef, file);
  return getDownloadURL(fileRef); // Ottieni l'URL del file caricato
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

// Chiama fetchDocuments all'avvio del componente
onMounted(() => {
  fetchDocuments(props.employeeId);
});

// Funzione per scaricare il documento
const downloadDocument = (fileURL) => {
  const link = document.createElement('a');
  link.href = fileURL;
  link.download = ''; // Puoi personalizzare il nome del file da scaricare
  link.click();
};

// Funzione per convalidare le dimensioni del file
const validateFileSize = (file) => {
  if (file.size > maxFileSize) {
    snackbarMessage.value = 'Il file selezionato è troppo grande. La dimensione massima è 5 MB.';
    snackbarColor.value = 'error';
    snackbar.value = true;
    formData.value.file = null; // Resetta il file selezionato
    return false;
  }
  return true;
};

// Funzione per il blur: attiva la convalida solo dopo il blur sull'input file
const onFileInputBlur = (event) => {
  const file = event.target.files[0];
  if (file) {
    validateFileSize(file); // Verifica la dimensione del file
  }
};

const onSubmit = async () => {
  if (formData.value.file && userId.value) {
    isLoading.value = true; // Inizia il caricamento quando viene inviato il file
    try {
      const employeeId = props.employeeId;
      const file = formData.value.file; // Usa il file direttamente

      // Carica il file e ottieni l'URL
      const fileURL = await uploadFileToStorage(file, employeeId);

      // Aggiungi un nuovo documento alla collezione "documents"
      await addDoc(collection(db, 'documents'), {
        employeeId: employeeId,
        addedBy: userId.value,
        fileURL: fileURL,
        fileName: file.name, // Salva il nome del file
        fileSize: file.size, // Salva la dimensione del file
        visibleToEmployee: formData.value.visibleToEmployee,
        addedAt: new Date(),
      });

      console.log("Documento caricato con successo:", fileURL);

      // Resetta il form
      isDialogVisible.value = false;
      formData.value.file = null;
      formData.value.visibleToEmployee = false;

      // Ricarica i documenti
      await fetchDocuments(employeeId);

      // Mostra lo snackbar di successo
      snackbarMessage.value = 'Documento caricato con successo!';
      snackbarColor.value = 'success';
      snackbar.value = true;
    } catch (error) {
      console.error("Errore durante il caricamento del documento:", error);
      snackbarMessage.value = 'Errore durante il caricamento del documento.';
      snackbarColor.value = 'error';
      snackbar.value = true;
    } finally {
      isLoading.value = false; // Fine del caricamento al termine del processo
    }
  } else {
    console.log("Nessun file selezionato o utente non autenticato");
    snackbarMessage.value = 'Nessun file selezionato o utente non autenticato';
    snackbarColor.value = 'error';
    snackbar.value = true;
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

  <VCard class="user-tab-notification" title="Documenti" subtitle="Qui puoi gestire tutti i documenti del dipendente">
    <VCardText class="d-flex flex-wrap justify-end gap-4">
      <VBtn prepend-icon="bx-plus" @click="isDialogVisible = true">Carica Documento</VBtn>
    </VCardText>
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

    <!-- Dialogo per il caricamento del documento -->
    <VDialog v-model="isDialogVisible" max-width="800">
      <VCard>
        <VCardText>
          <VRow>
            <VCol cols="12">
              <h2 class="text-h6 font-weight-medium mb-5">Carica il file</h2>
              <!-- Campo di input per il caricamento del file -->
              <AppFileInput show-size v-model="formData.file" :rules="rules" label="Carica documento"
                accept=".pdf,.doc,.docx,.txt" prepend-inner-icon="bx-upload" @blur="onFileInputBlur" />
            </VCol>

            <VCol cols="12" class="mt-4">
              <!-- Switch per rendere visibile il documento al dipendente -->
              <VSwitch v-model="formData.visibleToEmployee" label="Rendi visibile al dipendente" />
            </VCol>
          </VRow>
        </VCardText>

        <VCardActions class="d-flex justify-end">
          <!-- Spinner di caricamento -->
          <VProgressCircular v-if="isLoading" indeterminate color="primary" />
          <!-- Pulsante per caricare il documento -->
          <VBtn :disabled="isLoading" @click="onSubmit">Carica Documento</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </VCard>
</template>
