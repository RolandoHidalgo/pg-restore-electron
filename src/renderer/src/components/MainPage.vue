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
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub
} from '@renderer/components/ui/sidebar'
import { Minus, Plus,Unplug } from 'lucide-vue-next'
import DBList from '@renderer/components/Datasources/DBList.vue'
import { useDataSource } from '@renderer/composables'


const {datasources} = useDataSource()


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
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  </SidebarContent>


</template>

<style scoped></style>
