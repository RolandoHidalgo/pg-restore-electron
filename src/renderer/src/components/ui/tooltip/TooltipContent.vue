<script setup lang="ts">
import { computed, HTMLAttributes } from 'vue'
import { cn } from '@renderer/lib/utils'
import { reactiveOmit } from '@vueuse/core'
import { TooltipArrow, TooltipContent, type TooltipContentEmits, type TooltipContentProps, TooltipPortal, useForwardPropsEmits } from 'reka-ui'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<TooltipContentProps & { class?: HTMLAttributes['class'] }&{variant?:'destructive'|'default'}>(), {
  sideOffset: 4,
  variant: 'default',
})

const emits = defineEmits<TooltipContentEmits>()

const delegatedProps = reactiveOmit(props, 'class')
const forwarded = useForwardPropsEmits(delegatedProps, emits)
const currentVariants = computed(()=>{
  const variants = {
    "default":{
      content:'bg-primary text-primary-foreground',
      arrow:'bg-primary fill-primary'
    },
    destructive:{
      content:'bg-destructive text-white',
      arrow:'bg-destructive fill-destructive'
    }
  }
  return variants[props.variant]
})
</script>

<template>
  <TooltipPortal>
    <TooltipContent
      data-slot="tooltip-content"
      v-bind="{ ...forwarded, ...$attrs }"
      :class="cn(' animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit rounded-md px-3 py-1.5 text-xs text-balance',currentVariants.content, props.class)"
    >
      <slot />

      <TooltipArrow :class="cn('z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]',currentVariants.arrow)" />
    </TooltipContent>
  </TooltipPortal>
</template>
