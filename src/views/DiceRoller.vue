<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

import { useAppStore } from '@/stores/app'
import { type RollDisplay, type SkillCheck } from '@/composables/skill'
import SkillDie from '@/components/SkillDie.vue'
import SkillProficiencySlider from '@/components/SkillProficiencySlider.vue';
import SkillProficiency from '@/components/SkillProficiency.vue';

const appStore = useAppStore()

const modifier = ref<number>(0)
const challenge = ref<number>(12)
const skillCheck = ref<SkillCheck | null>(null)

const proficiencyDisplay = computed(() => appStore.skill.display())

const logSkillCheckData = () => {
  const { rank, stripe } = appStore.skill
  const modifierDisplay = modifier.value > 0 ? `+${modifier.value} SM` : `${modifier.value} SM`
  const challengeDisplay = `vs ${challenge.value} CR`

  if (modifier.value) {
    console.log(rank, stripe, modifierDisplay, challengeDisplay)
  } else {
    console.log(rank, stripe, challengeDisplay)
  }

  appStore.skill.calculateProbabilities()
}

onMounted(() => {
  logSkillCheckData()
})

watch([proficiencyDisplay, modifier, challenge], () => {
  skillCheck.value = null
  logSkillCheckData()
})

const dicePoolDisplay = computed(() =>
  skillCheck.value ? skillCheck.value.display : appStore.skill.display().map((rank) => ({ rank, value: 0 } as RollDisplay))
)

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
        <div>Skill Proficiency</div>
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

    <div v-if="skillCheck" class="dice-pool">
      <SkillDie v-for="(die, index) in dicePoolDisplay" :key="index" :rank="die.rank" :value="die.value" :size="150" />
    </div>

    <div v-if="skillCheck" class="result-display">
      <h2>{{ skillCheck.success ? "Success!" : "Failure" }}</h2>
      <h3>Total: {{ skillCheck.total }}</h3>
      <h3 class="shapes">
        <span class="label">Shapes:</span>
        <SkillDie v-for="(shape, index) in skillCheck.shapes" :key="index" :shape="shape" :size="50" />
      </h3>
    </div>
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

.input-wrapper .skill-proficiency {
  display: flex;
  align-items: center;
  justify-content: center;
}

.dice-pool {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  margin: 2rem 0;
}

.result-display {
  margin: 0 auto;
  border-radius: 0.25rem;
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--wood_dark);
  color: white;
}

.shapes {
  display: flex;
  align-items: center;
  height: 54px;
  border-radius: 3px;
}

.shapes .SkillDie {
  margin: -10px;
}

.shapes .label {
  margin-right: 0.5rem;
}
</style>
