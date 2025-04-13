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
  Copy,
  MoreHorizontal,
  DatabaseBackup,
  DatabaseZap
} from 'lucide-vue-next'
import SchemaList from '@renderer/components/Datasources/SchemaList.vue'
import { useApp, useDbs } from '@renderer/composables'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@renderer/components/ui/dropdown-menu'
import {computed,  watchEffect} from 'vue'

const props = defineProps<{ dsName: string,search:string }>()
const { dbs } = useDbs(() => props.dsName)
const {openBackup,openRestore,openClone}=useApp()
watchEffect(()=>{
  console.log(props.search)
})
const currentDbs = computed(()=>{
  if(props.search!==''){
    return dbs.value.filter(db=>db.startsWith(props.search))
  }
  return dbs.value
})
</script>

<template>

  <SidebarMenuItem v-for="db in currentDbs" :key="db">
    <Collapsible class="group/collapsible">
      <CollapsibleTrigger as-child>
        <SidebarMenuButton>
          <Database class="text-blue-600"/>
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
        <DropdownMenuItem @click="openBackup(props.dsName,db)">
          <DatabaseBackup class="text-muted-foreground" />
          <span >Backup</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem @click="openRestore(props.dsName,db)">
          <DatabaseZap class="text-muted-foreground" />
          <span>Restore</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem @click="openClone(props.dsName,db)">
          <Copy class="text-muted-foreground" />
          <span>Clone to</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </SidebarMenuItem>
</template>

<style scoped></style>
