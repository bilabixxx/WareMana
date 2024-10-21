<script setup>
import { useGsdStore } from '@/stores/gsd_store';
import { storeToRefs } from 'pinia';
import { onBeforeMount } from 'vue';

const store = useGsdStore();
const { getCategories, getProducts } = storeToRefs(store);

/*const widgetData = ref([
  {
    title: 'In-Store Sales',
    value: '$5,345',
    icon: 'bx-store-alt',
    desc: '5k orders',
    change: 5.7,
  },
  {
    title: 'Website Sales',
    value: '$74,347',
    icon: 'bx-laptop',
    desc: '21k orders',
    change: 12.4,
  },
  {
    title: 'Discount',
    value: '$14,235',
    icon: 'bx-gift',
    desc: '6k orders',
  },
  {
    title: 'Affiliate',
    value: '$8,345',
    icon: 'bx-wallet',
    desc: '150 orders',
    change: -3.5,
  },
])*/

const headers = [
  {
    title: 'ID',
    key: 'id',
  },
  {
    title: 'Prodotto',
    key: 'name',
  },
  {
    title: 'Categoria',
    key: 'categMercLiv.name',
  },
  {
    title: 'Pezzi per collo',
    key: 'piecesPackaging',
  },
  {
    title: 'N collo per strato',
    key: 'numberPackagesLayer',
  },
  {
    title: 'N strati pallet',
    key: 'numberPalletLayers',
  },
  {
    title: 'Totale colli per pallet',
    key: 'totalPackagesPallet',
  },
  {
    title: 'Actions',
    key: 'actions',
    sortable: false,
  },
  /*{
    title: 'Stock',
    key: 'stock',
    sortable: false,
  },
  {
    title: 'SKU',
    key: 'sku',
  },
  {
    title: 'Price',
    key: 'price',
  },
  {
    title: 'QTY',
    key: 'qty',
  },
  {
    title: 'Status',
    key: 'status',
  },*/

]

const selectedStatus = ref()
const selectedMainCategory = ref()
const selectedSecondLevelCategory = ref()
const selectedThirdLevelCategory = ref()
const selectedFourthLevelCategory = ref();

const selectedStock = ref(0)
const searchQuery = ref('')
const selectedRows = ref([])

const ordering = ref([]);

const mainCategories = ref([])
const secondLevelCategories = ref([])
const thirdLevelCategories = ref([])
const fourthLevelCategories = ref([])


/*const status = ref([
  {
    title: 'Scheduled',
    value: 'Scheduled',
  },
  {
    title: 'Publish',
    value: 'Published',
  },
  {
    title: 'Inactive',
    value: 'Inactive',
  },
])*/

/*const categories = ref([
  {
    title: 'Accessories',
    value: 'Accessories',
  },
  {
    title: 'Home Decor',
    value: 'Home Decor',
  },
  {
    title: 'Electronics',
    value: 'Electronics',
  },
  {
    title: 'Shoes',
    value: 'Shoes',
  },
  {
    title: 'Office',
    value: 'Office',
  },
  {
    title: 'Games',
    value: 'Games',
  },
])*/

/*const stockStatus = ref([
  {
    title: 'In Stock',
    value: 1,
  },
  {
    title: 'Non in Stock',
    value: 0,
  },
])*/

// Data table options
const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()

const updateOptions = options => {
  sortBy.value = options.sortBy[0]?.key
  orderBy.value = options.sortBy[0]?.order
}

/*const resolveCategory = category => {
  if (category === 'Accessories')
    return {
      color: 'error',
      icon: 'bx-headphone',
    }
  if (category === 'Home Decor')
    return {
      color: 'info',
      icon: 'bx-home-smile',
    }
  if (category === 'Electronics')
    return {
      color: 'primary',
      icon: 'bx-laptop',
    }
  if (category === 'Shoes')
    return {
      color: 'success',
      icon: 'bx-walk',
    }
  if (category === 'Office')
    return {
      color: 'warning',
      icon: 'bx-briefcase',
    }
  if (category === 'Games')
    return {
      color: 'primary',
      icon: 'bx-game',
    }
}

const resolveStatus = statusMsg => {
  if (statusMsg === 'Scheduled')
    return {
      text: 'Scheduled',
      color: 'warning',
    }
  if (statusMsg === 'Published')
    return {
      text: 'Publish',
      color: 'success',
    }
  if (statusMsg === 'Inactive')
    return {
      text: 'Inactive',
      color: 'error',
    }
}*/


/* Fetching e Setting delle Categorie e Sottocategorie */

const setMainCategories = () => {
  mainCategories.value = getCategories.value.map(category => ({
    title: category.name,
    value: category.cod_liv,
    rows: category.rows
  }))
}

const setSecondLevelCategory = () => {
  const matchingCategory = mainCategories.value.find(category => category.value == selectedMainCategory.value);

  if (!matchingCategory || !matchingCategory.rows) {
    secondLevelCategories.value = [];
    return;
  }

  secondLevelCategories.value = matchingCategory.rows.map(row => ({
    title: row.name,
    value: row.cod_liv,
    rows: row.rows
  }));
}

const setThirdLevelCategory = () => {
  const matchingCategory = secondLevelCategories.value.find(category => category.value == selectedSecondLevelCategory.value);

  if (!matchingCategory || !matchingCategory.rows) {
    thirdLevelCategories.value = [];
    return;
  }

  thirdLevelCategories.value = matchingCategory.rows.map(row => ({
    title: row.name,
    value: row.cod_liv,
    rows: row.rows
  }));
}

const setFourthLevelCategory = () => {
  const matchingCategory = thirdLevelCategories.value.find(category => category.value == selectedThirdLevelCategory.value);

  if (!matchingCategory || !matchingCategory.rows) {
    fourthLevelCategories.value = [];
    return;
  }

  fourthLevelCategories.value = matchingCategory.rows.map(row => ({
    title: row.name,
    value: row.cod_liv,
    rows: row.rows
  }));
}

/* Fetching dei Prodotti */
watch(() => {

  ordering.value = JSON.stringify([{
    column: sortBy.value,
    sorted: orderBy.value ? orderBy.value.toUpperCase() : 'ASC'
  }])
})

const products = computed(() => getProducts.value.result)
const totalProduct = computed(() => getProducts.value.recordTotal)

const deleteProduct = async id => {
  await $api(`/v1/product/${id}`, { method: 'DELETE' })

  // Delete from selectedRows
  const index = selectedRows.value.findIndex(row => row === id)
  if (index !== -1)
    selectedRows.value.splice(index, 1)

  // Refetch products
  fetchProducts()
}

/* Watchers per sottocategorie */
watch(selectedMainCategory, () => {

  setSecondLevelCategory();
  setThirdLevelCategory();
  setFourthLevelCategory();

})

watch(selectedSecondLevelCategory, () => {

  setThirdLevelCategory();
  setFourthLevelCategory();

})

watch(selectedThirdLevelCategory, () => {

  setFourthLevelCategory();

})

onBeforeMount(async () => {

  await store.fetchCategories();

  setMainCategories()

  setSecondLevelCategory();

  setThirdLevelCategory();

  setFourthLevelCategory();

  const query = {
    search: searchQuery,
    cod_liv_1: selectedMainCategory,
    cod_liv_2: selectedSecondLevelCategory,
    cod_liv_3: selectedThirdLevelCategory,
    cod_liv_4: selectedFourthLevelCategory,
    page,
    per_page: itemsPerPage,
    ordering: ordering
  }

  await store.fetchProducts(query);

})

</script>

<template>
  <div>
    <!-- 👉 widgets 
    <VCard class="mb-6">
      <VCardText class="px-3">
        <VRow>
          <template
            v-for="(data, id) in widgetData"
            :key="id"
          >
            <VCol
              cols="12"
              sm="6"
              md="3"
              class="px-6"
            >
              <div
                class="d-flex justify-space-between"
                :class="$vuetify.display.xs
                  ? id !== widgetData.length - 1 ? 'border-b pb-4' : ''
                  : $vuetify.display.sm
                    ? id < (widgetData.length / 2) ? 'border-b pb-4' : ''
                    : ''"
              >
                <div class="d-flex flex-column gap-y-1">
                  <div class="text-body-1 text-capitalize">
                    {{ data.title }}
                  </div>

                  <h4 class="text-h4">
                    {{ data.value }}
                  </h4>

                  <div class="d-flex align-center gap-x-2">
                    <div class="text-no-wrap">
                      {{ data.desc }}
                    </div>

                    <VChip
                      v-if="data.change"
                      label
                      :color="data.change > 0 ? 'success' : 'error'"
                      size="small"
                    >
                      {{ prefixWithPlus(data.change) }}%
                    </VChip>
                  </div>
                </div>

                <VAvatar
                  variant="tonal"
                  rounded
                  size="44"
                >
                  <VIcon
                    :icon="data.icon"
                    size="24"
                    class="text-high-emphasis"
                  />
                </VAvatar>
              </div>
            </VCol>
            <VDivider
              v-if="$vuetify.display.mdAndUp ? id !== widgetData.length - 1
                : $vuetify.display.smAndUp ? id % 2 === 0
                  : false"
              vertical
              inset
              length="92"
            />
          </template>
</VRow>
</VCardText>
</VCard>-->

    <!-- 👉 products -->
    <VCard title="Filtri" class="mb-6">
      <VCardText class="pb-5">
        <VRow>

          <!-- 👉 Select Category -->
          <VCol cols="12" sm="3">
            <AppSelect v-model="selectedMainCategory" placeholder="Categorie" :items="mainCategories" clearable
              clear-icon="bx-x" />
          </VCol>

          <VCol cols="12" sm="3">
            <AppSelect v-if="selectedMainCategory" v-model="selectedSecondLevelCategory" placeholder="Categorie"
              :items="secondLevelCategories" clearable clear-icon="bx-x" />
          </VCol>

          <VCol cols="12" sm="3">
            <AppSelect v-if="selectedSecondLevelCategory && selectedMainCategory" v-model="selectedThirdLevelCategory"
              placeholder="Categorie" :items="thirdLevelCategories" clearable clear-icon="bx-x" />
          </VCol>

          <VCol cols="12" sm="3">
            <AppSelect v-if="selectedThirdLevelCategory && selectedSecondLevelCategory && selectedMainCategory"
              v-model="selectedFourthLevelCategory" placeholder="Categorie" :items="fourthLevelCategories" clearable
              clear-icon="bx-x" />
          </VCol>

          <!-- 👉 Select Status
          <VCol cols="12" sm="4">
            <AppSelect v-model="selectedStatus" placeholder="Status" :items="status" clearable clear-icon="bx-x" />
          </VCol> -->

          <!-- 👉 Select Stock Status
          <VCol cols="12" sm="4">
            <AppSelect v-model="selectedStock" placeholder="Stock" :items="stockStatus" clearable clear-icon="bx-x" />
          </VCol> -->
        </VRow>
      </VCardText>

      <VDivider />

      <div class="d-flex flex-wrap gap-4 pa-6">
        <div class="d-flex align-center">
          <!-- 👉 Search  -->
          <AppTextField v-model="searchQuery" placeholder="Cerca Prodotto" style="inline-size: 250px;" class="me-3" />
          <VBtn variant="tonal" color="primary">
            <VIcon icon="bx-search" />
          </VBtn>
        </div>

        <VSpacer />
        <div class="d-flex gap-4 flex-wrap align-center">
          <AppSelect v-model="itemsPerPage" :items="[5, 10, 20, 25, 50]" />
          <!-- 👉 Export button -->
          <VBtn variant="tonal" color="secondary" prepend-icon="bx-export">
            Esporta
          </VBtn>

          <VBtn color="primary" prepend-icon="bx-plus" @click="$router.push('/apps/ecommerce/product/add')">
            Aggiungi Prodotto
          </VBtn>
        </div>
      </div>

      <VDivider />

      <!-- 👉 Datatable  -->
      <VDataTableServer v-model:items-per-page="itemsPerPage" v-model:model-value="selectedRows" v-model:page="page"
        :headers="headers" show-select :items="products" :items-length="totalProduct" class="text-no-wrap"
        @update:options="updateOptions">

        <!-- product  -->
        <template #item.name="{ item }">
          <div class="d-flex align-center gap-x-4">
            <VAvatar v-if="item.image" size="38" variant="tonal" rounded :image="item.image" />
            <div class="d-flex flex-column">
              <span class="text-body-1 font-weight-medium text-high-emphasis">{{ item.name }}</span>
              <span class="text-body-2">{{ item.productBrand }}</span>
            </div>
          </div>
        </template>

        <!-- category -->
        <template #item.category="{ item }">
          <VAvatar size="30" variant="tonal" :color="resolveCategory(item.category)?.color" class="me-4">
            <VIcon :icon="resolveCategory(item.category)?.icon" size="18" />
          </VAvatar>
          <span class="text-body-1 text-high-emphasis">{{ item.categMercLiv.name }}</span>
        </template>

        <!-- status 
        <template #item.status="{ item }">
          <VChip v-bind="resolveStatus(item.status)" density="default" label size="small" />
        </template> -->

        <!-- Actions -->
        <template #item.actions="{ item }">
          <RouterLink :to="{ name: 'apps-ecommerce-product-edit-id', params: { id: item.id } }">
            <IconBtn>
              <VIcon icon="bx-edit">
              </VIcon>
            </IconBtn>
          </RouterLink>

          <IconBtn>
            <VIcon icon="bx-dots-vertical-rounded" />
            <VMenu activator="parent">
              <VList>
                <VListItem value="download" prepend-icon="bx-download">
                  Download
                </VListItem>

                <VListItem value="delete" prepend-icon="bx-trash" @click="deleteProduct(item.id)">
                  Elimina
                </VListItem>

                <VListItem value="duplicate" prepend-icon="bx-copy">
                  Duplica
                </VListItem>
              </VList>
            </VMenu>
          </IconBtn>
        </template>

        <!-- pagination -->
        <template #bottom>
          <TablePagination v-model:page="page" :items-per-page="itemsPerPage" :total-items="totalProduct" />
        </template>
      </VDataTableServer>
    </VCard>
  </div>
</template>
