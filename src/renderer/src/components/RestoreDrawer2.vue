<script setup lang="ts">
import { Button } from '@renderer/components/ui/button'
import { computed, onMounted, ref, toValue, watchEffect } from 'vue'
import { z } from 'zod'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@renderer/components/ui/form'

import { CardContent } from '@renderer/components/ui/card'
import { Input } from '@renderer/components/ui/input'
import { useAppStore } from '@renderer/stores/appStore'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@renderer/components/ui/sheet'
import RestoreConsole from '@renderer/components/restore-console.vue'
import NewDbForm from '@renderer/components/NewDbForm.vue'
import { Switch } from '@renderer/components/ui/switch'
import DatasourceSelect from '@renderer/components/DatasourceSelect.vue'
import DbSelect from '@renderer/components/DbSelect.vue'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@renderer/components/ui/hover-card'
import { CalendarIcon, Info } from 'lucide-vue-next'
import useBackupInfo from '@renderer/composables/useBackupInfo'
import useRestoreOnInitApi from '@renderer/composables/useRestoreOnInitApi'
import useRestoreCloneApi from '@renderer/composables/useRestoreCloneApi'
import TestForm from '@renderer/components/TestForm.vue'
const isOpen = ref(false);

onMounted(()=>{

  isOpen.value = true;
})


</script>

<template>
  <Sheet v-model:open="isOpen" >
    <SheetTrigger></SheetTrigger>
    <SheetContent side="bottom" class="rounded-t-lg">
      <SheetHeader class="pb-0">
        <SheetTitle>Restaurar backup</SheetTitle>
        <SheetDescription> fgdfg</SheetDescription>
      </SheetHeader>
      <TestForm/>
    </SheetContent>
  </Sheet>
</template>

<style scoped></style>
