import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

type ObjectValues<T> = T[keyof T]

const SKILL_DIE_TYPE = {
  MASTER: 'Master',
  EXPERT: 'Expert',
  ADEPT: 'Adept',
  NOVICE: 'Novice'
} as const
export type SkillDieType = ObjectValues<typeof SKILL_DIE_TYPE>

export type SkillDieValue = 0 | 1 | 2 | 3 | 4 | 5

const VALUE_PYRAMID = [
  5, 4, 4, 3, 3, 3, 2, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0
] as SkillDieValue[]

type SkillDie = {
  type: SkillDieType
  faceCount: number
}

const MasterDie: SkillDie = {
  type: SKILL_DIE_TYPE.MASTER,
  faceCount: 6
}

const ExpertDie: SkillDie = {
  type: SKILL_DIE_TYPE.EXPERT,
  faceCount: 8
}

const AdeptDie: SkillDie = {
  type: SKILL_DIE_TYPE.ADEPT,
  faceCount: 12
}

const NoviceDie: SkillDie = {
  type: SKILL_DIE_TYPE.NOVICE,
  faceCount: 20
}

type SkillDieRoll = {
  type: SkillDieType
  value: SkillDieValue
}

const rollDie = (type: SkillDieType, faceCount: number): SkillDieRoll => {
  const values = VALUE_PYRAMID.slice(0, faceCount)
  return {
    type: type,
    value: values[Math.floor(Math.random() * faceCount)]
  }
}

export const useDicePool = defineStore('Dice Pool', () => {
  const pool = ref<SkillDie[]>([])
  const typeOptions = ref<SkillDieType[]>(['Novice', 'Adept', 'Expert', 'Master'])
  const isAssembled = computed(() => pool.value.length === 5)
  const assembledTypes = computed(() => pool.value.map((die) => die.type))

  const addDie = (dieType: SkillDieType) => {
    if (pool.value.length < 5) {
      switch (dieType) {
        case 'Master':
          pool.value.push(MasterDie)
          break
        case 'Expert':
          pool.value.push(ExpertDie)
          break
        case 'Adept':
          pool.value.push(AdeptDie)
          break
        case 'Novice':
          pool.value.push(NoviceDie)
          break
      }
    }
  }

  const removeDie = (index: number) => pool.value.splice(index, 1)

  const roll = () => pool.value.map((die) => rollDie(die.type, die.faceCount))

  return {
    isAssembled,
    typeOptions,
    assembledTypes,
    addDie,
    removeDie,
    roll
  }
})
