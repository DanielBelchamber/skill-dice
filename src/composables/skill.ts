import { computed, ref, type ComputedRef, type Ref } from 'vue'

import {
  createSkillDie,
  useDicePool,
  type SkillDieRank,
  type SkillDieRoll,
  type SkillDie,
  type SkillDicePool
} from '@/composables/dicePool'
import type { ObjectValues } from '@/generic.types'

const SKILL_SHAPE = {
  STAR: 'Star',
  SQUARE: 'Square',
  TRIANGLE: 'Triangle',
  NONE: 'None'
} as const

type SkillShape = ObjectValues<typeof SKILL_SHAPE>

type SkillStripe = 0 | 1 | 2 | 3 | 4

type SkillProficiency = {
  rank: SkillDieRank
  stripe: SkillStripe
}

type SkillExperience = {
  progress: number
  threshold: number
}

const nextRank = (rank: SkillDieRank): SkillDieRank => {
  switch (rank) {
    case 'Novice':
      return 'Adept'
    case 'Adept':
      return 'Expert'
    case 'Expert':
    case 'Master':
      return 'Master'
  }
}

const assembleSkillDice = (proficiency: SkillProficiency): SkillDie[] => {
  const { rank, stripe } = proficiency
  return [...Array(5)].map((_, index) =>
    index < stripe ? createSkillDie(nextRank(rank)) : createSkillDie(rank)
  )
}

const convertToShape = (value: number): SkillShape => {
  switch (value) {
    case 3:
      return SKILL_SHAPE.TRIANGLE
    case 4:
      return SKILL_SHAPE.SQUARE
    case 5:
      return SKILL_SHAPE.STAR
    default:
      return SKILL_SHAPE.NONE
  }
}

const deriveShapes = (display: SkillDieRoll[]): SkillShape[] => {
  const shapeValues = display
    .map((roll) => roll.value)
    .filter((v) => v >= 3)
    .sort()
    .reverse()
  return shapeValues.map((v) => convertToShape(v))
}

type SkillRoll = {
  rollDisplay: SkillDieRoll[]
  total: number
  shapes: SkillShape[]
}

type SkillCheckResult = {
  modifier: number
  rollResult: SkillRoll
  success: boolean
}

type Skill = {
  rank: Ref<SkillDieRank>
  stripe: Ref<SkillStripe>
  experience: Ref<SkillExperience>
  poolDisplay: ComputedRef<SkillDieRank[]>
  setRank: (newRank: SkillDieRank) => void
  setStripe: (newStripe: SkillStripe) => void
  roll: () => SkillRoll
  check: (target: number, modifier?: number) => SkillCheckResult
}

const useSkill = (): Skill => {
  // default rank and stripe if necessary
  const rank = ref<SkillDieRank>('Novice')
  const stripe = ref<SkillStripe>(0)
  const experience = ref<SkillExperience>({ progress: 0, threshold: 100 })
  // derive display and pool from rank and stripe
  const dice = computed<SkillDie[]>(() =>
    assembleSkillDice({ rank: rank.value, stripe: stripe.value })
  )
  const poolDisplay = computed<SkillDieRank[]>(() => dice.value.map((die) => die.rank))
  const pool = computed<SkillDicePool>(() => useDicePool(dice.value))

  const setRank = (newRank: SkillDieRank) => (rank.value = newRank)
  const setStripe = (newStripe: SkillStripe) => (stripe.value = newStripe)

  const roll = (): SkillRoll => {
    const rollDisplay = pool.value.roll()
    const total = rollDisplay.reduce((sum, die) => sum + die.value, 0)
    const shapes = deriveShapes(rollDisplay)

    return { rollDisplay, total, shapes }
  }

  const check = (target: number, modifier = 0): SkillCheckResult => {
    const rollResult = roll()
    const success = rollResult.total + modifier >= target

    return { modifier, rollResult, success }
  }

  return { rank, stripe, experience, poolDisplay, setRank, setStripe, roll, check }
}

export { type Skill, type SkillRoll, type SkillShape, type SkillStripe, useSkill }
