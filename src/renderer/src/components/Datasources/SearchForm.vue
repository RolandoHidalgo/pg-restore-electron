<script setup lang="ts">

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarInput,
} from '@renderer/components/ui/sidebar'
import {Search} from 'lucide-vue-next'
import {Label} from '@renderer/components/ui/label'
import {ref} from "vue";

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
          Search
        </Label>
        <SidebarInput
          id="search"
          placeholder="Search the docs..."
          class="pl-8"
          @input="handleSearch"
          v-model="a"
        />
        <Search class="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50"/>
      </SidebarGroupContent>
    </SidebarGroup>
  </form>
</template>
