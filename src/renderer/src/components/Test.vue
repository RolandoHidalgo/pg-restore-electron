<script setup lang="ts">
import { inject, onMounted, useAttrs } from 'vue'

const attrs = useAttrs();
console.log(attrs);
onMounted(() => {
  const attrs = useAttrs()
  const injectionKey = Symbol(`DrawerRootContext`)

  const context = inject(`DrawerRootContext`)
  const context2 = inject(injectionKey)

  console.log(attrs.value, 'aaaa')
  console.log(context, 'contexttttttt')
  console.log(context2, 'contexttttttt2')
})
</script>

<template>
<div>hola</div>
</template>

<style scoped>

</style>
