import { ref } from 'vue'

import {
  createSkillDie,
  useDicePool,
  type SkillDicePool,
  type SkillDieRank,
  type SkillDieRoll
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

const createSkillDicePool = (proficiency: SkillProficiency): SkillDicePool => {
  const { rank, stripe } = proficiency
  const dice = [...Array(5)].map((_, index) =>
    index < stripe ? createSkillDie(nextRank(rank)) : createSkillDie(rank)
  )
  return useDicePool(dice)
}

type SkillRoll = {
  display: SkillDieRoll[]
  total: number
  shapes: SkillShape[]
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

const useSkill = (proficiency?: SkillProficiency) => {
  const rank = ref<SkillDieRank>(proficiency?.rank ?? 'Novice')
  const stripe = ref<SkillStripe>(proficiency?.stripe ?? 0)
  const pool = ref<SkillDicePool>(createSkillDicePool({ rank: rank.value, stripe: stripe.value }))

  const roll = (): SkillRoll => {
    const display = pool.value.roll()
    const total = display.reduce((sum, die) => sum + die.value, 0)
    const shapes = deriveShapes(display)

    return { display, total, shapes }
  }

  return { rank, stripe, roll }
}

export { type SkillRoll, nextRank, useSkill }
