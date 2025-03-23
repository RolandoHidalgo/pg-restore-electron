<script setup lang="ts">
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@renderer/components/ui/tabs'
import Restore from './Restore.vue'
import {cn} from "@renderer/lib/utils";
import {ref} from "vue";
import Backup from '@renderer/components/Backup.vue'

const model = ref('restore')
</script>

<template>
  <Tabs default-value="restore" class="flex flex-col grow " v-model="model">
    <TabsList class="grid w-full grid-cols-2">
      <TabsTrigger value="restore">
        Restore
      </TabsTrigger>
      <TabsTrigger value="backup">
        Backup
      </TabsTrigger>
    </TabsList>
    <TabsContent value="restore" :class="cn('grow',model==='restore'?'flex flex-col grow':'')">
      <Restore/>
    </TabsContent>
    <TabsContent value="backup" :class="cn('grow',model==='restore'?'flex flex-col grow':'')">
      <Backup/>
    </TabsContent>
  </Tabs>


</template>
