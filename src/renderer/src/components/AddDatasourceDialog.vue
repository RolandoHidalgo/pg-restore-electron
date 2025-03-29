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
import { computed, onMounted, ref, watchEffect } from 'vue'
import { ReloadIcon } from '@radix-icons/vue'
import { z } from 'zod'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@renderer/components/ui/form'

import BinarySelect from '@renderer/components/BinarySelect.vue'
import NewDbForm from '@renderer/components/NewDbForm.vue'
import { CardContent } from '@renderer/components/ui/card'
import { Input } from '@renderer/components/ui/input'
import { Label } from '@renderer/components/ui/label'

const model = defineModel({ type: Boolean, required: true })

const messages = ref('')
const updating = ref(false)

const coneccionSchema = z.object({
  binary: z.string({
    required_error: 'Requerido.'
  }),
  password: z
    .string({
      required_error: 'Requerido.'
    })
    .min(1, { message: 'no vacio' }),
  user: z
    .string({
      required_error: 'Requerido.'
    })
    .min(1, { message: 'no vacio' }),

  host: z
    .string({
      required_error: 'Requerido.'
    })
    .min(1, { message: 'no vacio' }),
  port: z
    .string({
      required_error: 'Requerido.'
    })
    .min(1, { message: 'no vacio' }),
  dbName: z
    .string({
      required_error: 'Requerido.'
    })
    .min(1, { message: 'no vacio' })
})
const initVals = {
  port: '5432',
  host: 'localhost',
  user: 'postgres'
}
const { handleSubmit, resetForm } = useForm({
  validationSchema: computed(() => toTypedSchema(coneccionSchema.passthrough())),
  initialValues: initVals,
  keepValuesOnUnmount: true
})

const onSubmit = handleSubmit(async (values) => {
  await window.electron.addDatasource(values)
  model.value = false
  resetForm()
})
watchEffect(() => {
  if (!model.value) {
    resetForm()
  }
})
</script>

<template>
  <Dialog v-model:open="model" class="!p-0" >
    <DialogContent class="sm:max-w-[475px]">
      <DialogHeader>
        <DialogTitle>Adicionar datasource</DialogTitle>
        <DialogDescription> Parámetros de conexión. </DialogDescription>
      </DialogHeader>

      <form class="w-full flex flex-col" @submit="onSubmit">
        <CardContent class="grid grid-cols-2 gap-2 overflow-y-auto">
          <div>
            <BinarySelect />
          </div>
          <div>
            <FormField v-slot="{ componentField }" name="dbName">
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input type="text" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
          <div>
            <FormField v-slot="{ componentField }" name="password">
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" v-bind="componentField" />
                </FormControl>

                <FormMessage />
              </FormItem>
            </FormField>
          </div>
          <div>
            <FormField v-slot="{ componentField }" name="user">
              <FormItem>
                <FormLabel>User</FormLabel>
                <FormControl>
                  <Input type="text" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
          <div>
            <FormField v-slot="{ componentField }" name="host">
              <FormItem>
                <FormLabel>Host</FormLabel>
                <FormControl>
                  <Input type="text" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
          <div>
            <FormField v-slot="{ componentField }" name="port">
              <FormItem>
                <FormLabel>Port</FormLabel>
                <FormControl>
                  <Input type="text" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
        </CardContent>
      </form>

      <DialogFooter class="gap-0">
        <Button @click="onSubmit" :disabled="updating">
          <ReloadIcon class="w-4 h-4 mr-2 animate-spin" v-if="updating" />
          Aceptar
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<style scoped></style>
