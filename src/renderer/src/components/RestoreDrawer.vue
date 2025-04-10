<script setup lang="ts">

import { Button } from '@renderer/components/ui/button'
import { computed, onBeforeMount, ref, watchEffect } from 'vue'
import { ReloadIcon } from '@radix-icons/vue'
import { z } from 'zod'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import {
  FormControl, FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@renderer/components/ui/form'

import BinarySelect from '@renderer/components/BinarySelect.vue'
import { CardContent } from '@renderer/components/ui/card'
import { Input } from '@renderer/components/ui/input'
import { useAppStore } from '@renderer/stores/appStore'
import {
  Sheet,
  SheetContent,
  SheetDescription, SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@renderer/components/ui/sheet'
import RestoreConsole from '@renderer/components/restore-console.vue'
import NewDbForm from '@renderer/components/NewDbForm.vue'
import { Switch } from '@renderer/components/ui/switch'
import { Label } from '@renderer/components/ui/label'
const store = useAppStore();
const isConsoleOpen = ref(false)
const newDb = ref(false)
const isRestoring = ref(false)
const newDbSchema = z.object({
  encoding: z.string({
    required_error: 'Requerido.'
  }),
  template: z.string({
    required_error: 'Requerido.'
  }),
  collate: z.string({
    required_error: 'Requerido.'
  }),
  ctype: z.string({
    required_error: 'Requerido.'
  }),
  tablespace: z.string({
    required_error: 'Requerido.'
  })
})

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




// onBeforeMount(() => {
//   window.electron.getFileArg().then((data) => {
//     console.log(data, 'la data')
//     if (data !== null) {
//       setFieldValue('backupPath', { path: data })
//     }
//   })
// })

const { handleSubmit,  values,resetForm } = useForm({
  validationSchema: computed(() =>
    toTypedSchema(
      newDb.value ? coneccionSchema.merge(newDbSchema).passthrough() : coneccionSchema.passthrough()
    )
  ),
  keepValuesOnUnmount: true
})

const onSubmit = handleSubmit((values) => {
if(!isConsoleOpen.value) {
  isRestoring.value = true
  const fileInputElement = document.getElementById('file_input')
  console.log(values)

  store.restoreDb(values,newDb.value,fileInputElement.files[0])
  isConsoleOpen.value = true;
}else{
  store.isRestoreOpen = false;
}

})

const isFileSelected = computed(() => {
  return values.backupPath && values.backupPath.path
})
watchEffect(() => {
  if (!store.isRestoreOpen) {
    isConsoleOpen.value = false
    resetForm()
  }
})

</script>

<template>
  <Sheet v-model:open="store.isRestoreOpen" >
    <SheetTrigger >
    </SheetTrigger>
    <SheetContent side="bottom" class="rounded-t-lg">
      <SheetHeader class="pb-0">
        <SheetTitle>Restaurar backup</SheetTitle>
        <SheetDescription>
          LLene los campos
        </SheetDescription>
      </SheetHeader>
        <form class="w-full flex flex-col pb-0" @submit="onSubmit" >
          <CardContent class="grid grid-cols-2 gap-2 overflow-y-auto pb-0" v-if="!isConsoleOpen">
            <div class="col-span-2">
              <FormField  name="newDb">
                <FormItem class="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div class="space-y-0.5">
                    <FormLabel class="text-base">
                      Nueva
                    </FormLabel>
                    <FormDescription>
                      Crear una nueva db.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch id="new-db" v-model:checked="newDb" />
                  </FormControl>
                </FormItem>
              </FormField>


            </div>
              <div class="col-span-2" >
                <FormField v-slot="{ componentField }" name="dbName">
                  <FormItem>
                    <FormLabel>DB</FormLabel>
                    <FormControl>
                      <Input type="text" v-bind="componentField" />

                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>
              <NewDbForm v-if="newDb" />



              <div class="col-span-2">
                <FormField v-slot="{ handleChange, handleBlur }" name="backupPath">
                  <FormItem>
                    <FormLabel>Backup file</FormLabel>
                    <FormControl>
                      <Input id="file_input" type="file" @change="handleChange" @blur="handleBlur" />
                    </FormControl>
                    <FormDescription v-if="isFileSelected">
                      Archivo seleccionado {{ values.backupPath?.path }}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>


          </CardContent>
          <RestoreConsole v-else @done="isRestoring = false"/>
        </form>

      <SheetFooter class="pt-0">
        <Button @click="onSubmit" :disabled="isRestoring">

          Aceptar
        </Button>
      </SheetFooter>
    </SheetContent>
  </Sheet>

</template>

<style scoped></style>
