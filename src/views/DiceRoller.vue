<script setup lang="ts">
import { computed, ref } from 'vue'

import { useDicePool, type SkillDieRoll } from '@/stores/dicePool'
import SkillDie from '@/components/SkillDie.vue'

const pool = useDicePool()

const isAssembled = ref(false)
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

const assembleDicePool = () => (isAssembled.value = true)

const rollDicePool = () => {
  rollResult.value = pool.roll()
}
</script>

<template>
  <main>
    <h1 class="page-title">Skill Dice</h1>

    <div v-if="!isAssembled" class="selection-wrapper">
      <div class="dice-selector">
        <SkillDie
          v-for="dieType in pool.typeOptions"
          :key="dieType"
          :die-type="dieType"
          @click="() => pool.addDie(dieType)"
        />
      </div>

      <div class="pool-preview">
        <h2 class="preview-title">Select Five</h2>

        <SkillDie
          v-for="(dieType, index) in pool.assembledTypes"
          :key="index"
          :die-type="dieType"
          :size="50"
          @click="() => pool.removeDie(index)"
        />
      </div>

      <button @click="assembleDicePool" :disabled="!pool.canAssemble">Assemble Dice Pool</button>
    </div>

    <div v-else class="roller-interface">
      <h2 class="preview-title">Assembled Pool</h2>

      <div class="dice-pool">
        <SkillDie
          v-for="(dieType, index) in pool.assembledTypes"
          :key="index"
          :die-type="dieType"
          :roll-value="rollResult ? rollResult[index].value : undefined"
          :size="150"
        />
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

.page-title {
  margin: 3rem 0;
  font-size: 3rem;
  font-weight: 600;
  text-align: center;
}

.selection-wrapper {
  width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.selection-wrapper .SkillDie {
  cursor: pointer;
}

.dice-selector {
  height: 100px;
  width: auto;
  margin: 0 0 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.pool-preview {
  width: calc(5 * 50px + 4 * 10px);
  height: 100px;
  margin-bottom: 2rem;
}

.preview-title {
  margin-bottom: 0.5rem;
}

.pool-preview .SkillDie:not(:last-child) {
  margin-right: 10px;
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
