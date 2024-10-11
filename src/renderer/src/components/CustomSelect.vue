<script setup lang="ts">

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@renderer/components/ui/select'
import { FormField, FormItem, FormLabel, FormMessage } from '@renderer/components/ui/form'

const props = defineProps<{
  name: string,
  items: Array<string>
  label:string
}>()
</script>

<template>
  <FormField
    v-slot="{ componentField }"
    :name="props.name"
  >
    <FormItem>
      <FormLabel>{{ props.label }}</FormLabel>

      <Select v-bind="componentField">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
<!--            <SelectLabel>Versiones de postgres instaladas</SelectLabel>-->
            <SelectItem
              v-for="item in items"
              :key="item"
              :value="item"
            >
              {{ item }}
            </SelectItem>

          </SelectGroup>
        </SelectContent>
      </Select>

      <FormMessage />
    </FormItem>
  </FormField>
</template>

<style scoped>

</style>
