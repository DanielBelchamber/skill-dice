<script setup lang="ts">
import { useDicePool } from '@/stores/dicePool';
import SkillDie from '@/components/SkillDie.vue';

const pool = useDicePool();

const assembleDicePool = () => {
  // TODO
};
</script>

<template>
  <main>
    <h1 class="page-title">Skill Dice</h1>

    <div class="selection-wrapper">
      <div class="dice-selector">
        <SkillDie v-for="dieType in pool.typeOptions" :key="dieType" :die-type="dieType"
          @click="() => pool.addDie(dieType)" />
      </div>

      <div class="pool-preview">
        <h2 class="preview-title">Select Five</h2>

        <SkillDie v-for="(dieType, index) in pool.assembledTypes" :key="index" :die-type="dieType" :size="50"
          @click="() => pool.removeDie(index)" />
      </div>

      <button @click="assembleDicePool" :disabled="!pool.isAssembled">Assemble Dice Pool</button>
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
</style>
