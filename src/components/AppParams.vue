<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps<{
  label: string
  value: string
}>()

const isCopied = ref(false)
const handleCopy = () => {
  navigator.clipboard.writeText(`${props.label}: ${props.value}`)
  isCopied.value = true
  setTimeout(() => {
    isCopied.value = false
  }, 1000)
}
</script>

<template>
  <div class="flex gap-4 items-center">
    <div class="flex-1 grid grid-cols-2 items-center">
      <div>{{ label }}</div>
      <input class="input input-bordered input-sm" :value="value" readonly />
    </div>
    <button
      class="btn btn-xs"
      :class="{ 'btn-success': isCopied }"
      @click="handleCopy"
    >
      {{ isCopied ? 'copied' : 'copy' }}
    </button>
  </div>
</template>
