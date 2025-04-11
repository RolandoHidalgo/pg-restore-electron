<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@renderer/components/ui/dialog'
import { Button } from '@renderer/components/ui/button'
import { computed, onMounted, ref } from 'vue'
import { GithubLogoIcon, ReloadIcon } from '@radix-icons/vue'
import { Progress } from '@renderer/components/ui/progress'
import { useAppStore } from '@renderer/stores/appStore'
import {
  Sheet, SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@renderer/components/ui/sheet'
import { Avatar, AvatarFallback } from '@renderer/components/ui/avatar'

const store = useAppStore()


const currentMessage = ref('')
const currentCode = ref(0)
const progress = ref(0)
const syncing = ref(false)
onMounted(() => {
  window.electron.handleSyncEvent((event, value) => {
    currentCode.value = value.code
    currentMessage.value = value.info
    if (value.code > 1 && value.code < 4) {
      progress.value = progress.value + 33
    } else if (value.code === 4) {
      progress.value = 100
      syncing.value = false
    }
  })
})
const showSyncButton = computed(() => {
  return currentCode.value === 0 || currentCode.value === 4;
})
const sincronizar = async () => {
  syncing.value = true
  await window.electron.sincronizarUsb(store.currentUsbDrive)
}
const handleOpen = (event)=>{
  if(!event){
    currentCode.value = 0
    currentMessage.value = ''
    progress.value = 0
  }
}
</script>

<template>
  <Sheet v-model:open="store.isSyncOpen" class="p-0!" @update:open="handleOpen">
    <SheetTrigger></SheetTrigger>
    <SheetContent side="bottom" class="rounded-t-lg grid w-full  gap-4  border p-6  sm:max-w-lg">
      <SheetHeader>
        <SheetTitle>Sincronizar con USB</SheetTitle>
        <SheetDescription>sincronizar con {{ store.currentUsbDrive }}.</SheetDescription>
      </SheetHeader>

                <p v-if="currentCode === 0">Esta seguro que desa sincronizar!</p>
        <div v-else>
          <p class="text-sm font-medium leading-none">
            <Progress :model-value="progress" />
          </p>
          <p class="text-sm text-muted-foreground">
            {{ currentMessage }}
          </p>
        </div>

      <SheetFooter>
        <Button @click="sincronizar" :disabled="syncing">
          <ReloadIcon class="w-4 h-4 mr-2 animate-spin" v-if="syncing" />
          Sincronizar
        </Button>
      </SheetFooter>
    </SheetContent>
  </Sheet>
</template>

<style scoped></style>
