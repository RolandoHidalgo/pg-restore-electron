<template>
  <div class="bg-black text-white p-4 font-mono h-64 overflow-y-auto">
    <div v-for="(log, index) in logs" :key="index" class="whitespace-pre-line">
      {{ log }}
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps < { logs: string[] } > (), {
  logs: []
})
</script>

<style>
/* Aquí puedes agregar estilos adicionales si los necesitas */
</style>
