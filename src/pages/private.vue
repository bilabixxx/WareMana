<template>
  <div class="no-permission">
    <h1>Accesso negato</h1>
    <p>Non hai il permesso per accedere a queste funzionalità!</p>
  </div>
</template>

<script setup>
definePage({
  meta: {
    layout: 'blank',

  },
})
</script>

<style scoped>
.no-permission {
  margin-block-start: 50px;
  text-align: center;
}

.no-permission h1 {
  color: red;
}

.no-permission p {
  font-size: 18px;
}
</style>
