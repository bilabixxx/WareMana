import { useTcgDexApi } from '@/composables/useApi';
import { db } from '@/firebase/config'; // Importa la configurazione Firestore
import { addDoc, collection } from 'firebase/firestore'; // Importa funzioni Firestore
import { defineStore } from 'pinia';

export const useGsdStore = defineStore('gsdStore', {

    state: () => {
        return {
            singleCard: {},
            cards: [], // Aggiungiamo uno stato per le carte
            singleCards: [], // Aggiungiamo uno stato per le singole carte
            products: [],
            listPrices: [],
        }
    },

    getters: {
        getSingleCard: (state) => state.singleCard,
        getCards: (state) => state.cards, // Aggiungiamo un getter per le carte
        getProducts: (state) => state.products,
        getListPrices: (state) => state.listPrices,
    },

    actions: {
        async fetchCards() {
            const res = await useTcgDexApi(`/v2/en/cards`);
            this.cards = res.data; // Salviamo il risultato nello stato
            return res.data;
        },

        async fetchSingleCard(id) {
            const res = await useTcgDexApi(`/v2/en/cards/${id}`);
            return res.data;
        },

        async fetchAllSingleCards() {
            if (this.cards.length === 0) {
                await this.fetchCards(); // Assicuriamoci che ci siano delle carte
            }

            const singleCards = [];
            for (const card of this.cards) {
                const singleCardData = await this.fetchSingleCard(card.id); // Recuperiamo la singola carta
                singleCards.push(singleCardData); // Aggiungiamo la singola carta allo stato

                // Invio la singola carta al database Firestore con ID generato automaticamente
                await this.saveCardToFirestore(singleCardData);
            }

            this.singleCards = singleCards; // Salviamo tutte le singole carte nello stato
            console.log(`Trovate ${this.cards.length} carte in fetchCards.`);
            console.log(`Trovate ${singleCards.length} singole carte in fetchSingleCard.`);
        },

        // Funzione per salvare la carta su Firestore usando 'add'
        async saveCardToFirestore(card) {
            try {
                // Usa 'addDoc' per far generare automaticamente l'ID
                const cardRef = await addDoc(collection(db, 'cards'), card);
                console.log(`Carta salvata su Firestore con ID generato automaticamente: ${cardRef.id}`);
            } catch (error) {
                console.error(`Errore durante il salvataggio della carta:`, error);
            }
        }

    }
});
