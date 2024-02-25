import type { ObjectValues } from '@/generic.types'

const SKILL_DIE_TYPE = {
  MASTER: 'Master',
  EXPERT: 'Expert',
  ADEPT: 'Adept',
  NOVICE: 'Novice'
} as const

type SkillDieRank = ObjectValues<typeof SKILL_DIE_TYPE>

type SkillDieValue = 0 | 1 | 2 | 3 | 4 | 5

const VALUE_PYRAMID = [
  5, 4, 4, 3, 3, 3, 2, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0
] as SkillDieValue[]

type SkillDie = {
  rank: SkillDieRank
  faceCount: number
}

const MASTER_DIE: SkillDie = {
  rank: SKILL_DIE_TYPE.MASTER,
  faceCount: 6
}

const EXPERT_DIE: SkillDie = {
  rank: SKILL_DIE_TYPE.EXPERT,
  faceCount: 8
}

const ADEPT_DIE: SkillDie = {
  rank: SKILL_DIE_TYPE.ADEPT,
  faceCount: 12
}

const NOVICE_DIE: SkillDie = {
  rank: SKILL_DIE_TYPE.NOVICE,
  faceCount: 20
}

const createSkillDie = (type: SkillDieRank): SkillDie => {
  switch (type) {
    case SKILL_DIE_TYPE.MASTER:
      return { ...MASTER_DIE }
    case SKILL_DIE_TYPE.EXPERT:
      return { ...EXPERT_DIE }
    case SKILL_DIE_TYPE.ADEPT:
      return { ...ADEPT_DIE }
    case SKILL_DIE_TYPE.NOVICE:
      return { ...NOVICE_DIE }
  }
}

type SkillDieRoll = {
  type: SkillDieRank
  value: SkillDieValue
}

const rollDie = (type: SkillDieRank, faceCount: number): SkillDieRoll => {
  const values = VALUE_PYRAMID.slice(0, faceCount)
  return {
    type: type,
    value: values[Math.floor(Math.random() * faceCount)]
  }
}

type SkillDicePool = {
  roll: () => SkillDieRoll[]
}

const useDicePool = (dice: SkillDie[]): SkillDicePool => {
  const roll = (): SkillDieRoll[] => dice.map((die) => rollDie(die.rank, die.faceCount))

  return { roll }
}

export {
  type SkillDicePool,
  type SkillDie,
  type SkillDieRoll,
  type SkillDieRank,
  type SkillDieValue,
  createSkillDie,
  useDicePool
}
