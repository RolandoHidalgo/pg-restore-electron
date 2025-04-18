<script setup lang="ts">
import { SidebarMenuAction, SidebarMenuButton, SidebarMenuItem } from '@renderer/components/ui/sidebar'
import { useApp, useSchemas } from '@renderer/composables'
import { DatabaseBackup, MoreHorizontal, Network } from 'lucide-vue-next'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@renderer/components/ui/dropdown-menu'
import { Skeleton } from '@renderer/components/ui/skeleton'

const props = defineProps<{ dsName: string; dbName: string }>()
const { schemas,loadingSchemas } = useSchemas(
  () => props.dsName,
  () => props.dbName
)
const {openBackup}=useApp()
</script>

<template>
  <template v-if="!loadingSchemas">
    <SidebarMenuItem v-for="schema in schemas" :key="schema">
      <SidebarMenuButton>
        <Network class="text-blue-500"/>
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
          <DropdownMenuItem @click="openBackup(props.dsName,props.dbName,schema)">
            <DatabaseBackup class="text-muted-foreground" />
            <span>Backup</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </template>
  <template v-else>
    <div class="flex items-center space-x-4 mb-3">
      <Skeleton class="h-4 w-4 rounded-full" />
      <div class="space-y-2">
        <Skeleton class="h-3 w-[150px]" />
      </div>
      <Skeleton class="h-3 w-3 rounded-full ml-auto" />
    </div>
    <div class="flex items-center space-x-4 mb-3">
      <Skeleton class="h-4 w-4 rounded-full" />
      <div class="space-y-2">
        <Skeleton class="h-3 w-[150px]" />
      </div>
      <Skeleton class="h-3 w-3 rounded-full ml-auto" />
    </div>
  </template>
</template>

<style scoped></style>
