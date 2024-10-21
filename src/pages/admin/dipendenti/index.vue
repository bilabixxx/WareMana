<script setup>
import { auth, db } from '@/firebase/config'; // Importa la configurazione Firebase Firestore e Auth
import { createUserWithEmailAndPassword } from 'firebase/auth'; // Firebase Auth per la creazione utente
import { collection, doc, getDocs, setDoc } from 'firebase/firestore'; // Importa getDocs e collection per ottenere i dati
import { computed, onMounted, ref, watch } from 'vue';

// Recupera i dati dalla collezione "employees" al montaggio del componente

const isLoadingUsers = ref(true); // Aggiungi lo stato per il caricamento

const fetchEmployees = async () => {
  isLoadingUsers.value = true; // Imposta il caricamento all'inizio
  try {
    const querySnapshot = await getDocs(collection(db, 'employees'));
    const employees = querySnapshot.docs.map(doc => ({
      id: doc.id,
      fullName: `${doc.data().name} ${doc.data().surname}`,
      email: doc.data().email,
      role: 'dipendente', // Ruolo fisso per tutti
      duties: doc.data().role, // Mansione equivalente all'attributo role
      status: doc.data().status === 'active' ? 'Attivo' : 'Inattivo', // Converti lo status in testo leggibile
      avatar: doc.data().avatar || '',
      currentPlan: 'Basic', // Assegna un piano di default o personalizza secondo necessità
    }));
    usersData.value.users = employees;
    console.log('Employees:', employees); // Stampa i dati degli employees
  } catch (error) {
    console.error('Errore nel recupero dei dati dalla collezione employees:', error);
  } finally {
    isLoadingUsers.value = false; // Termina il caricamento
  }
};

// Chiamata alla funzione al montaggio del componente
onMounted(() => {
  fetchEmployees();
});

// Il resto del codice rimane invariato...
const numberedSteps = [
  {
    title: 'Dettagli Dipendente',
    icon: 'bx-user',
    subtitle: 'Inserisci i dettagli del dipendente',
  },
  {
    title: 'Contatti',
    icon: 'bx-file',
    subtitle: 'Inserisci i contatti del dipendente',
  },
];

// Stato del form e spinner
const currentStep = ref(0);
const isPasswordVisible = ref(false);
const isCPasswordVisible = ref(false);

// Form data
const formData = ref({
  firstName: '',
  lastName: '',
  email: '',
  birthDate: '',
  password: '',
  cPassword: '',
  role: 'Amministrativo', // Ruolo di default
  phone: '',
  street: '',
  postalCode: '',
  city: '',
});

const firstNameInput = ref(null); // Ref per il campo "Nome"

// Flag per la validazione e lo stato di caricamento
const isSubmitting = ref(false);
const isLoading = ref(false); // Spinner per il caricamento

// Stato delle notifiche
const showSuccessSnackbar = ref(false);
const showErrorSnackbar = ref(false);
const snackbarMessage = ref('');

// Quando il componente è montato, imposta il focus sul campo "Nome"
onMounted(() => {
  if (firstNameInput.value) {
    firstNameInput.value.focus();
  }
});

// Errori di validazione
const errors = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  cPassword: '',
  role: '',
  phone: '',
  street: '',
  postalCode: '',
  city: '',
});

// 👉 Funzione per validare l'email
const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};
// 👉 Funzione per validare il primo step (Dettagli Dipendente)
// 👉 Funzione per validare il primo step (Dettagli Dipendente)
const validateStepOne = () => {
  let isValid = true;

  // Reset degli errori per il primo step
  errors.value.firstName = formData.value.firstName ? '' : 'Il nome è obbligatorio.';
  errors.value.lastName = formData.value.lastName ? '' : 'Il cognome è obbligatorio.';
  errors.value.email = formData.value.email
    ? validateEmail(formData.value.email)
      ? ''
      : 'Inserisci un\'email valida.'
    : 'L\'email è obbligatoria.';

  // Verifica che la password sia presente e abbia almeno 6 caratteri
  errors.value.password = formData.value.password
    ? formData.value.password.length >= 6
      ? ''
      : 'La password deve contenere almeno 6 caratteri.'
    : 'La password è obbligatoria.';

  // Verifica che le password combacino
  errors.value.cPassword = formData.value.cPassword
    ? formData.value.password === formData.value.cPassword
      ? ''
      : 'Le password non combaciano.'
    : 'Conferma la password.';

  errors.value.role = formData.value.role ? '' : 'Il ruolo è obbligatorio.';

  // Verifica se ci sono errori
  isValid =
    !errors.value.firstName &&
    !errors.value.lastName &&
    !errors.value.email &&
    !errors.value.password &&
    !errors.value.cPassword &&
    !errors.value.role;

  return isValid;
};




// 👉 Watcher per intercettare il cambio di step
watch(currentStep, (newVal, oldVal) => {
  if (newVal > oldVal) {
    // L'utente sta cercando di avanzare allo step successivo
    isSubmitting.value = true;
    let isValid = false;

    if (oldVal === 0) {
      isValid = validateStepOne();
    }

    if (!isValid) {
      // Validazione fallita, impedisci il cambio di step
      currentStep.value = oldVal;
    } else {
      // Validazione superata, consenti il cambio di step
      isSubmitting.value = false;
    }
  } else {
    // L'utente sta tornando indietro o restando sullo stesso step
    isSubmitting.value = false;
  }
});

// 👉 Funzione di submit finale con creazione utente e documento
const onSubmit = async () => {
  // Avvia il processo di submit
  isSubmitting.value = true;

  // Validazione dei due step
  const isStepOneValid = validateStepOne();


  // Procedi solo se entrambi gli step sono validi
  if (isStepOneValid) {
    isLoading.value = true; // Mostra lo spinner di caricamento
    snackbarMessage.value = ''; // Resetta il messaggio di errore

    try {
      // Creazione del nuovo utente con Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, formData.value.email, formData.value.password);
      const user = userCredential.user;

      // Creazione del documento nella collezione "employees" con lo stesso ID dell'utente
      await setDoc(doc(db, 'employees', user.uid), {
        name: formData.value.firstName,
        surname: formData.value.lastName,
        email: formData.value.email,
        avatar: null,
        address: {
          street: formData.value.street,
          city: formData.value.city,
          zipCode: formData.value.postalCode,
        },
        status: 'active',
        mobilePhone: formData.value.phone,
        birthDate: formData.value.birthDate,
        role: formData.value.role,
      });

      // Aggiungi l'utente appena creato a usersData per l'aggiornamento reattivo
      usersData.value.users.push({
        id: user.uid,
        fullName: `${formData.value.firstName} ${formData.value.lastName}`,
        email: formData.value.email,
        role: formData.value.role,
        duties: formData.value.role, // Puoi modificare se necessario
        status: 'Attivo', // Ruolo fisso per il nuovo utente
      });
      usersData.value.totalUsers++; // Aggiorna il conteggio totale degli utenti

      // Operazione completata, mostra notifiche e reset del form
      console.log('Dipendente creato con successo e utente autenticato.');
      snackbarMessage.value = 'Dipendente aggiunto con successo!';
      showSuccessSnackbar.value = true;
      resetForm();
      isDialogVisible.value = false;

    } catch (error) {
      // In caso di errore nella creazione utente o nel salvataggio su Firestore
      console.error('Errore durante la creazione dell\'utente o del documento:', error);
      snackbarMessage.value = 'Errore durante la creazione del dipendente. Per favore, riprova.';
      showErrorSnackbar.value = true;
    } finally {
      isLoading.value = false; // Nascondi lo spinner
      isSubmitting.value = false;
    }
  } else {
    // In caso di errori di validazione
    isSubmitting.value = false;
    snackbarMessage.value = 'Errore nei dati inseriti. Controlla il form.';
    showErrorSnackbar.value = true;
  }
};



// 👉 Funzione per resettare il form
const resetForm = () => {
  formData.value = {
    firstName: '',
    lastName: '',
    email: '',
    birthDate: '',
    password: '',
    cPassword: '',
    role: 'employee',
    phone: '',
    street: '',
    postalCode: '',
    city: '',
  };
  errors.value = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    cPassword: '',
    role: '',
    phone: '',
    street: '',
    postalCode: '',
    city: '',
  };
  isSubmitting.value = false;
  currentStep.value = 0;
};

// 👉 Funzione per passare allo step successivo con validazione
const nextStep = () => {
  isSubmitting.value = true;
  let isValid = false;

  if (currentStep.value === 0) {
    isValid = validateStepOne();
  }

  if (isValid) {
    currentStep.value++;
    isSubmitting.value = false;
  } else {
    isSubmitting.value = false;
  }
};

// 👉 Funzione per tornare indietro allo step precedente
const prevStep = () => {
  if (currentStep.value > 0) currentStep.value--;
};

// 👉 Dati fittizi degli utenti (per la tabella)
const usersData = ref({
  users: [
  ],
  totalUsers: 0,
});

const users = computed(() => usersData.value.users);
const totalUsers = computed(() => usersData.value.totalUsers);

// 👉 Search filters
const roles = [
  { title: 'Amministrativo', value: 'Amministrativo' },
  { title: 'Commerciale', value: 'Commerciale' },
  { title: 'Logistico', value: 'Logistico' },
  { title: 'Operativo', value: 'Operativo' },
  { title: 'Segreteria', value: 'Sergreteria' },
];
const status = [
  { title: 'Attivo', value: 'active' },
  { title: 'Inattivo', value: 'inactive' },
];
const isDialogVisible = ref(false);

// 👉 Funzione per eliminare un utente (senza Firebase, usato per la tabella)
const deleteUser = (id) => {
  const index = usersData.value.users.findIndex((user) => user.id === id);
  if (index !== -1) {
    usersData.value.users.splice(index, 1);
    usersData.value.totalUsers -= 1;
  }
};

// 👉 Funzione per determinare il colore del chip in base allo stato
const resolveUserStatusVariant = (stat) => {
  const statLowerCase = stat.toLowerCase();
  if (statLowerCase === 'attivo') return 'success';
  if (statLowerCase === 'inattivo') return 'secondary';
  return 'primary';
};

// 👉 Funzione per determinare il colore e l'icona del ruolo
const resolveUserRoleVariant = (role) => {

  return { color: 'primary', icon: 'bx-user' };
};

// 👉 Dati dei widget
const widgetData = ref([
  { title: 'Session', value: '21,459', change: 29, desc: 'Total Users', icon: 'bx-group', iconColor: 'primary' },
  {
    title: 'Paid Users', value: '4,567', change: 18, desc: 'Last Week Analytics', icon: 'bx-user-plus', iconColor: 'error'
  },
  {
    title: 'Active Users', value: '19,860', change: -14, desc: 'Last Week Analytics', icon: 'bx-user-check', iconColor:
      'success'
  },
  {
    title: 'Pending Users', value: '237', change: 42, desc: 'Last Week Analytics', icon: 'bx-user-voice', iconColor:
      'warning'
  },
]);

// Altri riferimenti e funzioni necessarie
const selectedRole = ref(null);
const selectedPlan = ref(null);
const selectedStatus = ref(null);
const itemsPerPage = ref(10);
const searchQuery = ref('');
const selectedRows = ref([]);
const page = ref(1);

// 👉 Headers aggiornati con 'title' e 'key'
const headers = ref([
  { title: 'Dipendente', key: 'fullName' },
  { title: 'Ruolo', key: 'role' },
  { title: 'Settore', key: 'duties' },
  { title: 'Stato', key: 'status' },
  { title: 'Azioni', key: 'actions', sortable: false },
]);

const updateOptions = () => {
  // Logica per aggiornare le opzioni della tabella
};

// Funzione per ottenere le iniziali dell'utente
const avatarText = (fullName) => {
  return fullName.split(' ').map((n) => n[0]).join('');
};

// Funzione per prefissare con un "+" i numeri positivi
const prefixWithPlus = (number) => {
  return number > 0 ? `+${number}` : number;
};

// Computed per filtrare gli utenti in base ai filtri e alla ricerca
const filteredUsers = computed(() => {
  return users.value.filter((user) => {
    const matchesRole = selectedRole.value ? user.role === selectedRole.value : true;
    const matchesPlan = selectedPlan.value ? user.currentPlan === selectedPlan.value : true;
    const matchesStatus = selectedStatus.value ? user.status === selectedStatus.value : true;
    const matchesSearch = searchQuery.value
      ? user.fullName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
      : true;
    return matchesRole && matchesPlan && matchesStatus && matchesSearch;
  });
});
</script>

<template>
  <section>
    <!-- Spinner di caricamento sopra l'intera pagina -->
    <VDialog v-model="isLoading" persistent max-width="none" hide-overlay transition="dialog-transition"
      style="z-index: 9999; text-align: center;" class="flex items-center justify-center text-center">
      <VCard flat class="flex items-center justify-center align-center text-center"
        style="background-color: rgba(0, 0, 0, 50%); block-size: 100vh;">
        <VProgressCircular indeterminate color="primary" size="100" />
      </VCard>
    </VDialog>

    <VDialog v-model="isLoadingUsers" persistent max-width="none" hide-overlay transition="dialog-transition"
      style="z-index: 9999; text-align: center;" class="flex items-center justify-center text-center">
      <VCard flat class="flex items-center justify-center align-center text-center"
        style="background-color: rgba(0, 0, 0, 50%); block-size: 100vh;">
        <VProgressCircular indeterminate color="primary" size="100" />
      </VCard>
    </VDialog>

    <!-- Notifiche Snackbar -->
    <VSnackbar v-model="showSuccessSnackbar" color="success" bottom right timeout="3000">
      {{ snackbarMessage }}
    </VSnackbar>

    <VSnackbar v-model="showErrorSnackbar" color="error" bottom right timeout="3000">
      {{ snackbarMessage }}
    </VSnackbar>

    <!-- 👉 Widgets -->
    <!-- <div class="d-flex mb-6">
      <VRow>
        <template v-for="(data, id) in widgetData" :key="id">
          <VCol cols="12" md="3" sm="6">
            <VCard>
              <VCardText>
                <div class="d-flex justify-space-between">
                  <div class="d-flex flex-column gap-y-1">
                    <div class="text-body-1 text-high-emphasis">
                      {{ data.title }}
                    </div>
                    <div class="d-flex gap-x-2 align-center">
                      <h4 class="text-h4">
                        {{ data.value }}
                      </h4>
                      <div class="text-base" :class="data.change > 0 ? 'text-success' : 'text-error'">
                        ({{ prefixWithPlus(data.change) }}%)
                      </div>
                    </div>
                    <div class="text-sm">
                      {{ data.desc }}
                    </div>
                  </div>
                  <VAvatar :color="data.iconColor" variant="tonal" rounded size="40">
                    <VIcon :icon="data.icon" size="24" />
                  </VAvatar>
                </div>
              </VCardText>
            </VCard>
          </VCol>
        </template>
</VRow>
</div> -->

    <!-- 👉 Filtro e Tabella Utenti -->
    <VCard class="mb-6">
      <VCardItem class="pb-4">
        <VCardTitle>Filtri</VCardTitle>
      </VCardItem>

      <VCardText>
        <VRow>
          <VCol cols="12" sm="4">
            <AppSelect v-model="selectedRole" placeholder="Scegli settore" :items="roles" clearable clear-icon="bx-x" />
          </VCol>
          <VCol cols="12" sm="4">
            <AppSelect v-model="selectedStatus" placeholder="Scegli stato" :items="status" clearable
              clear-icon="bx-x" />
          </VCol>
        </VRow>
      </VCardText>

      <VDivider />

      <VCardText class="d-flex flex-wrap gap-4">
        <div class="me-3 d-flex gap-3">
          <AppSelect :model-value="itemsPerPage" :items="[
            { value: 10, title: '10' },
            { value: 25, title: '25' },
            { value: 50, title: '50' },
            { value: 100, title: '100' },
            { value: -1, title: 'Tutti' },
          ]" style="inline-size: 6.25rem;" @update:model-value="itemsPerPage = parseInt($event, 10)" />
        </div>
        <VSpacer />

        <div class="app-user-search-filter d-flex align-center flex-wrap gap-4">
          <div style="inline-size: 15.625rem;">
            <AppTextField v-model="searchQuery" placeholder="Cerca dipendente" autocomplete="off" />
          </div>

          <VBtn variant="tonal" color="secondary" prepend-icon="bx-export">
            Esporta
          </VBtn>

          <VBtn prepend-icon="bx-plus" @click="isDialogVisible = true">
            Aggiungi Dipendente
          </VBtn>
        </div>
      </VCardText>

      <VDivider />

      <!-- DataTable -->
      <VDataTableServer v-model:items-per-page="itemsPerPage" v-model:model-value="selectedRows" v-model:page="page"
        :items="filteredUsers" item-value="id" :items-length="totalUsers" :headers="headers" class="text-no-wrap"
        show-select @update:options="updateOptions">
        <!-- Template per le colonne -->
        <template #item.fullName="{ item }">
          <div class="d-flex align-center gap-x-4">
            <VAvatar size="34" :variant="!item.avatar ? 'tonal' : undefined"
              :color="!item.avatar ? resolveUserRoleVariant(item.role).color : undefined">
              <VImg v-if="item.avatar" :src="item.avatar" />
              <span v-else>{{ avatarText(item.fullName) }}</span>
            </VAvatar>
            <div class="d-flex flex-column">
              <h6 class="text-base">
                <RouterLink :to="{ name: 'admin-dipendente-id', params: { id: item.id } }"
                  class="font-weight-medium text-link">
                  {{ item.fullName }}
                </RouterLink>
              </h6>
              <div class="text-sm">
                {{ item.email }}
              </div>
            </div>
          </div>
        </template>

        <template #item.role="{ item }">
          <div class="d-flex align-center gap-x-2">
            <VIcon :size="20" :icon="resolveUserRoleVariant(item.role).icon"
              :color="resolveUserRoleVariant(item.role).color" />
            <div class="text-capitalize text-high-emphasis text-body-1">
              {{ item.role }}
            </div>
          </div>
        </template>

        <template #item.currentPlan="{ item }">
          <div class="text-body-1 text-high-emphasis text-capitalize">
            {{ item.currentPlan }}
          </div>
        </template>

        <template #item.status="{ item }">
          <VChip :color="resolveUserStatusVariant(item.status)" size="small" label class="text-capitalize">
            {{ item.status }} <!-- Ora mostra "Attivo" o "Inattivo" -->
          </VChip>
        </template>


        <template #item.actions="{ item }">
          <IconBtn @click="deleteUser(item.id)">
            <VIcon icon="bx-trash" />
          </IconBtn>

          <IconBtn :to="{ name: 'admin-dipendente-id', params: { id: item.id } }">
            <VIcon icon="bx-show" />
          </IconBtn>

          <VBtn icon variant="text" color="medium-emphasis">
            <VIcon icon="bx-dots-vertical-rounded" />
            <VMenu activator="parent">
              <VList>
                <VListItem :to="{ name: 'admin-dipendente-id', params: { id: item.id } }">
                  <template #prepend>
                    <VIcon icon="bx-show" />
                  </template>
                  <VListItemTitle>View</VListItemTitle>
                </VListItem>

                <VListItem link>
                  <template #prepend>
                    <VIcon icon="bx-pencil" />
                  </template>
                  <VListItemTitle>Edit</VListItemTitle>
                </VListItem>
              </VList>
            </VMenu>
          </VBtn>
        </template>

        <template #bottom>
          <TablePagination v-model:page="page" :items-per-page="itemsPerPage" :total-items="totalUsers" />
        </template>
      </VDataTableServer>
    </VCard>

    <!-- Add New User Dialog -->
    <VDialog v-model="isDialogVisible" max-width="800">
      <VCard>
        <VCardText>
          <VRow>
            <VCol cols="12" md="4">
              <AppStepper v-model:current-step="currentStep" direction="vertical" :items="numberedSteps" icon-size="24"
                class="stepper-icon-step-bg" />
            </VCol>
            <VCol cols="12" md="8">
              <VForm autocomplete="off">
                <VWindow v-model="currentStep" class="disable-tab-transition">
                  <!-- Primo Step: Dettagli Dipendente -->
                  <VWindowItem>
                    <VRow>
                      <VCol cols="12">
                        <h6 class="text-h6 font-weight-medium">Dettagli Dipendente</h6>
                        <p class="mb-0">Inserisci i dettagli del dipendente</p>
                      </VCol>

                      <VCol cols="12" md="6">
                        <AppTextField v-model="formData.firstName" placeholder="Mario" label="Nome" ref="firstNameInput"
                          :error="errors.firstName !== ''" :error-messages="errors.firstName" autocomplete="off" />
                      </VCol>

                      <VCol cols="12" md="6">
                        <AppTextField v-model="formData.lastName" placeholder="Rossi" label="Cognome"
                          :error="errors.lastName !== ''" :error-messages="errors.lastName" autocomplete="off" />
                      </VCol>

                      <VCol cols="12" md="6">
                        <AppTextField v-model="formData.email" placeholder="mariorossi@email.com" label="Email"
                          :error="errors.email !== ''" :error-messages="errors.email" autocomplete="off" />
                      </VCol>

                      <VCol cols="12" md="6">
                        <AppTextField v-model="formData.birthDate" label="Data di nascita" placeholder="01/01/1980"
                          type="date" autocomplete="off" />
                      </VCol>

                      <VCol cols="12" md="6">
                        <AppTextField v-model="formData.password" label="Password" placeholder="············"
                          :type="isPasswordVisible ? 'text' : 'password'"
                          :append-inner-icon="isPasswordVisible ? 'bx-hide' : 'bx-show'"
                          @click:append-inner="isPasswordVisible = !isPasswordVisible" :error="errors.password !== ''"
                          :error-messages="errors.password" autocomplete="off" />
                      </VCol>

                      <VCol cols="12" md="6">
                        <AppTextField v-model="formData.cPassword" label="Conferma Password" placeholder="············"
                          :type="isCPasswordVisible ? 'text' : 'password'"
                          :append-inner-icon="isCPasswordVisible ? 'bx-hide' : 'bx-show'"
                          @click:append-inner="isCPasswordVisible = !isCPasswordVisible"
                          :error="errors.cPassword !== ''" :error-messages="errors.cPassword" autocomplete="off" />
                      </VCol>

                      <!-- Nuovo Campo: Ruolo del Dipendente -->
                      <VCol cols="12" md="6">
                        <AppSelect v-model="formData.role" label="Settore" :items="roles" placeholder="Seleziona Ruolo"
                          clearable clear-icon="bx-x" />
                        <div v-if="errors.role" class="text-error">
                          {{ errors.role }}
                        </div>
                      </VCol>
                    </VRow>
                  </VWindowItem>

                  <!-- Secondo Step: Contatti -->
                  <VWindowItem>
                    <VRow>
                      <VCol cols="12">
                        <h6 class="text-h6 font-weight-medium">Contatti</h6>
                        <p class="mb-0">Inserisci i contatti del dipendente</p>
                      </VCol>

                      <VCol cols="12" md="6">
                        <AppTextField v-model="formData.phone" label="Telefono" placeholder="+39 123 4567 890"
                          :error="errors.phone !== ''" :error-messages="errors.phone" autocomplete="off" />
                      </VCol>

                      <VCol cols="12" md="6">
                        <AppTextField v-model="formData.street" label="Via" placeholder="Via Roma 10"
                          :error="errors.street !== ''" :error-messages="errors.street" autocomplete="off" />
                      </VCol>

                      <VCol cols="12" md="6">
                        <AppTextField v-model="formData.postalCode" label="CAP" placeholder="97019"
                          :error="errors.postalCode !== ''" :error-messages="errors.postalCode" autocomplete="off" />
                      </VCol>

                      <VCol cols="12" md="6">
                        <AppTextField v-model="formData.city" label="Città" placeholder="Vittoria"
                          :error="errors.city !== ''" :error-messages="errors.city" autocomplete="off" />
                      </VCol>
                    </VRow>
                  </VWindowItem>
                </VWindow>

                <!-- Pulsanti di Navigazione -->
                <div class="d-flex flex-wrap gap-4 justify-space-between mt-8">
                  <VBtn color="secondary" variant="tonal" :disabled="currentStep === 0" @click="prevStep">
                    <VIcon icon="bx-left-arrow-alt" start class="flip-in-rtl" /> Indietro
                  </VBtn>

                  <VBtn v-if="numberedSteps.length - 1 === currentStep" color="success" @click="onSubmit">
                    Crea Dipendente
                  </VBtn>

                  <VBtn v-else @click="nextStep">
                    Avanti
                    <VIcon icon="bx-right-arrow-alt" end class="flip-in-rtl" />
                  </VBtn>
                </div>
              </VForm>
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VDialog>
  </section>
</template>

<style scoped>
/* Stile per il messaggio di errore */
.text-error {
  color: red;
}
</style>
