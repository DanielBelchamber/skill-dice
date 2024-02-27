<script setup lang="ts">
defineProps({
  progress: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
})
</script>

<template>
  <div class="ProgressBar">
    <div class="progress" :style="{ width: `${progress / total}%` }"></div>
  </div>
</template>

<style scoped>
.ProgressBar {
  width: 300px;
}
</style>