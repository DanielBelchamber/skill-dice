<script setup lang="ts">
import { type PropType } from 'vue'

import type { SkillDieRank, SkillDieShape, SkillDieValue } from '@/composables/dicePool';

defineProps({
  size: {
    type: Number,
    default: 100
  },
  rank: {
    type: String as PropType<SkillDieRank>,
    required: false
  },
  value: {
    type: Number as PropType<SkillDieValue>,
    required: false
  },
  shape: {
    type: String as PropType<SkillDieShape>,
    required: false
  }
})
</script>

<template>
  <svg class="SkillDie" :width="size" :height="size" viewBox="0 0 100 100">
    <!-- Rank Die -->
    <rect v-if="rank === 'Master'" class="master-fill" x="14" y="14" width="72" height="72" />
    <g v-if="rank === 'Expert'">
      <!-- background -->
      <polygon class="expert-fill" points="10,25 50,5 90,25 90,75 50,95 10,75" />
      <!-- line hints -->
      <line x1="50" y1="5" x2="90" y2="75" stroke="white" stroke-width="2" opacity="0.2" />
      <line x1="10" y1="75" x2="90" y2="75" stroke="white" stroke-width="2" opacity="0.2" />
      <line x1="10" y1="75" x2="50" y2="5" stroke="white" stroke-width="2" opacity="0.2" />
      <!-- hint cover -->
      <circle class="expert-fill" cx="50" cy="50" r="32" />
    </g>
    <g v-if="rank === 'Apprentice'">
      <!-- background -->
      <polygon class="apprentice-fill"
        points="50,5 76.43,13.59 92.8,36.09 92.8,63.91 76.43,86.41 50,95 23.57,86.41 7.2,63.91 7.2,36.09 23.57,13.59" />
      <!-- line hints -->
      <line x1="50" y1="5" x2="50" y2="50" stroke="white" stroke-width="2" opacity="0.2" />
      <line x1="92.8" y1="36.09" x2="50" y2="50" stroke="white" stroke-width="2" opacity="0.2" />
      <line x1="76.43" y1="86.41" x2="50" y2="50" stroke="white" stroke-width="2" opacity="0.2" />
      <line x1="23.57" y1="86.41" x2="50" y2="50" stroke="white" stroke-width="2" opacity="0.2" />
      <line x1="7.2" y1="36.09" x2="50" y2="50" stroke="white" stroke-width="2" opacity="0.2" />
      <!-- hint cover -->
      <circle class="apprentice-fill" cx="50" cy="50" r="35" />
    </g>
    <g v-if="rank === 'Novice'">
      <!-- background -->
      <polygon class="novice-fill" points="6.7,25 50,0 93.3,25 93.3,75 50,100 6.7,75" />
      <!-- line hints -->
      <line x1="50" y1="0" x2="50" y2="20" stroke="white" stroke-width="2" opacity="0.2" />
      <line x1="6.7" y1="25" x2="50" y2="20" stroke="white" stroke-width="2" opacity="0.2" />
      <line x1="93.3" y1="25" x2="50" y2="20" stroke="white" stroke-width="2" opacity="0.2" />

      <line x1="93.3" y1="75" x2="75.98" y2="65" stroke="white" stroke-width="2" opacity="0.2" />
      <line x1="93.3" y1="25" x2="75.98" y2="65" stroke="white" stroke-width="2" opacity="0.2" />
      <line x1="50" y1="100" x2="75.98" y2="65" stroke="white" stroke-width="2" opacity="0.2" />

      <line x1="6.7" y1="75" x2="24.02" y2="65" stroke="white" stroke-width="2" opacity="0.2" />
      <line x1="6.7" y1="25" x2="24.02" y2="65" stroke="white" stroke-width="2" opacity="0.2" />
      <line x1="50" y1="100" x2="24.02" y2="65" stroke="white" stroke-width="2" opacity="0.2" />
      <!-- hint cover -->
      <circle cx="50" cy="50" r="38" class="novice-fill" />
    </g>

    <!-- Faces -->
    <rect v-if="value === 1 || value === 2" x="30" y="45" width="40" height="10" rx="3" fill="white" />
    <rect v-if="value === 2" x="45" y="30" width="10" height="40" rx="3" fill="white" />
    <polygon v-if="value === 3 || shape === 'Triangle'" points="50,33 32.68,63 67.32,63" stroke-width="6" stroke="white"
      stroke-linejoin="round" fill="white" />
    <rect v-if="value === 4 || shape === 'Square'" x="30" y="30" width="40" height="40" rx="3" fill="white" />
    <polygon v-if="value === 5 || shape === 'Star'" points="50,30 61.76,66.18 30.98,43.82 69.02,43.82 38.24,66.18"
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
