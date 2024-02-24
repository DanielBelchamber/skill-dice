<script setup lang="ts">
import { computed, type PropType } from 'vue'

import type { SkillDieRank, SkillDieValue } from '@/composables/dicePool';

const props = defineProps({
  size: {
    type: Number,
    default: 100
  },
  dieRank: {
    type: String as PropType<SkillDieRank>,
    required: false
  },
  rollValue: {
    type: Number as PropType<SkillDieValue>,
    required: false
  }
})

const fillColor = computed(() => {
  switch (props.dieRank) {
    case 'Master':
      return '#6A1B9A'
    case 'Expert':
      return '#1565C0'
    case 'Adept':
      return '#2E7D32'
    case 'Novice':
    default:
      return '#616161'
  }
})
</script>

<template>
  <svg class="SkillDie" :width="size" :height="size" viewBox="0 0 100 100">
    <!-- Die Types -->
    <rect v-if="dieRank === 'Master'" x="14" y="14" width="72" height="72" :fill="fillColor" />
    <g v-if="dieRank === 'Expert'">
      <!-- background -->
      <polygon points="10,25 50,5 90,25 90,75 50,95 10,75" :fill="fillColor" />
      <!-- line hints -->
      <line x1="50" y1="5" x2="90" y2="75" stroke="white" stroke-width="2" opacity="0.2" />
      <line x1="10" y1="75" x2="90" y2="75" stroke="white" stroke-width="2" opacity="0.2" />
      <line x1="10" y1="75" x2="50" y2="5" stroke="white" stroke-width="2" opacity="0.2" />
      <!-- hint cover -->
      <circle cx="50" cy="50" r="32" :fill="fillColor" />
    </g>
    <g v-if="dieRank === 'Adept'">
      <!-- background -->
      <polygon
        points="50,5 76.43,13.59 92.8,36.09 92.8,63.91 76.43,86.41 50,95 23.57,86.41 7.2,63.91 7.2,36.09 23.57,13.59"
        :fill="fillColor" />
      <!-- line hints -->
      <line x1="50" y1="5" x2="50" y2="50" stroke="white" stroke-width="2" opacity="0.2" />
      <line x1="92.8" y1="36.09" x2="50" y2="50" stroke="white" stroke-width="2" opacity="0.2" />
      <line x1="76.43" y1="86.41" x2="50" y2="50" stroke="white" stroke-width="2" opacity="0.2" />
      <line x1="23.57" y1="86.41" x2="50" y2="50" stroke="white" stroke-width="2" opacity="0.2" />
      <line x1="7.2" y1="36.09" x2="50" y2="50" stroke="white" stroke-width="2" opacity="0.2" />
      <!-- hint cover -->
      <circle cx="50" cy="50" r="35" :fill="fillColor" />
    </g>
    <g v-if="dieRank === 'Novice'">
      <!-- background -->
      <polygon points="6.7,25 50,0 93.3,25 93.3,75 50,100 6.7,75" :fill="fillColor" />
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
      <circle cx="50" cy="50" r="38" :fill="fillColor" />
    </g>

    <!-- Roll Values -->
    <rect v-if="rollValue === 1 || rollValue === 2" x="30" y="45" width="40" height="10" rx="3" fill="white" />
    <rect v-if="rollValue === 2" x="45" y="30" width="10" height="40" rx="3" fill="white" />
    <polygon v-if="rollValue === 3" points="50,33 32.68,63 67.32,63" stroke-width="6" stroke="white"
      stroke-linejoin="round" fill="white" />
    <rect v-if="rollValue === 4" x="30" y="30" width="40" height="40" rx="3" fill="white" />
    <polygon v-if="rollValue === 5" points="50,30 61.76,66.18 30.98,43.82 69.02,43.82 38.24,66.18" stroke-width="6"
      stroke="white" stroke-linejoin="round" fill="white" />
  </svg>
</template>
