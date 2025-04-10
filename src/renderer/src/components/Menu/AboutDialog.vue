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
import {
  Avatar,
  AvatarFallback
} from '@renderer/components/ui/avatar'
import { GithubLogoIcon } from '@radix-icons/vue'
import { onMounted, ref } from 'vue'
import { ReloadIcon } from '@radix-icons/vue'
import {
  Sheet,
  SheetContent,
  SheetDescription, SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@renderer/components/ui/sheet'
import { DatabaseBackup, Network, Unplug } from 'lucide-vue-next'
import RestoreConsole from '@renderer/components/restore-console.vue'

const model = defineModel({ type: Boolean, required: true })

const messages = ref('')
const updating = ref(false)
const version = ref('');
onMounted(async () => {

  window.electron.handleUpdateInfo((e, { updateEvent, text }) => {
    messages.value = text
    if (updateEvent === 'Error' || updateEvent === 'Update_not_available' || updateEvent === 'Update_downloaded') {
      updating.value = false
    }

  })
  version.value =await window.electron.obtenerVersion()
})
const checkUpdates = () => {
  updating.value = true
  window.electron.checkUpdate()
}
</script>

<template>
  <Sheet v-model:open="model" class="p-0!">
    <SheetTrigger></SheetTrigger>
    <SheetContent side="bottom" class="rounded-t-lg">
      <SheetHeader>
        <SheetTitle>Acerca de ... </SheetTitle>
        <SheetDescription> Infomación sobre esta versión.</SheetDescription>
      </SheetHeader>
      <div class="flex items-center gap-4  justify-between space-x-4 px-2">
        <div class="flex items-center  space-x-4">
          <Avatar>

            <AvatarFallback>PG</AvatarFallback>
          </Avatar>
          <div>
            <p class="text-sm font-medium leading-none">
              PG-Restore
            </p>
            <p class="text-sm text-muted-foreground">
              version {{version}}
            </p>
          </div>
        </div>
        <a href="https://github.com/RolandoHidalgo/pg-restore-electron" target="_blank">
          <Button variant="outline">
            <GithubLogoIcon class="mr-2 h-4 w-4" />
            GitHub
          </Button>
        </a>
      </div>
      {{ messages }}
      <div class="flex justify-end space-x-4 text-sm text-muted-foreground mb-0 px-3">
        <div>
          Created and maintained by
          <a
            href="https://github.com/RolandoHidalgo"
            target="_blank"
            class="text-primary"
          >
            @SkidRow
          </a>
        </div>

      </div>
      <SheetFooter>
        <Button
          @click="checkUpdates"
          :disabled="updating"
        >
          <ReloadIcon
            class="w-4 h-4 mr-2 animate-spin"
            v-if="updating"
          />
          Actualizar
        </Button>
      </SheetFooter>
    </SheetContent>
  </Sheet>

</template>

<style scoped>

</style>
