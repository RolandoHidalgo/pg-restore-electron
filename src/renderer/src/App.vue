<script setup lang="ts">
// import CreateAccount from './components/CreateAccount.vue'
import AppMenu from './components/Menu/AppMenu.vue'
import MainPage from '@renderer/components/MainPage.vue'
import BackupDrawer from '@renderer/components/BackupDrawer.vue'
import { useAppStore } from '@renderer/stores/appStore'
const store = useAppStore();
</script>

<template>

  <div
    id="pepe"
    class="bg-muted/40 h-full flex flex-col p-2"
  >
{{store.isBackupOpen}}
    <AppMenu class="mb-2"/>
<!--    <CreateAccount />-->
<MainPage/>
    <BackupDrawer />
  </div>

</template>

<style></style>
