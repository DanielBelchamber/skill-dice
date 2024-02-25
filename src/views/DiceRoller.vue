<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import { useAppStore } from '@/stores/app'
import { type SkillRoll, type SkillStripe } from '@/composables/skill'
import type { SkillDieRank } from '@/composables/dicePool';
import SkillDie from '@/components/SkillDie.vue'

const appStore = useAppStore()

const dicePoolDisplay = computed(() => appStore.skill.display)

const RANK_OPTIONS: SkillDieRank[] = ['Novice', 'Adept', 'Expert', 'Master']
const STRIPE_OPTIONS: SkillStripe[] = [0, 1, 2, 3, 4]

const rank = ref<SkillDieRank>('Novice')
const stripe = ref<SkillStripe>(0)
const rollResult = ref<SkillRoll | null>(null)

watch([rank, stripe], () => {
  rollResult.value = null
  appStore.skill.setRank(rank.value)
  if (rank.value === 'Master') {
    stripe.value = 0
  }
  appStore.skill.setStripe(stripe.value)
})

const rollDicePool = () => {
  rollResult.value = appStore.skill.roll()
}
</script>

<template>
  <main class="DiceRoller">
    <div class="skill-selector">
      <div class="select-wrapper">
        <label for="rank-select">Rank</label>
        <select id="rank-select" v-model="rank">
          <option v-for="option in RANK_OPTIONS" :key="option" :value="option">{{ option }}</option>
        </select>
      </div>

      <div class="select-wrapper">
        <label for="stripe-select">Stripe</label>
        <select id="stripe-select" v-model="stripe" :disabled="rank === 'Master'">
          <option v-for="option in STRIPE_OPTIONS" :key="option" :value="option">{{ option }}</option>
        </select>
      </div>
    </div>

    <div class="dice-pool">
      <SkillDie v-for="(rank, index) in dicePoolDisplay" :key="index" :die-rank="rank"
        :roll-value="rollResult ? rollResult.display[index].value : undefined" :size="150" />
    </div>

    <button @click="rollDicePool">Roll</button>

    <div v-if="rollResult" class="result-display">
      <h2>Total: {{ rollResult.total }}</h2>
      <div v-if="rollResult.shapes.length > 0" class="shapes">
        <SkillDie v-for="(shape, index) in rollResult.shapes" :key="index" :shape="shape" :size="50" />
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
  display: flex;
  flex-direction: column;
  align-items: center;
}

.skill-selector {
  display: flex;
  align-items: center;
}

.select-wrapper {
  margin: 0 1rem;
  display: flex;
  flex-direction: column;
}

.dice-pool {
  margin: 2rem 0;
}

.result-display {
  margin: 2rem auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.shapes {
  height: 54px;
  border: 2px solid white;
  border-radius: 3px;
  background-color: rgb(97, 97, 97);
}
</style>
