<script setup lang="ts">
import { computed, ref } from 'vue'

import { useAppStore } from '@/stores/app'
import { nextRank } from '@/composables/skill'
import { type SkillDieRoll } from '@/composables/dicePool'
import SkillDie from '@/components/SkillDie.vue'

const appStore = useAppStore()

const pool = computed(() => {
  const rank = appStore.skill.rank
  const stripe = appStore.skill.stripe
  return [...Array(5)].map((_, index) => (index < stripe) ? nextRank(rank) : rank)
})

const rollResult = ref<SkillDieRoll[] | null>(null)
const totalResult = computed(() => {
  if (!rollResult.value) return 0
  return rollResult.value.reduce((sum, roll) => sum + roll.value, 0)
})
const shapes = computed(() => {
  if (!rollResult.value) return []
  return rollResult.value
    .map((roll) => roll.value)
    .filter((value) => value >= 3)
    .sort()
    .reverse()
})

const rollDicePool = () => {
  rollResult.value = appStore.skill.roll()
}
</script>

<template>
  <main>
    <div class="roller-interface">
      <div class="dice-pool">
        <SkillDie v-for="(rank, index) in pool" :key="index" :die-rank="rank"
          :roll-value="rollResult ? rollResult[index].value : undefined" :size="150" />
      </div>

      <button @click="rollDicePool">Roll</button>

      <div v-if="rollResult" class="result-display">
        <h2>Total: {{ totalResult }}</h2>
        <div v-if="shapes.length > 0" class="shapes">
          <SkillDie v-for="(shape, index) in shapes" :key="index" :roll-value="shape" :size="50" />
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
main {
  width: 100%;
  height: 100%;
}

.roller-interface {
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
