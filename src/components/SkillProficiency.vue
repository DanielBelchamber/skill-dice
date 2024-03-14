<script setup lang="ts">
import { type PropType } from 'vue'

import SkillDie from '@/components/SkillDie.vue';
import type { SkillDieRank } from '@/composables/dicePool';

defineProps({
  display: {
    type: Array as PropType<SkillDieRank[]>,
    required: true
  },
  size: {
    type: Number,
    default: 24
  }
})
</script>

<template>
  <div class="SkillProficiency">
    <SkillDie v-for="(rank, index) in display" :key="index" :rank="rank" :size="20" />
  </div>
</template>

<style scoped>
.SkillProficiency {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>