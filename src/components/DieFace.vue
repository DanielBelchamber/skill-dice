<script setup lang="ts">
import { type PropType } from 'vue'

import type { SkillDieShape, SkillDieValue } from '@/composables/dicePool';

defineProps({
  size: {
    type: Number,
    default: 20
  },
  value: {
    type: Number as PropType<SkillDieValue>,
    required: false
  },
  shape: {
    type: String as PropType<SkillDieShape>,
    required: false
  },
  color: {
    type: String,
    default: 'black'
  }
})
</script>

<template>
  <svg class="DieFace" :width="size" :height="size" viewBox="0 0 50 50">
    <!-- Faces -->
    <rect v-if="value === 1 || value === 2" x="5" y="20" width="40" height="10" rx="3" fill="white" />
    <rect v-if="value === 2" x="20" y="5" width="10" height="40" rx="3" fill="white" />
    <polygon v-if="value === 3 || shape === 'Triangle'" points="25,11 7.68,41 42.32,41" stroke-width="6" stroke="white"
      stroke-linejoin="round" fill="white" />
    <rect v-if="value === 4 || shape === 'Square'" x="5" y="5" width="40" height="40" rx="3" fill="white" />
    <polygon v-if="value === 5 || shape === 'Star'" points="25,5 36.76,41.18 5.98,18.82 44.02,18.82 13.24,41.18"
      stroke-width="6" stroke="white" stroke-linejoin="round" fill="white" />
  </svg>
</template>

<style scoped>
.master-fill {
  fill: var(--master);
}

.expert-fill {
  fill: var(--expert);
}

.apprentice-fill {
  fill: var(--apprentice);
}

.novice-fill {
  fill: var(--novice);
}
</style>
