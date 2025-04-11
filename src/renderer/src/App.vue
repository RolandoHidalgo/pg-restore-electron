<script setup lang="ts">
 //import CreateAccount from './components/CreateAccount.vue'
import AppMenu from './components/Menu/AppMenu.vue'
import MainPage from '@renderer/components/MainPage.vue'
import BackupDrawer from '@renderer/components/BackupDrawer.vue'
 import RestoreDrawer from '@renderer/components/RestoreDrawer.vue'

 import AddDatasourceDialog from '@renderer/components/AddDatasourceDialog.vue'
 import AboutDialog from '@renderer/components/Menu/AboutDialog.vue'
 import SyncDialog from '@renderer/components/Menu/SyncDialog.vue'
 import { onBeforeMount } from 'vue'
 import { useAppStore } from '@renderer/stores/appStore'
 const store = useAppStore()
 onBeforeMount(() => {
    store.handleBakupOnStart()
 })

</script>

<template>

  <div
    id="pepe"
    class="bg-muted/40 h-full flex flex-col px-2 py-0"
  >

<MainPage />

    <BackupDrawer />
    <RestoreDrawer />
    <AddDatasourceDialog />
    <AboutDialog />
    <SyncDialog />
  </div>

</template>

<style></style>
