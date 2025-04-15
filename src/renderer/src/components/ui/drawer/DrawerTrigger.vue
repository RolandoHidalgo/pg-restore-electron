<script lang="ts" setup>
import type { DrawerTriggerProps } from 'vaul-vue'
import { DrawerTrigger } from 'vaul-vue'
import { onMounted, useAttrs, inject } from 'vue'
import { createContext } from 'reka-ui'

const props = defineProps<DrawerTriggerProps>()

onMounted(() => {
  const attrs = useAttrs()
  const injectionKey = Symbol(`DrawerRootContext`)

  const context = inject(`DrawerRootContext`)

})
</script>

<template>
  <DrawerTrigger data-slot="drawer-trigger" v-bind="props">
    <slot />
  </DrawerTrigger>
</template>
