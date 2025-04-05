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
import { Avatar, AvatarFallback } from '@renderer/components/ui/avatar'
import { GithubLogoIcon } from '@radix-icons/vue'
import { computed, onMounted, ref } from 'vue'
import { ReloadIcon } from '@radix-icons/vue'
import { Progress } from '@renderer/components/ui/progress'

const model = defineModel({ type: Boolean, required: true })
const props = defineProps<{ usbDrive: string }>()


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
  await window.electron.sincronizarUsb(props.usbDrive)
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
  <Dialog v-model:open="model" class="p-0!" @update:open="handleOpen">
    <DialogContent class="sm:max-w-[475px]" >
      <DialogHeader>
        <DialogTitle>Sincronizar con USB</DialogTitle>
        <DialogDescription> sincronizar con {{ props.usbDrive }}.</DialogDescription>
      </DialogHeader>

      <p v-if="currentCode === 0">Esta seguro que desa sincronizar!</p>
      <div v-else>
        <p class="text-sm font-medium leading-none">
          <Progress :model-value="progress" />
        </p>
        <p class="text-sm text-muted-foreground">
          {{ currentMessage }}
        </p>
      </div>

      <DialogFooter class="gap-0">
        <Button @click="sincronizar" :disabled="syncing">
          <ReloadIcon class="w-4 h-4 mr-2 animate-spin" v-if="syncing" />
          Sincronizar
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<style scoped></style>
