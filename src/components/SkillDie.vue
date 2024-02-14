<script setup lang="ts">
import { computed, type PropType } from 'vue';

import { type SkillDieType, type SkillDieValue } from '@/stores/dicePool';

const props = defineProps({
  size: {
    type: Number,
    default: 100,
  },
  dieType: {
    type: String as PropType<SkillDieType>,
    required: true,
  },
  rollValue: {
    type: Number as PropType<SkillDieValue>,
    required: false,
  },
});

const fillColor = computed(() => {
  switch (props.dieType) {
    case "Master":
      return '#6A1B9A';
    case "Expert":
      return '#1565C0';
    case "Adept":
      return '#2E7D32';
    case "Novice":
    default:
      return '#616161';
  }
});
</script>

<template>
  <svg class="SkillDie" :width="size" :height="size" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="50" :fill="fillColor" />
  </svg>
</template>