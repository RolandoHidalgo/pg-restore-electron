<script setup lang="ts">
// import CreateAccount from './components/CreateAccount.vue'
import AppMenu from './components/Menu/AppMenu.vue'
import MainPage from '@renderer/components/MainPage.vue'
import { SidebarProvider, SidebarTrigger } from '@renderer/components/ui/sidebar'
import AppSidebar from '@renderer/components/Datasources/AppSidebar.vue'
</script>

<template>

  <div
    id="pepe"
    class="bg-muted/40 h-full flex flex-col p-2"
  >

    <AppMenu class="mb-2"/>
<!--    <CreateAccount />-->
<MainPage/>
  </div>
</template>

<style></style>
