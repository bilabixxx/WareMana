<script setup>
import { useGsdStore } from '@/stores/gsd_store';
import { onMounted } from 'vue';
definePage({
  meta: {
    layout: 'blank',
    unauthenticatedOnly: true,
  },
})
const store = useGsdStore();
// const saveSetsToDatabase = async (sets) => {
//   try {
//     const setsCollection = collection(db, 'cards');
//     for (const set of sets) {
//       await addDoc(setsCollection, set);
//     }
//     console.log('Sets saved to database successfully.');
//   } catch (error) {
//     console.error('Error saving sets to database:', error);
//   }
// };

onMounted(async () => {
  try {
    // Chiama la funzione che gestisce sia fetchCards che fetchSingleCard
    await store.fetchAllSingleCards();
  } catch (error) {
    console.error(error);
  }
});
</script>

<template>
  <h1>Caricamento completato</h1>
</template>
