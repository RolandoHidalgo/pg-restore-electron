<script setup lang="ts">
import {Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue} from './ui/select'
import {Ref, ref, watchEffect} from 'vue'
import {FormItem, FormLabel, FormField, FormMessage} from './ui/form'


const props = defineProps<{
  dsName: string,
  dbName: string
}>()


// onMounted(() => {
//   datasourcesLoading.value = true
//   window.electron.getDatasource().then((ds: DataSource[]) => {
//     console.log(ds, 'ds')
//     items.value = ds.map(e => {
//       return {...e, text: `${e.name}-${e.host}`}
//     })
//     datasourcesLoading.value = false
//   })
// })


const items: Ref<string[]> = ref([])
//items.value = await window.electron.getDbs(props.dsName)
const datasourcesLoading = ref(false)

watchEffect(async () => {
  if (props.dsName && props?.dsName !== '' && props.dbName && props?.dbName !== '') {
    items.value = await window.electron.getSchemmas(props.dsName,props.dbName)
  }

})

</script>

<template>
  <FormField
    v-slot="{ componentField }"
    name="schemma"
  >
    <FormItem>
      <FormLabel>Db name.</FormLabel>

      <Select v-bind="componentField">
        <SelectTrigger>
          <SelectValue/>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Schemmas en {{ props.dbName }}</SelectLabel>
            <SelectItem
              v-for="schema in items"
              :key="schema"
              :value="schema"
            >
              {{ schema }}
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

      <FormMessage/>
    </FormItem>
  </FormField>
</template>

<style scoped>

</style>
