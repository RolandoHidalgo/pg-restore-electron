<script setup lang="ts">
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub
} from '@renderer/components/ui/sidebar'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@renderer/components/ui/collapsible'
import {
  Minus,
  Plus,
  Database,
  ArrowUpRight,
  Link,
  MoreHorizontal,
  StarOff,
  Trash2,
  DatabaseBackup,
  DatabaseZap
} from 'lucide-vue-next'
import SchemaList from '@renderer/components/Datasources/SchemaList.vue'
import { useDbs } from '@renderer/composables'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@renderer/components/ui/dropdown-menu'

const props = defineProps<{ dsName: string }>()
const { dbs } = useDbs(() => props.dsName)
</script>

<template>
  <SidebarMenuItem v-for="db in dbs" :key="db">
    <Collapsible class="group/collapsible">
      <CollapsibleTrigger as-child>
        <SidebarMenuButton>
          <Database class="text-primary"/>
          {{ db }}
          <Plus class="ml-auto group-data-[state=open]/collapsible:hidden" />
          <Minus class="ml-auto group-data-[state=closed]/collapsible:hidden" />
        </SidebarMenuButton>

      </CollapsibleTrigger>
      <CollapsibleContent>
        <SidebarMenuSub>
          <SchemaList :ds-name="props.dsName" :db-name="db" />
        </SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
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
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <DatabaseZap class="text-muted-foreground" />
          <span>Restore</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </SidebarMenuItem>
</template>

<style scoped></style>
