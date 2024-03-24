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
  <div class="DiceTray">
    <!-- headers -->
    <Transition name="fade">
      <div v-if="skillCheck" class="binary-outcome">
        <span v-if="skillCheck.success" class="success">Success!</span>
        <span v-else class="failure">Failure</span>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="skillCheck" class="shapes">
        <DieFace v-for="(shape, index) in skillCheck.shapes" :key="index" :size="30" :shape="shape" color="white" />
      </div>
    </Transition>

    <!-- rolling area -->
    <div class="dice-slots">
      <div v-for="(die, index) in dicePoolDisplay" :key="index" class="slot-container">
        <Transition name="roll">
          <SkillDie v-if="skillCheck" :rank="die.rank" :value="die.value" :size="90" />
        </Transition>
      </div>
    </div>

    <!-- footers -->
    <Transition name="fade">
      <div v-if="skillCheck" class="calculated-total">
        <span>{{ totalDisplaySetup }}</span>
        <span :class="skillCheck.success ? 'success' : 'failure'">{{ skillCheck.total }}</span>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="skillCheck" class="target">CR {{ skillCheck.challenge }}</div>
    </Transition>
  </div>
</template>

<style scoped>
.DiceTray {
  position: relative;
  width: calc(100px * 3 + 20px * 4 + 50px * 2);
  border: 50px solid var(--wood_dark);
  padding: 20px;
  background-color: var(--wood_light);
}

/* fade transition */

.fade-enter-active {
  animation: fade-in 1s ease;
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }

  30% {
    opacity: 0;
  }

  80% {
    opacity: 1;
  }

  100% {
    opacity: 1;
  }
}

/* roll dice */

.roll-enter-from {
  transform: rotate(180deg) scale(0.5);
}

.roll-enter-active {
  transition: transform 0.3s ease;
}

/* header - binary outcome */

.binary-outcome {
  position: absolute;
  top: -50px;
  left: 0;
  font-size: 2rem;
  line-height: 50px;
  font-weight: 700;
  color: white;
}

.success {
  font-weight: 700;
  color: gold;
}

.failure {
  font-weight: 700;
  color: silver;
}

/* header - shapes */

.shapes {
  position: absolute;
  top: -40px;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* slots */

.dice-slots {
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

/* footer - total */

.calculated-total {
  position: absolute;
  width: 220px;
  bottom: -50px;
  left: 0;
  line-height: 50px;
  font-size: 1.5rem;
  font-weight: 400;
  color: white;
}

/* footer - target */

.target {
  position: absolute;
  bottom: -50px;
  right: 0;
  line-height: 50px;
  font-size: 1.5rem;
  font-weight: 400;
  color: white;
}
</style>