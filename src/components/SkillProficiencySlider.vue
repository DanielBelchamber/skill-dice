<script setup lang="ts">
import { ref, type PropType, computed, watch } from 'vue'

import type { SkillDieRank } from '@/composables/dicePool';
import type { SkillProficiency, SkillStripe } from '@/composables/skill';
import SkillDie from '@/components/SkillDie.vue';
import { useAppStore } from '@/stores/app';

const RANKS: SkillDieRank[] = ['Novice', 'Apprentice', 'Expert', 'Master']

const props = defineProps({
  proficiency: {
    type: Object as PropType<SkillProficiency>,
    required: true
  }
})

const rank = ref(props.proficiency.rank)
const stripe = ref(props.proficiency.stripe)

const appStore = useAppStore();

watch([rank, stripe], () => {
  appStore.skill.setRank(rank.value)
  appStore.skill.setStripe(stripe.value)
})

const proficiencyPercentage = computed(() => {
  const notch = RANKS.indexOf(rank.value) * 5 + stripe.value
  return 100 * notch / 15
})

const setProficiency = (newRank: SkillDieRank, newStripe: SkillStripe) => {
  rank.value = newRank;
  stripe.value = newStripe;
}

const handleNotchClick = (notch: number) => {
  const newRank = RANKS[Math.floor(notch / 5)]
  const newStripe = notch % 5 as SkillStripe
  setProficiency(newRank, newStripe)
}

const handleTrackMouseEvent = (e: MouseEvent) => {
  const track = e.currentTarget as HTMLDivElement
  const rect = track.getBoundingClientRect()
  const x = e.clientX - rect.left
  const notch = Math.round(15 * x / rect.width)
  handleNotchClick(notch)
}
</script>

<template>
  <div class="SkillProficiencySlider">
    <div class="track" @mousedown.stop="handleTrackMouseEvent">
      <div class="fill" :style="{ width: `${proficiencyPercentage}%` }"></div>
      <div class="notch" v-for="i in 16" :key="i" :style="{ left: `calc(${100 * (i - 1) / 15}% - 0.5px)` }"
        @click.stop="() => handleNotchClick(i - 1)">
        <div v-if="(i - 1) % 5 !== 0" class="label" @mousedown.stop>{{ (i - 1) % 5 }}</div>
      </div>
      <div class="rank-wrapper" v-for="(rank, i) of RANKS" :key="rank" @click.stop="() => setProficiency(rank, 0)"
        :style="{ left: `calc(${100 * i / 3}% - 15px)`, top: 'calc(50% - 15px)' }">
        <div class="label" :class="rank" @mousedown.stop>{{ rank }}</div>
        <SkillDie :size="30" :rank="rank" />
      </div>
      <div class="thumb" :style="{ left: `calc(${proficiencyPercentage}% - 10px)` }"></div>
    </div>
  </div>
</template>

<style scoped>
.SkillProficiencySlider {
  width: 100%;
  max-width: 800px;
  padding: 50px;
}

.track {
  position: relative;
  width: 100%;
  height: 10px;
  border: 1px solid black;
  cursor: pointer;
}

.thumb {
  position: absolute;
  width: 20px;
  height: 20px;
  top: calc(50% - 10px);
  left: -10px;
  border-radius: 10px;
  border: 1px solid black;
  background-color: var(--accent);
}

.fill {
  position: absolute;
  height: 100%;
  background-color: var(--accent);
}

.notch {
  position: absolute;
  height: 100%;
  width: 1px;
  background-color: black;
}

.notch .label {
  position: absolute;
  top: calc(100% + 8px);
  left: -4.5px;
  width: 10px;
  line-height: 15px;
  font-size: 0.8rem;
  text-align: center;
}

.rank-wrapper {
  position: absolute;
}

.rank-wrapper .label {
  position: absolute;
  top: -28px;
  left: -30px;
  width: 90px;
  line-height: 28px;
  font-weight: 700;
  text-align: center;
}
</style>