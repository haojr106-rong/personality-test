import {
  QUIZ_STORAGE_KEY,
  QUIZ_STORAGE_VERSION,
  TOTAL_QUESTIONS,
} from '@/quiz-config'

const VALID_ANSWER_VALUES = new Set([-2, -1, 0, 1, 2])

function emptyProgress() {
  return {
    answeredCount: 0,
    allAnswered: false,
    hasSavedProgress: false,
  }
}

export function readQuizProgress() {
  try {
    const rawState = localStorage.getItem(QUIZ_STORAGE_KEY)
    if (!rawState) return emptyProgress()

    const state = JSON.parse(rawState)
    if (
      state.version !== QUIZ_STORAGE_VERSION
      || !state.answers
      || typeof state.answers !== 'object'
      || Array.isArray(state.answers)
    ) {
      return emptyProgress()
    }

    const answeredCount = Object.entries(state.answers).filter(([questionId, value]) => {
      const normalizedId = Number(questionId)
      return Number.isInteger(normalizedId)
        && normalizedId >= 1
        && normalizedId <= TOTAL_QUESTIONS
        && VALID_ANSWER_VALUES.has(value)
    }).length

    const allAnswered = answeredCount === TOTAL_QUESTIONS
    return {
      answeredCount,
      allAnswered,
      hasSavedProgress: answeredCount > 0 && !allAnswered,
    }
  } catch {
    return emptyProgress()
  }
}
