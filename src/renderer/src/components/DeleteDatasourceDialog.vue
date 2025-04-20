<script setup lang="ts">
import { Button } from '@renderer/components/ui/button'
import { computed, ref, watchEffect } from 'vue'
import { ReloadIcon } from '@radix-icons/vue'


import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@renderer/components/ui/sheet'
import { useAppStore } from '@renderer/stores/appStore'
import { useDataSourceStore } from '@renderer/stores/datasourceStore'
import { Computer, Tag, Unplug } from 'lucide-vue-next'

const store = useAppStore()
const dsStore = useDataSourceStore()
const updating = ref(false)

const currentBinary = computed(() => {
  return store.currentDsForm?.binary && store.currentDsForm?.binary !== '' ? `PostgreSQL v${store.currentDsForm.binary?.split('PostgreSQL')[1].split('\\')[1]}` : '';
})

async function deleteDs(){
  await dsStore.deleteDataSource( store.currentDsForm.name);
  store.isDataSourceDeleteFormOpen = false;
  store.currentDsForm = null
}
watchEffect(() => {
  if (!store.isDataSourceFormOpen) {

    store.currentDsForm = null

  }
  // else {
  //   if (store.currentDsForm) {

  //   }
  // }
})
</script>

<template>
  <Sheet v-model:open="store.isDataSourceDeleteFormOpen" class="p-0!">
    <SheetTrigger></SheetTrigger>
    <SheetContent side="bottom" class="rounded-t-lg">
      <SheetHeader>
        <SheetTitle>Eliminar datasource</SheetTitle>
        <SheetDescription> Parámetros de conexión.</SheetDescription>
      </SheetHeader>
      <form class="grid gap-4 px-4">
        <div class="grid grid-cols-2 gap-2 overflow-y-auto pb-0" >
          <div class=" flex items-center justify-center">
            <Unplug class="h-6 w-6 text-primary mr-2" />
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate text-xs">Name</span>
              <span class="truncate font-semibold">{{ store.currentDsForm?.name }}</span>
            </div>
          </div>
          <div class=" flex items-center justify-center">
            <Computer  class="h-6 w-6 text-primary mr-2" />
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate text-xs">Host</span>
              <span class="truncate font-semibold">{{ store.currentDsForm?.host }}</span>
            </div>
          </div>
          <div class=" flex items-center justify-center">
            <Tag class="h-6 w-6 text-primary mr-2" />
            <div
              class="grid flex-1 text-left text-sm leading-tight"

            >
              <span class="truncate text-xs">Version</span>
              <span class="truncate font-semibold">{{currentBinary}}</span>
            </div>
          </div>
        </div>

      </form>
      <SheetFooter>
        <Button @click="deleteDs" :disabled="updating" variant="destructive">
          <ReloadIcon class="w-4 h-4 mr-2 animate-spin" v-if="updating" />
          Eliminar
        </Button>
      </SheetFooter>
    </SheetContent>
  </Sheet>
</template>

<style scoped></style>
