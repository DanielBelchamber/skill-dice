<script setup lang="ts">
import { useDicePool } from '@/stores/dicePool';

const pool = useDicePool();

const assembleDicePool = () => {
  // TODO
};
</script>

<template>
  <main>
    <h1>Skill Dice</h1>

    <div class="selection-wrapper">
      <div class="dice-selector"></div>

      <div class="pool-preview"></div>

      <button @click="assembleDicePool" :disabled="!pool.isAssembled">Assemble Dice Pool</button>
    </div>
  </main>
</template>

<style scoped>
main {
  width: 100%;
  height: 100%;
}

h1 {
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

.dice-selector {
  height: 100px;
  width: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
