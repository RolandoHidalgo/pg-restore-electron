<script setup lang="ts">
import MainPage from '@renderer/components/MainPage.vue'
import BackupDrawer from '@renderer/components/BackupDrawer.vue'
import RestoreDrawer from '@renderer/components/RestoreDrawer.vue'
import AddDatasourceDialog from '@renderer/components/AddDatasourceDialog.vue'
import AboutDialog from '@renderer/components/Menu/AboutDialog.vue'
import SyncDialog from '@renderer/components/Menu/SyncDialog.vue'
import DeleteDatasourceDialog from '@renderer/components/DeleteDatasourceDialog.vue'
</script>

<template>
  <div class="bg-muted/40 h-full flex flex-col px-2 py-0">
    <MainPage />

    <BackupDrawer />
    <RestoreDrawer />
    <AddDatasourceDialog />
    <DeleteDatasourceDialog />
    <AboutDialog />
    <SyncDialog />
  </div>
</template>

<style></style>
