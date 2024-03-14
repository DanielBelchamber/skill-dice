<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import { useAppStore } from '@/stores/app'
import { type RollDisplay, type SkillCheck, type SkillStripe } from '@/composables/skill'
import { type SkillDieRank } from '@/composables/dicePool';
import SkillDie from '@/components/SkillDie.vue'
import SkillProficiencySlider from '@/components/SkillProficiencySlider.vue';

const RANK_OPTIONS: SkillDieRank[] = ['Novice', 'Apprentice', 'Expert', 'Master']
const STRIPE_OPTIONS: SkillStripe[] = [0, 1, 2, 3, 4]

const appStore = useAppStore()

const rank = ref<SkillDieRank>('Novice')
const stripe = ref<SkillStripe>(0)
const challenge = ref<number>(0)
const modifier = ref<number>(0)
const skillCheck = ref<SkillCheck | null>(null)

const dicePoolDisplay = computed(() =>
  skillCheck.value ? skillCheck.value.display : appStore.skill.display().map((rank) => ({ rank, value: 0 } as RollDisplay))
)

watch([rank, stripe], () => {
  skillCheck.value = null
  appStore.skill.setRank(rank.value)
  if (rank.value === 'Master') {
    stripe.value = 0
  }
  appStore.skill.setStripe(stripe.value)
  console.log(rank.value, stripe.value)
})

const makeSkillCheck = () => {
  skillCheck.value = appStore.skill.check(challenge.value, modifier.value)
}
</script>

<template>
  <main class="DiceRoller">
    <h1>Dice Roller</h1>

    <SkillProficiencySlider />

    <div class="skill-selector">
      <div class="input-wrapper">
        <label for="rank-select">Rank</label>
        <select id="rank-select" v-model="rank">
          <option v-for="option in RANK_OPTIONS" :key="option" :value="option">{{ option }}</option>
        </select>
      </div>

      <div class="input-wrapper">
        <label for="stripe-select">Stripe</label>
        <select id="stripe-select" v-model="stripe" :disabled="rank === 'Master'">
          <option v-for="option in STRIPE_OPTIONS" :key="option" :value="option">{{ option }}</option>
        </select>
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

    <div class="dice-pool">
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
  margin-top: 1rem;
  display: flex;
  align-items: center;
}

.skill-selector button {
  align-self: flex-end;
  margin-left: 1rem;
}

.input-wrapper {
  margin: 0 1rem;
  display: flex;
  flex-direction: column;
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
