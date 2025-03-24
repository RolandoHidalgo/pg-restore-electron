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
import { ref } from 'vue'
import AboutDialog from './AboutDialog.vue'
import AddDatasourceDialog from "@renderer/components/AddDatasourceDialog.vue";

const aboutOpen = ref(false)
const addDatasource = ref(false)

const handleAbout = (event) => {
  aboutOpen.value = true
}
const handleDatasource = (event) => {
  addDatasource.value = true
}
</script>

<template>
  <div>
    <Menubar class="drag">
      <MenubarMenu >
        <MenubarTrigger class="no-drag">Ayuda</MenubarTrigger>
        <MenubarContent class="no-drag">
          <MenubarItem @click="handleAbout">
            Acerca de
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu >
        <MenubarTrigger class="no-drag">Datasources</MenubarTrigger>
        <MenubarContent class="no-drag">
          <MenubarItem @click="handleDatasource">
            Add Datasource
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
    <AboutDialog v-model="aboutOpen" />
    <AddDatasourceDialog v-model="addDatasource" />

  </div>
</template>

<style scoped>

</style>
