<script setup lang="ts">
import { computed, ref } from 'vue'

import { useAppStore } from '@/stores/app'
import { type SkillRoll } from '@/composables/skill'
import SkillDie from '@/components/SkillDie.vue'

const appStore = useAppStore()

const dicePoolDisplay = computed(() => appStore.skill.display)

const rollResult = ref<SkillRoll | null>(null)

const rollDicePool = () => {
  rollResult.value = appStore.skill.roll()
}
</script>

<template>
  <main class="DiceRoller">
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
