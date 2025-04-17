<script setup lang="ts">
import { Button } from '@renderer/components/ui/button'
import { computed, nextTick, onMounted, ref, toValue, watchEffect } from 'vue'
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



const coneccionSchema = z.object({
  backupPath: z.record(z.string(), z.any(), {
    required_error: 'seleccione un backup'
  }),
  dbName: z
    .string({
      required_error: 'Requerido.'
    })
    .min(1, { message: 'no vacio' })
})




const { handleSubmit, values, resetForm,setFieldValue } = useForm({
  validationSchema: computed(() => toTypedSchema(coneccionSchema)),
  keepValuesOnUnmount: true,

})
onMounted(()=>{
  isOpen.value = true;
  nextTick(()=>{
    setFieldValue('backupPath',{ path: 'store.currentConexionValues.backupPath' })
  })

})
const isFileSelected = computed(() => {
  return values.backupPath && values.backupPath.path
})
const onSubmit = handleSubmit((values) => {
  // if (!isConsoleOpen.value) {
  //   isRestoring.value = true
  //   const fileInputElement = document.getElementById('file_input')
  //
  //   if (isRestoreClone.value) {
  //     store.cloneDb(values)
  //   } else {
  //     store.restoreDb(values, newDb.value, fileInputElement?.files?.[0])
  //   }
  //
  //   isConsoleOpen.value = true
  // } else {
  //   store.isRestoreOpen = false
  // }
})


function test(){
  resetForm()
  console.log('a resetear')
  //setFieldValue('backupPath',undefined)
}


</script>

<template>
  <Sheet v-model:open="isOpen" >
    <SheetTrigger></SheetTrigger>
    <SheetContent side="bottom" class="rounded-t-lg">
      <SheetHeader class="pb-0">
        <SheetTitle>Restaurar backup</SheetTitle>
        <SheetDescription> fgdfg</SheetDescription>
      </SheetHeader>
      <form class="w-full flex flex-col pb-0" @onSubmit="onSubmit">
        <CardContent class="grid grid-cols-2 gap-2 overflow-y-auto pb-0">
          <!--          <div class="col-span-2">-->
          <!--            <FormField name="newDb">-->
          <!--              <FormItem class="flex flex-row items-center justify-between rounded-lg border p-4">-->
          <!--                <div class="space-y-0.5">-->
          <!--                  <FormLabel class="text-base"> Nueva</FormLabel>-->
          <!--                  <FormDescription> Crear una nueva db.</FormDescription>-->
          <!--                </div>-->
          <!--                <FormControl>-->
          <!--                  <Switch-->
          <!--                    id="new-db"-->
          <!--                    v-model:checked="newDb"-->
          <!--                    :disabled="isRestoreClone"-->
          <!--                  />-->
          <!--                </FormControl>-->
          <!--              </FormItem>-->
          <!--            </FormField>-->
          <!--          </div>-->
          <!--          <div v-if="isRestoreOnInit" class="col-span-2">-->
          <!--            <DatasourceSelect />-->
          <!--          </div>-->
          <!--          <div class="col-span-2" v-if="!newDb">-->
          <!--            <DbSelect :ds-name="currentDsName ?? ''" />-->
          <!--          </div>-->

          <!--          <div v-else>-->
          <!--            <FormField v-slot="{ componentField }" name="dbName">-->
          <!--              <FormItem>-->
          <!--                <FormLabel>DB</FormLabel>-->
          <!--                <FormControl>-->
          <!--                  <Input type="text" v-bind="componentField" />-->
          <!--                </FormControl>-->
          <!--                <FormMessage />-->
          <!--              </FormItem>-->
          <!--            </FormField>-->
          <!--          </div>-->

          <!--          <NewDbForm v-if="newDb" />-->

          <div class="col-span-2">
            <FormField v-slot="{ handleChange, handleBlur }" name="backupPath">
              <FormItem>
                <FormLabel
                >Backup file
                </FormLabel>
                <FormControl >
                  <Input id="file_input" type="file" @change="handleChange" @blur="handleBlur" />
                </FormControl>
                <FormDescription >
                  Archivo seleccionado {{ values.backupPath }}
                </FormDescription>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
        </CardContent>

        <!--        <RestoreConsole v-else @done="isRestoring = false" />-->
      </form>
      <SheetFooter class="pt-0">
        <Button @click="test" > Aceptar</Button>
      </SheetFooter>
    </SheetContent>
  </Sheet>
</template>

<style scoped></style>
