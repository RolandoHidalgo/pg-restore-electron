<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@renderer/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@renderer/components/ui/sidebar'
import { ChevronsUpDown,  DatabaseZap,  Plus, Unplug,Star,Pencil,Trash } from 'lucide-vue-next'
import { computed, ref, watchEffect} from 'vue'
import {useDataSource} from "@renderer/composables";

import { useAppStore } from '@renderer/stores/appStore'
import { Button } from '@renderer/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@renderer/components/ui/tooltip'
import { DataSource } from '../../../../main/utils/restore/dataSourceUtils'
const {datasources,setDefaultDatasource,defaultDs} = useDataSource()


const activeDs = ref(datasources.value[0] ?? {name: '', binary: ''})
const currentBinary = computed(() => {
  return activeDs.value.binary !== '' ? `PostgreSQL v${activeDs.value.binary?.split('PostgreSQL')[1].split('\\')[1]}` : '';
})
const emit = defineEmits<{
  change: [ds: string]
}>()
watchEffect(() => {
  if (activeDs.value.name === '' && datasources.value[0]) {


    activeDs.value = datasources.value.filter(d => d.name===defaultDs.value)[0] ?? datasources.value[0]
    emit('change',activeDs.value.name)


  }

})

const handleActiveDs = (ds) => {
  activeDs.value = ds
  emit('change', ds.name)
}
function test(ds:DataSource){
  isOpen.value = false
  store.openDeleteDsForm(ds);
}
const isOpen = ref(false)
const store = useAppStore()
</script>
<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu v-model:open="isOpen">
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
<!--            <Button-->
<!--              variant="outline"-->
<!--              class="h-6 w-4.5 rounded-sm justify-self-end ml-auto"-->
<!--              @click.stop="test(ds)"-->
<!--              v-if="activeDs.name !== ds.name">-->
<!--              <Trash class="size-4 text-destructive" />-->
<!--            </Button>-->
            <TooltipProvider disable-closing-trigger>
              <Tooltip>
                <TooltipTrigger as-child>
                  <Button
                    variant="outline"
                    class="h-6 w-4.5 rounded-sm justify-self-end ml-auto"
                    @click.stop="test(ds)"
                    v-if="activeDs.name !== ds.name && defaultDs!==ds.name">
                    <Trash class="size-4 text-destructive" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent  variant="destructive">
                  <p>Delete datasource</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

          </DropdownMenuItem>
          <DropdownMenuSeparator/>
          <DropdownMenuLabel class="text-xs text-muted-foreground">
            Opciones del datasource
          </DropdownMenuLabel>
          <DropdownMenuItem class="gap-2 p-2" @click="store.openRestore(activeDs.name)" v-if="activeDs.name !==''">
            <div class="flex size-6 items-center justify-center rounded-md border bg-background">
              <DatabaseZap class="size-4"/>
            </div>
            <div class="font-medium text-muted-foreground">
              Restore
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem class="gap-2 p-2" @click="setDefaultDatasource(activeDs.name)" v-if="activeDs.name !=='' && activeDs.name !== defaultDs">
            <div class="flex size-6 items-center justify-center rounded-md border bg-background">
              <Star  class="size-4"/>
            </div>
            <div class="font-medium text-muted-foreground">
              Set default
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
          <DropdownMenuItem class="gap-2 p-2" @click="store.openDataSourceForm(activeDs)" v-if="activeDs.name !==''">
            <div class="flex size-6 items-center justify-center rounded-md border bg-background">
              <Pencil  class="size-4"/>
            </div>
            <div class="font-medium text-muted-foreground">
              Edit datasource
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

    </SidebarMenuItem>
  </SidebarMenu>
</template>
