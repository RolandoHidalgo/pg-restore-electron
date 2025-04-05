<script setup lang="ts">
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select'

import { FormItem, FormLabel, FormField,  FormMessage } from './ui/form'
import { useBinaries } from '@renderer/composables'

const {binaries} = useBinaries()


</script>

<template>
  <FormField
    v-slot="{ componentField }"
    name="binary"
  >
    <FormItem>
      <FormLabel>Binario.</FormLabel>

      <Select v-bind="componentField">
        <SelectTrigger>
          <SelectValue  />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Versiones de postgres instaladas</SelectLabel>
            <SelectItem
              v-for="binary in binaries"
              :key="binary.text"
              :value="binary.binary"
            >
              {{ binary.text }}
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
