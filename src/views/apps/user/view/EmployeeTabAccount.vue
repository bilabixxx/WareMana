<script setup>
import pdf from '@images/icons/project-icons/pdf.png';
import UserInvoiceTable from './UserInvoiceTable.vue';

</script>

<template>
  <VRow>
    <VCol cols="12">
      <!-- 👉 User Activity timeline -->
      <VCard title="User Activity Timeline">
        <VCardText>
          <VTimeline side="end" align="start" line-inset="9" truncate-line="start" density="compact">
            <!-- SECTION Timeline Item: Flight -->
            <VTimelineItem dot-color="primary" size="x-small">
              <!-- 👉 Header -->
              <div class="d-flex justify-space-between align-center gap-2 flex-wrap mb-3">
                <span class="app-timeline-title">
                  Emessa busta paga
                </span>
                <span class="app-timeline-meta">12 min fa</span>
              </div>

              <!-- 👉 Content -->
              <div class="app-timeline-text">
                Busta paga emessa per il mese di settembre
              </div>

              <div class="d-inline-flex align-center timeline-chip mt-2">
                <img :src="pdf" height="20" class="me-2" alt="img">
                <span class="app-timeline-text font-weight-medium">
                  busta_paga_Rimmaudo.pdf
                </span>
              </div>
            </VTimelineItem>
            <!-- !SECTION -->

            <!-- SECTION Timeline Item: Interview Schedule -->
            <VTimelineItem size="x-small" dot-color="success">
              <!-- 👉 Header -->
              <div class="d-flex justify-space-between align-center flex-wrap mb-3">
                <div class="app-timeline-title">
                  Nota
                </div>
                <span class="app-timeline-meta">45 min fa</span>
              </div>

              <div class="app-timeline-text">
                Ha ritardato 30 minuti. Male, male, male!
              </div>

            </VTimelineItem>
            <!-- !SECTION -->

            <!-- SECTION Design Review -->
            <VTimelineItem size="x-small" dot-color="info">
              <!-- 👉 Header -->
              <div class="d-flex justify-space-between align-center flex-wrap mb-3">
                <span class="app-timeline-title">
                  Malattia
                </span>
                <span class="app-timeline-meta">da circa 1 settimana</span>
              </div>

              <!-- 👉 Content -->
              <p class="app-timeline-text mb-2">
                Malattia di 2gg
              </p>
            </VTimelineItem>
            <!-- !SECTION -->
          </VTimeline>
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12">
      <UserInvoiceTable />
    </VCol>
  </VRow>
</template>
