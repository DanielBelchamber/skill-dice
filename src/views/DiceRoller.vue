<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'

import { useAppStore } from '@/stores/app'
import { type SkillCheck } from '@/composables/skill'
import SkillProficiencySlider from '@/components/SkillProficiencySlider.vue';
import SkillProficiency from '@/components/SkillProficiency.vue';
import DiceTray from '@/components/DiceTray.vue';

const appStore = useAppStore()

const modifier = ref<number>(0)
const challenge = ref<number>(12)
const successChanceDisplay = ref<string>("")
const skillCheck = ref<SkillCheck | null>(null)

const skillProficiency = computed(() => appStore.skill.display())

const calculateSuccessChance = () => {
  const probability = appStore.skill.calculateSuccessProbability(challenge.value, modifier.value)
  let display
  if (probability === 1) {
    display = "Guaranteed"
  } else if (probability === 0) {
    display = "Impossible"
  } else if (probability >= 0.995) {
    display = "> 99%"
  } else if (probability < 0.01) {
    display = "< 1%"
  } else {
    display = `${Math.floor(100 * probability)}%`
  }
  successChanceDisplay.value = display
}

onMounted(() => {
  calculateSuccessChance()
})

watch([skillProficiency, modifier, challenge], () => {
  skillCheck.value = null
  calculateSuccessChance()
})

const makeSkillCheck = async () => {
  skillCheck.value = null
  await nextTick()
  skillCheck.value = appStore.skill.check(challenge.value, modifier.value)
}
</script>

<template>
  <main class="DiceRoller">
    <h1 class="page-title">Dice Roller</h1>

    <!-- Scenario -->
    <div class="scenario-specification">
      <div class="column">
        <div class="section-label">Challenge Rating (CR)</div>
        <input id="challenge-input" type="number" v-model="challenge" :min="1" :max="30" />
      </div>

      <div class="column">
        <div class="section-label">Situation Modifier (SM)</div>
        <input id="modifier-input" type="number" v-model="modifier" :min="-5" :max="5" />
      </div>
    </div>

    <!-- Skill Proficiency -->
    <div class="section-label">Skill Proficiency</div>
    <SkillProficiencySlider :proficiency="{ rank: appStore.skill.rank, stripe: appStore.skill.stripe }" />

    <!-- Roll Summary -->
    <div class="section-label center">Skill Check</div>

    <div class="roll-summary">
      <SkillProficiency :display="skillProficiency" />
      <span v-if="modifier">{{ modifier > 0 ? '+' : '' }}{{ modifier }} SM&nbsp;</span>
      <span>vs CR {{ challenge }}</span>
    </div>
    <div class="roll-summary">
      <span>Success Chance: {{ successChanceDisplay }}</span>
    </div>
    <div class="roll-summary">
      <button @click="makeSkillCheck">Roll</button>
    </div>

    <!-- Dice Tray -->
    <DiceTray :skillCheck="skillCheck" />
  </main>
</template>

<style scoped>
.DiceRoller {
  max-width: calc(2 * 1rem + 800px);
  margin: 0 auto;
  padding: 1rem;
}

.page-title {
  text-align: center;
}

.section-label {
  width: 100%;
  font-size: 1.25rem;
  font-weight: 700;
  text-align: center;
}

.scenario-specification {
  display: flex;
}

.scenario-specification .column {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.roll-summary {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 500;
}

.roll-summary .SkillProficiency {
  margin-right: 0.5rem;
}

.DiceRoller .DiceTray {
  margin: 1rem auto 0;
}
</style>
