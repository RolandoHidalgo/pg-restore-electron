<script setup lang="ts">
import { Button } from '@renderer/components/ui/button'
import { computed, ref, toValue, watchEffect } from 'vue'
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

const store = useAppStore()
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



const currentSchema = ref(coneccionSchema);

const finalSchema = computed(() => {
  let schema = toValue(currentSchema)
  if (newDb.value) {
    schema = schema.merge(newDbSchema)
  }

  return schema.passthrough()
})
const { handleSubmit, values, resetForm,setFieldValue } = useForm({
  validationSchema: computed(() => toTypedSchema(finalSchema.value)),
  keepValuesOnUnmount: true
})
const {isRestoreClone} = useRestoreCloneApi(currentSchema,newDb);
const backupInfo = useBackupInfo()
const {isRestoreOnInit} = useRestoreOnInitApi(currentSchema)


const isFileSelected = computed(() => {
  return values.backupPath && values.backupPath.path
})
const onSubmit = handleSubmit((values) => {
  if (!isConsoleOpen.value) {
    isRestoring.value = true
    const fileInputElement = document.getElementById('file_input')

    if (isRestoreClone.value) {
      store.cloneDb(values)
    } else {
      store.restoreDb(values, newDb.value, fileInputElement?.files?.[0])
    }

    isConsoleOpen.value = true
  } else {
    store.isRestoreOpen = false
  }
})

watchEffect(() => {
  if (!store.isRestoreOpen) {
    isConsoleOpen.value = false
    resetForm()
    //setFieldValue('backupPath',undefined)
    isRestoring.value = false
    newDb.value = false
  }
})
const currentDsName = computed(() => {
  const ccv = store.currentConexionValues.dsName
  return ccv !== '' ? ccv : values.dsName
})

function test(){
  resetForm()
  //setFieldValue('backupPath',undefined)
}

</script>

<template>
  <Sheet v-model:open="store.isRestoreOpen">
    <SheetTrigger></SheetTrigger>
    <SheetContent side="bottom" class="rounded-t-lg">
      <SheetHeader class="pb-0">
        <SheetTitle>Restaurar backup</SheetTitle>
        <SheetDescription> LLene los campos</SheetDescription>
      </SheetHeader>
      <form class="w-full flex flex-col pb-0" @submit="onSubmit">
        <CardContent class="grid grid-cols-2 gap-2 overflow-y-auto pb-0" v-if="!isConsoleOpen">
          <div class="col-span-2">
            <FormField name="newDb">
              <FormItem class="flex flex-row items-center justify-between rounded-lg border p-4">
                <div class="space-y-0.5">
                  <FormLabel class="text-base"> Nueva</FormLabel>
                  <FormDescription> Crear una nueva db.</FormDescription>
                </div>
                <FormControl>
                  <Switch
                    id="new-db"
                    v-model:checked="newDb"
                    :disabled="isRestoreClone"
                  />
                </FormControl>
              </FormItem>
            </FormField>
          </div>
          <div v-if="isRestoreOnInit" class="col-span-2">
            <DatasourceSelect />
          </div>
          <div class="col-span-2" v-if="!newDb">
            <DbSelect :ds-name="currentDsName ?? ''" />
          </div>

          <div v-else>
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

          <div class="col-span-2" v-if="!isRestoreClone">
            <FormField v-slot="{ handleChange, handleBlur }" name="backupPath">
              <FormItem>
                <FormLabel
                  >Backup file
                  <HoverCard v-if="backupInfo.dbName !== ''">
                    <HoverCardTrigger as-child>
                      <Info class="text-muted-foreground size-4" />
                    </HoverCardTrigger>
                    <HoverCardContent class="w-78 mx-2  ">
                      <div class="flex justify-between space-x-4">
<!--                        <div-->
<!--                          class="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-500 text-white"-->
<!--                        >-->
<!--                          <DatabaseZap />-->
<!--                        </div>-->
                        <div class="space-y-1">
                          <h4 class="text-sm font-semibold">Backup info:</h4>
                          <p class="text-sm">
                            Backup file of db
                            <span class="font-bold">{{ backupInfo.dbName }}</span> created using
                            postgres
                            <span class="font-bold">{{ backupInfo.dbVersion }}</span> and pg_dump
                             <span class="font-bold">{{ backupInfo.pgDumpVersion }}</span>
                          </p>
                          <div class="flex items-center pt-2">
                            <CalendarIcon class="mr-2 h-4 w-4 opacity-70" />
                            <span class="text-xs text-muted-foreground">
                              Created at {{ backupInfo.fecha }}
                            </span>
                          </div>
                        </div>
                      </div>

                    </HoverCardContent>
                  </HoverCard>
                </FormLabel>
                <FormControl v-if="!isFileSelected">
                  <Input id="file_input" type="file" @change="handleChange" @blur="handleBlur" />
                </FormControl>
                <FormDescription v-else>
                  Archivo seleccionado {{ store.currentConexionValues.backupPath }}
                </FormDescription>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
        </CardContent>
        <RestoreConsole v-else @done="isRestoring = false" />
      </form>

      <SheetFooter class="pt-0">
        <Button @click="onSubmit" :disabled="isRestoring"> Aceptar</Button>
      </SheetFooter>
    </SheetContent>
  </Sheet>
</template>

<style scoped></style>
