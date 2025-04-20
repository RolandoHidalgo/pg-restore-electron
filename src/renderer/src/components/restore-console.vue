<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { CircleCheck, LoaderCircle } from 'lucide-vue-next'

const props = withDefaults(defineProps<{ finishEvent?: string }>(), {
  finishEvent: 'finish-OK'
})
const emit = defineEmits(['done', 'delete'])
const element = ref(null)
const messages = ref([])
onMounted(() => {
  window.electron.handleRestoreConsoleEvent((event, value) => {
    messages.value.push(value + '\n')
    if (value === props.finishEvent) {
      emit('done')
    }
    setTimeout(updateScroll, 50)
  })
  element.value = document.getElementById('console')
})

function updateScroll() {
  element.value.scrollTo({ behavior: 'auto', top: Number(element.value.scrollHeight) })
}
</script>

<template>
  <div>
    <div class="console " id="console">
      <p
        class="mx-0 flex justify-start items-center w-full text-xs"
        v-for="(m,i) in  messages" >
       <span class="mr-0.5">
         <LoaderCircle v-if="i === messages.length-1 && m!==`${props.finishEvent}\n`" class="text-neutral-100 animate-spin"/>
        <span v-else>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"

            class="size-6   m-0 p-0"
          >
              <circle cx="12" cy="12" r="5" fill="white"/>
            <path
              class="fill-green-400 "
              fill-rule="evenodd"
              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
              clip-rule="evenodd"
            />
          </svg>
        </span>

       </span>

        <span class="break-all">{{ m }}</span>
      </p>
    </div>
  </div>
</template>

<style scoped>
.console {
  background-color: #2b2b2b;
  min-height: 300px;
  max-height: 300px;
  max-width: 100%;
  overflow: auto;
  color: #f5fff2;
}
</style>
