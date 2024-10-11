<script setup lang="ts">
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@renderer/components/ui/tabs'
import Restore from './Restore.vue'

</script>

<template>
  <Tabs default-value="restore">
    <TabsList class="grid w-full grid-cols-2">
      <TabsTrigger value="restore">
        Restore
      </TabsTrigger>
      <TabsTrigger value="backup">
        Backup
      </TabsTrigger>
    </TabsList>
    <TabsContent value="restore">
      <Restore />
    </TabsContent>
    <TabsContent value="backup">
      <div class="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
        <div class="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            class="h-10 w-10 text-muted-foreground"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="11" r="1" />
            <path d="M11 17a1 1 0 0 1 2 0c0 .5-.34 3-.5 4.5a.5.5 0 0 1-1 0c-.16-1.5-.5-4-.5-4.5ZM8 14a5 5 0 1 1 8 0" />
            <path d="M17 18.5a9 9 0 1 0-10 0" />
          </svg>

          <h3 class="mt-4 text-xl font-semibold">
            Coming soon
          </h3>
          <p class="mb-4 mt-2 text-sm text-muted-foreground">
            Muy pronto podremos hacer backups.
          </p>
        </div>
      </div>
    </TabsContent>
  </Tabs>

</template>
