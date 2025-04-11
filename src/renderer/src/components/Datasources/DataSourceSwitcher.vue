<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@renderer/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@renderer/components/ui/sidebar'
import { ChevronsUpDown,  DatabaseZap,  Plus, Unplug } from 'lucide-vue-next'
import {type Component, computed, ref, watchEffect} from 'vue'
import {useDataSource} from "@renderer/composables";

import { useAppStore } from '@renderer/stores/appStore'

const {datasources} = useDataSource()
console.log(datasources.value, 'ASDASDASDASDASDASDASD');

const activeDs = ref(datasources.value[0] ?? {name: '', binary: ''})
const currentBinary = computed(() => {
  return activeDs.value.binary !== '' ? `PostgreSQL v${activeDs.value.binary?.split('PostgreSQL')[1].split('\\')[1]}` : '';
})
const emit = defineEmits<{
  change: [ds: string]
}>()
watchEffect(() => {
  if (activeDs.value.name === '' && datasources.value[0]) {


    activeDs.value = datasources.value[0]
    emit('change', datasources.value[0].name)


  }

})

const handleActiveDs = (ds) => {
  activeDs.value = ds
  emit('change', ds.name)
}
const store = useAppStore()
</script>
<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton
            size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <div
              class="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <component :is="Unplug" class="size-4"/>
            </div>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-semibold capitalize">
                {{ activeDs.name }}
              </span>
              <span class="truncate text-xs">{{ currentBinary }}</span>
            </div>
            <ChevronsUpDown class="ml-auto"/>
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          class="w-[--reka-dropdown-menu-trigger-width] min-w-56 rounded-lg"
          align="start"
          side="bottom"
          :side-offset="4"
        >
          <DropdownMenuLabel class="text-xs text-muted-foreground">
            Datasources
          </DropdownMenuLabel>
          <DropdownMenuItem
            v-for="(ds, index) in datasources"
            :key="ds.name"
            class="gap-2 p-2"
            @click="handleActiveDs(ds)"
          >
            <div class="flex size-6 items-center justify-center rounded-sm border">
              <component :is="Unplug" class="size-4 shrink-0"/>
            </div>
            {{ ds.name }}@{{ ds.host }}
            <DropdownMenuShortcut>⌘{{ index + 1 }}</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator/>
          <DropdownMenuLabel class="text-xs text-muted-foreground">
            Opciones del datasource
          </DropdownMenuLabel>
          <DropdownMenuItem class="gap-2 p-2" @click="store.openRestore(activeDs.name)">
            <div class="flex size-6 items-center justify-center rounded-md border bg-background">
              <DatabaseZap class="size-4"/>
            </div>
            <div class="font-medium text-muted-foreground">
              Restore
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem class="gap-2 p-2" @click="store.openDataSourceForm()">
            <div class="flex size-6 items-center justify-center rounded-md border bg-background">
              <Plus class="size-4"/>
            </div>
            <div class="font-medium text-muted-foreground">
              Add datasource
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

    </SidebarMenuItem>
  </SidebarMenu>
</template>
