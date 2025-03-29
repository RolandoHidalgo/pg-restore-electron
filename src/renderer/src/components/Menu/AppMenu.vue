<script setup lang="ts">
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger
} from '@renderer/components/ui/menubar'
import { onMounted, ref } from 'vue'
import AboutDialog from './AboutDialog.vue'
import AddDatasourceDialog from '@renderer/components/AddDatasourceDialog.vue'
import SyncDialog from '@renderer/components/Menu/SyncDialog.vue'

const aboutOpen = ref(false)
const addDatasource = ref(false)
const isSyncDialogOpen = ref(false)
const currentUsbDrive = ref('')
const drives = ref<{ name: string; mount: string }[]>([])
const handleAbout = (event) => {
  aboutOpen.value = true
}
const handleDatasource = (event) => {
  addDatasource.value = true
}
const handleSync = (usbDrive) => {
  currentUsbDrive.value = usbDrive
  isSyncDialogOpen.value = true
}
onMounted(async () => {
  drives.value = await window.electron.getDrives()
})
</script>

<template>
  <div>
    <Menubar class="drag">
      <MenubarMenu>
        <MenubarTrigger class="no-drag">Ayuda</MenubarTrigger>
        <MenubarContent class="no-drag">
          <MenubarItem @click="handleAbout"> Acerca de </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger class="no-drag">Datasources</MenubarTrigger>
        <MenubarContent class="no-drag">
          <MenubarItem @click="handleDatasource"> Add Datasource </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger class="no-drag">Sincronizar con...</MenubarTrigger>
        <MenubarContent class="no-drag">
          <template v-for="drive in drives">
            <MenubarItem @click="handleSync(drive.mount)"> {{ drive.name }} ({{ drive.mount }}) </MenubarItem>
          </template>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
    <AboutDialog v-model="aboutOpen" />
    <AddDatasourceDialog v-model="addDatasource" />
    <SyncDialog v-model="isSyncDialogOpen" :usb-drive="currentUsbDrive" />
  </div>
</template>

<style scoped></style>
