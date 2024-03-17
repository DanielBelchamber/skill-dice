<script lang="ts" setup>
import { computed } from 'vue';

import type { RollDisplay, SkillCheck } from '@/composables/skill';
import { useAppStore } from '@/stores/app';
import DieFace from '@/components/DieFace.vue';
import SkillDie from '@/components/SkillDie.vue';

const appStore = useAppStore()

const props = defineProps({
  skillCheck: {
    type: Object as () => SkillCheck | null,
    default: null
  }
})

const dicePoolDisplay = computed(() =>
  props.skillCheck ? props.skillCheck.display : appStore.skill.display().map((rank) => ({ rank, value: 0 } as RollDisplay))
)

const totalDisplaySetup = computed(() => {
  if (props.skillCheck) {
    const { total, modifier } = props.skillCheck
    const rawRoll = total - modifier
    const modifierDisplay = modifier > 0 ? `+ ${modifier} ` : `- ${Math.abs(modifier)} `
    return modifier ? `Total: ${rawRoll} ${modifierDisplay} = ` : `Total: `
  }
  return null
})
</script>

<template>
  <div class="dice-tray">
    <!-- header -->
    <div v-if="skillCheck" class="binary-outcome">
      <span v-if="skillCheck.success" class="success">Success!</span>
      <span v-else class="failure">Failure</span>
    </div>

    <!-- rolling area -->
    <div class="dice-slots">
      <div v-for="(die, index) in dicePoolDisplay" :key="index" class="slot-container">
        <SkillDie v-if="skillCheck" :rank="die.rank" :value="die.value" :size="90" />
      </div>
    </div>

    <!-- two footers -->
    <div v-if="skillCheck" class="calculated-total">
      <span>{{ totalDisplaySetup }}</span>
      <span :class="skillCheck.success ? 'success' : 'failure'">{{ skillCheck.total }}</span>
    </div>

    <div v-if="skillCheck" class="shapes">
      <DieFace v-for="(shape, index) in skillCheck.shapes" :key="index" :size="30" :shape="shape" color="white" />
    </div>
  </div>
</template>

<style scoped>
.dice-tray {
  position: relative;
  width: calc(100px * 3 + 20px * 4 + 50px * 2);
  border: 50px solid var(--wood_dark);
  padding: 20px;
  background-color: var(--wood_light);
}

.dice-tray .dice-slots {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.dice-slots .slot-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  border-radius: 10px;
  /* var(--accent) with opacity: 0.5 */
  background-color: hsla(25, 100%, 35%, 0.5);
  background-blend-mode: soft-light;
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