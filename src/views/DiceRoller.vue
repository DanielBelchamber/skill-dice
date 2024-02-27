<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import { type AppMode, useAppStore } from '@/stores/app'
import { type IdleResult, type SkillRoll, type SkillStripe } from '@/composables/skill'
import { getColor, type SkillDieRank } from '@/composables/dicePool';
import SkillDie from '@/components/SkillDie.vue'
import ProgressBar from '@/components/ProgressBar.vue';

const MODE_OPTIONS: AppMode[] = ['Custom Roller', 'Idle Skilling']
const RANK_OPTIONS: SkillDieRank[] = ['Novice', 'Adept', 'Expert', 'Master']
const STRIPE_OPTIONS: SkillStripe[] = [0, 1, 2, 3, 4]

const appStore = useAppStore()

const mode = ref<AppMode>('Custom Roller')
const rank = ref<SkillDieRank>('Novice')
const stripe = ref<SkillStripe>(0)
const rollResult = ref<SkillRoll | null>(null)

const skill = computed(() => appStore.skill)
const dicePoolDisplay = computed(() =>
  rollResult.value ? rollResult.value.rollDisplay.map((d) => d.rank) : appStore.skill.poolDisplay
)

// Idle Skilling
const interval = computed(() => appStore.interval)
const modifier = computed(() => appStore.modifier)
const challenge = computed(() => appStore.challenge)
const idleResult = ref<IdleResult | null>(null)

const rollSkillCheck = () => {
  const result = appStore.rollSkillCheck()
  rollResult.value = result.rollResult
  idleResult.value = result.idleResult
}

watch(mode, () => {
  appStore.setMode(mode.value)
  rollResult.value = null
  if (mode.value === 'Custom Roller') {
    rank.value = appStore.skill.rank
    stripe.value = appStore.skill.stripe
  }
  if (mode.value === 'Idle Skilling') {
    appStore.skill.setRank('Novice')
    appStore.skill.setStripe(0)
  }
})

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
        <label for="mode-select">Mode</label>
        <select id="mode-select" v-model="mode">
          <option v-for="option in MODE_OPTIONS" :key="option" :value="option">{{ option }}</option>
        </select>
      </div>

      <div v-if="mode === 'Custom Roller'" class="select-wrapper">
        <label for="rank-select">Rank</label>
        <select id="rank-select" v-model="rank">
          <option v-for="option in RANK_OPTIONS" :key="option" :value="option">{{ option }}</option>
        </select>
      </div>

      <div v-if="mode === 'Custom Roller'" class="select-wrapper">
        <label for="stripe-select">Stripe</label>
        <select id="stripe-select" v-model="stripe" :disabled="rank === 'Master'">
          <option v-for="option in STRIPE_OPTIONS" :key="option" :value="option">{{ option }}</option>
        </select>
      </div>
    </div>

    <div class="dice-pool">
      <SkillDie v-for="(rank, index) in dicePoolDisplay" :key="index" :die-rank="rank"
        :roll-value="rollResult ? rollResult.rollDisplay[index].value : undefined" :size="150" />
    </div>

    <!-- Custom Roller -->
    <button v-if="mode === 'Custom Roller'" @click="rollDicePool">Roll</button>

    <div v-if="rollResult && mode === 'Custom Roller'" class="result-display">
      <h2>Total: {{ rollResult.total }}</h2>
      <div v-if="rollResult.shapes.length > 0" class="shapes" :style="{ 'background-color': getColor(skill.rank) }">
        <SkillDie v-for="(shape, index) in rollResult.shapes" :key="index" :shape="shape" :size="50" />
      </div>
    </div>

    <!-- Idle Skilling -->
    <div v-if="mode === 'Idle Skilling'" class="skill-stats">
      <p>Rank: {{ skill.rank }}</p>
      <p>Stripe: {{ skill.stripe }}</p>
      <p>Experience: {{ skill.experience.progress }} / {{ skill.experience.threshold }}</p>
    </div>

    <div v-if="mode === 'Idle Skilling'" class="skill-check">
      <p>Next Skill Check: {{ challenge }}</p>
      <ProgressBar :interval="interval" :color="getColor(skill.rank)" @reset="rollSkillCheck" />
      <p class="details">
        <span v-if="modifier > 0">Modifier: +{{ modifier }}</span>
        <span class="interval">{{ interval }} seconds</span>
      </p>
    </div>

    <div v-if="rollResult && idleResult" class="result-display">
      <h2 :class="idleResult.success ? 'success' : 'failure'">
        <span>{{ idleResult.success ? 'Success!' : 'Failure:' }}&nbsp;</span>
        <span>{{ rollResult.total }}&nbsp;</span>
        <span v-if="idleResult.modifier">+&nbsp;{{ idleResult.modifier }}&nbsp;</span>
        <span>{{ idleResult.success ? '>=' : '<' }}&nbsp;</span>
            <span>{{ idleResult.challenge }}</span>
      </h2>
      <div v-if="rollResult.shapes.length > 0" class="shapes" :style="{ 'background-color': getColor(skill.rank) }">
        <SkillDie v-for="(shape, index) in rollResult.shapes" :key="index" :shape="shape" :size="50" />
      </div>
      <p>Experience earned: {{ idleResult.success ? idleResult.challenge : 0 }} + {{ idleResult.shapes.length }} = {{
        (idleResult.success ? idleResult.challenge : 0) + idleResult.shapes.length }}</p>
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
  margin-top: 1rem;
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

.skill-check {
  margin: 2rem 0 0;
}

.skill-check .details {
  display: flex;
}

.skill-check .details .interval {
  margin-left: auto;
}

.result-display {
  margin: 1rem auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.result-display .success {
  color: green;
}

.result-display .failure {
  color: red;
}

.shapes {
  height: 54px;
  border: 2px solid white;
  border-radius: 3px;
  background-color: rgb(97, 97, 97);
}
</style>
