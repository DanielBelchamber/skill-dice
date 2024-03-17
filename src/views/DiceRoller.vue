<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

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

const proficiencyDisplay = computed(() => appStore.skill.display())

const displaySkillCheckData = () => {
  const successChance = appStore.skill.calculateProbabilities(challenge.value, modifier.value)
  let display
  if (successChance === 1) {
    display = "Guaranteed"
  } else if (successChance === 0) {
    display = "Impossible"
  } else if (successChance >= 0.995) {
    display = "> 99%"
  } else if (successChance < 0.01) {
    display = "< 1%"
  } else {
    display = `${Math.floor(100 * successChance)}%`
  }
  successChanceDisplay.value = `Success Chance: ${display}`
}

onMounted(() => {
  displaySkillCheckData()
})

watch([proficiencyDisplay, modifier, challenge], () => {
  skillCheck.value = null
  displaySkillCheckData()
})

const makeSkillCheck = () => {
  skillCheck.value = appStore.skill.check(challenge.value, modifier.value)
}
</script>

<template>
  <main class="DiceRoller">
    <h1>Dice Roller</h1>

    <SkillProficiencySlider :proficiency="{ rank: appStore.skill.rank, stripe: appStore.skill.stripe }" />

    <div class="skill-selector">
      <div class="input-wrapper">
        <div class="proficiency-label accent">Skill Proficiency</div>
        <SkillProficiency :display="proficiencyDisplay" />
      </div>

      <div class="input-wrapper">
        <label for="modifier-input">Modifier</label>
        <input id="modifier-input" type="number" v-model="modifier" :min="-5" :max="5" />
      </div>

      <div class="input-wrapper">
        <label for="challenge-input">Challenge</label>
        <input id="challenge-input" type="number" v-model="challenge" :min="1" :max="30" />
      </div>

      <button @click="makeSkillCheck">Roll</button>
    </div>

    <div class="success-chance">{{ successChanceDisplay }}</div>

    <DiceTray :skillCheck="skillCheck" />
  </main>
</template>

<style scoped>
main {
  width: 100%;
  height: 100%;
}

.DiceRoller {
  margin: 0 auto;
  padding-top: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.skill-selector {
  display: flex;
  align-items: center;
}

.skill-selector button {
  align-self: flex-end;
  margin-left: 1rem;
}

.input-wrapper {
  height: 100%;
  margin: 0 1rem;
  display: flex;
  flex-direction: column;
}

.input-wrapper .proficiency-label {
  font-weight: 700;
}

.input-wrapper .SkillProficiency {
  display: flex;
  align-items: center;
  justify-content: center;
}

.success-chance {
  margin: 1rem 0;
  font-size: 1.5rem;
  font-weight: 500;
}
</style>
