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

const model = defineModel({ type: Boolean, required: true })

const messages = ref('')
const updating = ref(false)
onMounted(() => {
  window.electron.handleUpdateInfo((e, { updateEvent, text }) => {
    messages.value = text
    if (updateEvent === 'Error' || updateEvent === 'Update_not_available' || updateEvent === 'Update_downloaded') {
      updating.value = false
    }

  })

})
const checkUpdates = () => {
  updating.value = true
  window.electron.checkUpdate()
}
</script>

<template>
  <Dialog v-model:open="model" class="!p-0">
    <DialogContent class="sm:max-w-[475px]">
      <DialogHeader>
        <DialogTitle>!!Acerca de ... </DialogTitle>
        <DialogDescription>
          Infomación sobre esta versión.
        </DialogDescription>
      </DialogHeader>


      <div class="flex items-center gap-4  justify-between space-x-4">
        <div class="flex items-center  space-x-4">
          <Avatar>

            <AvatarFallback>PG</AvatarFallback>
          </Avatar>
          <div>
            <p class="text-sm font-medium leading-none">
              PG-Restore
            </p>
            <p class="text-sm text-muted-foreground">
              version 1.1.3
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

      <DialogFooter class="gap-0">
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

      </DialogFooter>
      <div class="flex justify-end space-x-4 text-sm text-muted-foreground mb-0">
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
    </DialogContent>
  </Dialog>
</template>

<style scoped>

</style>
