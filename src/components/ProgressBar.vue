<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

const INTERVAL = 20
let intervalId: number

const props = defineProps({
  interval: {
    type: Number,
    required: true,
  },
  pause: {
    type: Boolean,
    default: false,
  },
  color: {
    type: String,
    default: 'blue',
  },
})

const emit = defineEmits<{
  (e: 'reset'): void
}>()

const progress = ref(0)
const total = computed(() => props.interval * 1000)

onMounted(() => {
  if (!props.pause) {
    intervalId = setInterval(() => {
      if (progress.value >= total.value) {
        emit('reset')
        progress.value = 0
      } else {
        progress.value += INTERVAL
      }
      if (props.pause) {
        clearInterval(intervalId)
      }
    }, INTERVAL)
  }
})

onBeforeUnmount(() => {
  clearInterval(intervalId)
})
</script>

<template>
  <div class="ProgressBar" :style="{ width: 300 }">
    <div class="progress" :style="{ width: `${100 * progress / total}%`, 'background-color': color }"></div>
  </div>
</template>

<style scoped>
.ProgressBar {
  width: 300px;
  height: 20px;
  border: 2px solid black;
  border-radius: 4px;
}

.progress {
  height: 100%;
}
</style>