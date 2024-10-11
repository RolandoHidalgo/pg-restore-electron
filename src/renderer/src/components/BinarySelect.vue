<script setup lang="ts">
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select'
import { onMounted, ref } from 'vue'
import { FormItem, FormLabel, FormField, FormDescription, FormMessage } from './ui/form'

onMounted(() => {
  binariesLoading.value = true
  window.electron.getBinaries().then((binaries) => {
    console.log(binaries, 'binaries')
    items.value = binaries.map(e => {
      return { ...e, text: `${e.version} - ${e.arq}` }
    })
    binariesLoading.value = false
  })
})

const items = ref([])

const binariesLoading = ref(false)


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
              v-for="binary in items"
              :key="binary.text"
              :value="binary.binary"
            >
              {{ binary.text }}
            </SelectItem>
            <!--              <SelectItem value="banana">-->
            <!--                Banana-->
            <!--              </SelectItem>-->
            <!--              <SelectItem value="blueberry">-->
            <!--                Blueberry-->
            <!--              </SelectItem>-->
            <!--              <SelectItem value="grapes">-->
            <!--                Grapes-->
            <!--              </SelectItem>-->
            <!--              <SelectItem value="pineapple">-->
            <!--                Pineapple-->
            <!--              </SelectItem>-->
          </SelectGroup>
        </SelectContent>
      </Select>

      <FormMessage />
    </FormItem>
  </FormField>
</template>

<style scoped>

</style>
