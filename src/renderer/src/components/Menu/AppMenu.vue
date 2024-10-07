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

const aboutOpen = ref(false)

const handleAbout = (event) => {
  aboutOpen.value = true
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
    </Menubar>
    <AboutDialog v-model="aboutOpen" />
  </div>
</template>

<style scoped>
//.drag{
//  -webkit-app-region: drag;
//}
//.no-drag{
//  -webkit-app-region: no-drag;
//}
//.fixed{
//  top:30px
//}
</style>
