<script setup lang="ts">
import { Button } from '@renderer/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@renderer/components/ui/form'


import { Input } from '@renderer/components/ui/input'

import {   Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger, } from '@renderer/components/ui/dialog'

import { toTypedSchema } from '@vee-validate/zod'

import * as z from 'zod'
import { useAppStore } from '@renderer/stores/appStore'

const formSchema = toTypedSchema(z.object({
  username: z.string().min(2).max(50),
}))
const store = useAppStore()
function onSubmit(values: any) {
console.log('asdasd')
}
</script>

<template>
  <Form v-slot="{ handleSubmit }" as="" keep-values :validation-schema="formSchema">
    <Dialog v-model:open="store.isRestoreOpen">
      <DialogTrigger as-child>
        <Button variant="outline">
          Edit Profiledfsdfsdfsdfdf
        </Button>
      </DialogTrigger>
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.asdasdasd
          </DialogDescription>
        </DialogHeader>

        <form id="dialogForm" @submit="handleSubmit($event, onSubmit)">
          <FormField v-slot="{ componentField }" name="username">
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input type="text" placeholder="shadcn" v-bind="componentField" />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>
        </form>

        <DialogFooter>
          <Button type="submit" form="dialogForm">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </Form>
</template>

<style scoped></style>
