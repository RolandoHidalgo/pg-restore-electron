<script setup lang="ts">
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger
} from '@renderer/components/ui/menubar'
import { onMounted, ref } from 'vue'
import AboutDialog from './AboutDialog.vue'
import AddDatasourceDialog from '@renderer/components/AddDatasourceDialog.vue'
import SyncDialog from '@renderer/components/Menu/SyncDialog.vue'
import { useDrives } from '@renderer/composables'
import {Usb,Info,CirclePlus } from 'lucide-vue-next'
const aboutOpen = ref(false)
const addDatasource = ref(false)
const isSyncDialogOpen = ref(false)
const currentUsbDrive = ref('')
const { drives } = useDrives()
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
</script>

<template>
  <div>
    <Menubar class="drag">
      <MenubarMenu>
        <MenubarTrigger class="no-drag">

          Ayuda
        </MenubarTrigger>
        <MenubarContent class="no-drag">
          <MenubarItem @click="handleAbout">
            <Info :size="16" class="mr-2"/>
            Acerca de
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger class="no-drag">Datasources</MenubarTrigger>
        <MenubarContent class="no-drag">

          <MenubarItem @click="handleDatasource"> <CirclePlus  :size="16" class="mr-2"/> Add Datasource </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger class="no-drag">Sincronizar</MenubarTrigger>
        <MenubarContent class="no-drag">
          <template v-for="drive in drives">
            <MenubarItem @click="handleSync(drive.mount)">

              <Usb :size="16" class="mr-2"/>{{ drive.name }} ({{ drive.mount }})
            </MenubarItem>
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
