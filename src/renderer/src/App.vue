<script setup lang="ts">
 //import CreateAccount from './components/CreateAccount.vue'
import AppMenu from './components/Menu/AppMenu.vue'
import MainPage from '@renderer/components/MainPage.vue'
import BackupDrawer from '@renderer/components/BackupDrawer.vue'
 import RestoreDrawer from '@renderer/components/RestoreDrawer.vue'


</script>

<template>

  <div
    id="pepe"
    class="bg-muted/40 h-full flex flex-col p-2"
  >

    <AppMenu class="mb-2"/>
<!--    <CreateAccount />-->
<MainPage />

    <BackupDrawer />
    <RestoreDrawer />
  </div>

</template>

<style></style>
