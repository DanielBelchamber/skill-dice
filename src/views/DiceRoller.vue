<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

import { useAppStore } from '@/stores/app'
import { type RollDisplay, type SkillCheck } from '@/composables/skill'
import SkillProficiencySlider from '@/components/SkillProficiencySlider.vue';
import SkillProficiency from '@/components/SkillProficiency.vue';
import SkillDie from '@/components/SkillDie.vue'
import DieFace from '@/components/DieFace.vue';

const appStore = useAppStore()

const modifier = ref<number>(0)
const challenge = ref<number>(12)
const successChanceDisplay = ref<string>("")
const skillCheck = ref<SkillCheck | null>(null)

const proficiencyDisplay = computed(() => appStore.skill.display())
const totalDisplaySetup = computed(() => {
  if (skillCheck.value) {
    const { total, modifier } = skillCheck.value
    const rawRoll = total - modifier
    const modifierDisplay = modifier > 0 ? `+ ${modifier} ` : `- ${Math.abs(modifier)} `
    return modifier ? `Total: ${rawRoll} ${modifierDisplay} = ` : `Total: `
  }
  return null
})

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

    <div v-if="skillCheck" class="dice-tray">
      <div class="binary-outcome">
        <span v-if="skillCheck.success" class="success">Success!</span>
        <span v-else class="failure">Failure</span>
      </div>

      <SkillDie v-for="(die, index) in dicePoolDisplay" :key="index" :rank="die.rank" :value="die.value" :size="100" />

      <div class="calculated-total">
        <span>{{ totalDisplaySetup }}</span>
        <span :class="skillCheck.success ? 'success' : 'failure'">{{ skillCheck.total }}</span>
      </div>
      <div class="shapes">
        <DieFace v-for="(shape, index) in skillCheck.shapes" :key="index" :size="30" :shape="shape" color="white" />
      </div>
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

.dice-tray {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  width: calc(100px * 3 + 20px * 4 + 50px * 2);
  gap: 20px;
  border: 50px solid var(--wood_dark);
  padding: 20px;
  background-color: var(--wood_light);
}

.dice-tray .SkillDie {
  border-radius: 10px;
  background-color: var(--accent);
}

.dice-tray .binary-outcome {
  position: absolute;
  top: -50px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 2rem;
  line-height: 50px;
  font-weight: 700;
  color: white;
}

.dice-tray .success {
  font-weight: 700;
  color: gold;
}

.dice-tray .failure {
  font-weight: 700;
  color: silver;
}

.dice-tray .calculated-total {
  position: absolute;
  width: 220px;
  bottom: -50px;
  left: 0;
  font-size: 1.5rem;
  line-height: 50px;
  font-weight: 500;
  color: white;
}

.dice-tray .shapes {
  position: absolute;
  bottom: -40px;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
