<script setup lang="ts">
import { SidebarMenuAction, SidebarMenuButton, SidebarMenuItem } from '@renderer/components/ui/sidebar'
import { useSchemas } from '@renderer/composables'
import { DatabaseBackup, MoreHorizontal, Network } from 'lucide-vue-next'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@renderer/components/ui/dropdown-menu'

const props = defineProps<{ dsName: string; dbName: string }>()
const { schemas } = useSchemas(
  () => props.dsName,
  () => props.dbName
)
</script>

<template>
  <SidebarMenuItem v-for="schema in schemas" :key="schema">
    <SidebarMenuButton>
      <Network />
      {{ schema }}
    </SidebarMenuButton>
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <SidebarMenuAction show-on-hover>
          <MoreHorizontal />
          <span class="sr-only">More</span>
        </SidebarMenuAction>
      </DropdownMenuTrigger>
      <DropdownMenuContent class="w-26 rounded-lg" side="bottom" align="end">
        <DropdownMenuItem>
          <DatabaseBackup class="text-muted-foreground" />
          <span>Backup</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </SidebarMenuItem>
</template>

<style scoped></style>
