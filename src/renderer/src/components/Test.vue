<script setup lang="ts">
import { inject, onMounted, useAttrs } from 'vue'

const attrs = useAttrs();

onMounted(() => {
  const attrs = useAttrs()
  const injectionKey = Symbol(`DrawerRootContext`)

  const context = inject(`DrawerRootContext`)
  const context2 = inject(injectionKey)


})
</script>

<template>
<div>hola</div>
</template>

<style scoped>

</style>
