<script setup lang="ts">
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@renderer/components/ui/drawer'
import { Button } from '@renderer/components/ui/button'
import { useApp } from '@renderer/composables'
import { useAppStore } from '@renderer/stores/appStore'
import { useTemplateRef, watchEffect } from 'vue'

const store = useAppStore()
const drawer = useTemplateRef('drawer')
watchEffect(() => {
  console.log('isOPne', store.isBackupOpen)
  if(drawer?.value){
    drawer.value.open = store.isBackupOpen
    console.log('drawerval', drawer.value)
    console.log('drawer', drawer)
    console.log('isOPne', store.isBackupOpen)
  }

})
</script>

<template>
  <Drawer ref="drawer" v-model:open="store.isBackupOpen">
    <DrawerTrigger>Open</DrawerTrigger>
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>Are you absolutely sure?</DrawerTitle>
        <DrawerDescription>This action cannot be undone.</DrawerDescription>
      </DrawerHeader>
      <DrawerFooter>
        <Button>Submit</Button>
        <DrawerClose>
          <Button variant="outline"> Cancel </Button>
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
</template>

<style scoped></style>
