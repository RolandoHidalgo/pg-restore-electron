<script setup lang="ts">

import {
  SidebarGroup,
  SidebarGroupContent,
} from '@renderer/components/ui/sidebar'
import { Button } from '@renderer/components/ui/button'
import {Label} from '@renderer/components/ui/label'
import {ref} from "vue";
import {ChevronRight} from 'lucide-vue-next'
const a = ref('')
const emit = defineEmits<{
  input: [value: string]
}>()
const handleSearch = (event: string): void => {

  emit('input', a.value)
}
</script>
<template>
  <form>
    <SidebarGroup class="py-0">
      <SidebarGroupContent class="relative">
        <Label for="search" class="sr-only">
          backup
        </Label>

        <Button variant="outline" size="icon">
          <ChevronRight :size="16" />
        </Button>
      </SidebarGroupContent>
    </SidebarGroup>
  </form>
</template>
