<script setup lang="ts">
import { computed, ref } from 'vue'

import { useAppStore } from '@/stores/app'
import { type SkillRoll, nextRank } from '@/composables/skill'
import type { SkillDieValue } from '@/composables/dicePool'
import SkillDie from '@/components/SkillDie.vue'

const appStore = useAppStore()

const pool = computed(() => {
  const rank = appStore.skill.rank
  const stripe = appStore.skill.stripe
  return [...Array(5)].map((_, index) => (index < stripe) ? nextRank(rank) : rank)
})

const rollResult = ref<SkillRoll | null>(null)
const shapeValues = computed<SkillDieValue[]>(() => {
  if (!rollResult.value) return []

  const shapes = rollResult.value.shapes
  return shapes.map((shape) => {
    switch (shape) {
      case 'Star':
        return 5
      case 'Square':
        return 4
      case 'Triangle':
        return 3
      default:
        return 0
    }
  })
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
          :roll-value="rollResult ? rollResult.display[index].value : undefined" :size="150" />
      </div>

      <button @click="rollDicePool">Roll</button>

      <div v-if="rollResult" class="result-display">
        <h2>Total: {{ rollResult.total }}</h2>
        <div v-if="shapeValues.length > 0" class="shapes">
          <SkillDie v-for="(value, index) in shapeValues" :key="index" :roll-value="value" :size="50" />
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
