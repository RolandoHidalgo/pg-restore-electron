<script setup lang="ts">

import { Button } from '@renderer/components/ui/button'
import { useAppStore } from '@renderer/stores/appStore'

import {   Sheet,

  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger, } from '@renderer/components/ui/sheet'
import {  ref } from 'vue'
import RestoreConsole from '@renderer/components/restore-console.vue'

const store = useAppStore()
const isConsoleOpen = ref(false)
function handleBackup(){
  isConsoleOpen.value = true;
  store.createBackup();
}
</script>

<template>
  <div>
<!--    <Button variant="outline" @click="handleOPen">-->
<!--      con este-->
<!--    </Button>-->
    <Sheet v-model:open="store.isBackupOpen" @update:open="isConsoleOpen=false">
      <SheetTrigger >
      </SheetTrigger>
      <SheetContent side="bottom" class="rounded-t-lg">
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Backup.
          </SheetDescription>
        </SheetHeader>
        <div class="grid gap-4 py-4">
          <div v-if="!isConsoleOpen">
            datos de la conexion {{store.currentConexionValues}}
          </div>
          <RestoreConsole v-else/>
        </div>
        <SheetFooter>
          <Button  @click.prevent="handleBackup">
            Crear backup
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  </div>
</template>

<style scoped></style>
