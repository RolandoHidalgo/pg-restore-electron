<script setup lang="ts">
// import AppSidebar from '@renderer/components/Datasources/AppSidebar.vue'
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent
} from '@renderer/components/ui/collapsible'
// import { ChevronRight } from 'lucide-vue-next'
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu, SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub
} from '@renderer/components/ui/sidebar'
import { DatabaseBackup, DatabaseZap, Minus, MoreHorizontal, Plus, Unplug } from 'lucide-vue-next'
import DBList from '@renderer/components/Datasources/DBList.vue'
import { useDataSource } from '@renderer/composables'
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@renderer/components/ui/dropdown-menu'
import { useAppStore } from '@renderer/stores/appStore'


const {datasources} = useDataSource()
const store = useAppStore()

</script>

<template>

  <SidebarContent>
    <SidebarGroup>
      <SidebarGroupLabel>Datasources</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem v-for="(item, index) in datasources" :key="item.name">
            <Collapsible :default-open="index === 0" class="group/collapsible">
              <CollapsibleTrigger as-child>
                <SidebarMenuButton>
                  <Unplug class="text-primary"/>
                  {{ item.text }}
                  <Plus class="ml-auto group-data-[state=open]/collapsible:hidden" />
                  <Minus class="ml-auto group-data-[state=closed]/collapsible:hidden" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  <DBList :ds-name="item.name" />
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
                <DropdownMenuItem @click="store.openRestore(item.name)">
                  <DatabaseZap class="text-muted-foreground" />
                  <span>Restore</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  </SidebarContent>


</template>

<style scoped></style>
