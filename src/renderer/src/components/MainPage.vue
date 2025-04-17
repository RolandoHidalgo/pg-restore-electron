<script setup lang="ts">
// import AppSidebar from '@renderer/components/Datasources/AppSidebar.vue'
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent
} from '@renderer/components/ui/collapsible'
// import { ChevronRight } from 'lucide-vue-next'
import {
  SidebarContent, SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader,
  SidebarMenu, SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub
} from '@renderer/components/ui/sidebar'
import {GalleryVerticalEnd, DatabaseZap, Minus, MoreHorizontal, Plus, Unplug,AudioWaveform,Command} from 'lucide-vue-next'
import DBList from '@renderer/components/Datasources/DBList.vue'
import {useDataSource} from '@renderer/composables'
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@renderer/components/ui/dropdown-menu'
import {useAppStore} from '@renderer/stores/appStore'
import DataSourceSwitcher from "@renderer/components/Datasources/DataSourceSwitcher.vue";
import {ref} from "vue";
import SearchForm from "@renderer/components/Datasources/SearchForm.vue";
import OptionsMenu from '@renderer/components/Datasources/OptionsMenu.vue'
import DatasourceOptions from '@renderer/components/Datasources/DatasourceOptions.vue'


const {datasources} = useDataSource()
const store = useAppStore()
const currentDs = ref('')
const search = ref('')
</script>

<template>
  <SidebarHeader>
    <DataSourceSwitcher @change="currentDs=$event"/>
  </SidebarHeader>
  <SearchForm @input="search=$event"></SearchForm>
  <SidebarContent>
    <SidebarGroup>
      <SidebarGroupLabel>Databases</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <DBList :ds-name="currentDs" :search="search"></DBList>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  </SidebarContent>
  <SidebarFooter>
    <OptionsMenu/>

  </SidebarFooter>

</template>

<style scoped></style>
