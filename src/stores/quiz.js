import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import questionsData from '@/data/questions.json'
import {
  QUESTIONS_PER_PAGE,
  QUIZ_STORAGE_KEY,
  QUIZ_STORAGE_VERSION,
} from '@/quiz-config'

const questionMap = new Map(questionsData.map((question) => [question.id, question]))
const totalPages = Math.ceil(questionsData.length / QUESTIONS_PER_PAGE)

function isValidAnswer(question, value) {
  if (!question || !Number.isFinite(value)) return false

  if (question.type === 'circle') {
    return [-2, -1, 0, 1, 2].includes(value)
  }

  return question.choices?.some((choice) => choice.value === value) ?? false
}

function sanitizeAnswers(rawAnswers) {
  if (!rawAnswers || typeof rawAnswers !== 'object' || Array.isArray(rawAnswers)) {
    return {}
  }

  return Object.entries(rawAnswers).reduce((result, [questionId, value]) => {
    const normalizedId = Number(questionId)
    const question = questionMap.get(normalizedId)
    if (isValidAnswer(question, value)) {
      result[normalizedId] = value
    }
    return result
  }, {})
}

function restoreQuizState() {
  try {
    const rawState = localStorage.getItem(QUIZ_STORAGE_KEY)
    if (!rawState) return null

    const state = JSON.parse(rawState)
    if (state.version !== QUIZ_STORAGE_VERSION) {
      localStorage.removeItem(QUIZ_STORAGE_KEY)
      return null
    }

    return {
      answers: sanitizeAnswers(state.answers),
      currentPage: Math.min(Math.max(Number(state.currentPage) || 0, 0), totalPages - 1),
      updatedAt: Number(state.updatedAt) || null,
    }
  } catch {
    localStorage.removeItem(QUIZ_STORAGE_KEY)
    return null
  }
}

export const useQuizStore = defineStore('quiz', () => {
  const restoredState = restoreQuizState()
  const answers = ref(restoredState?.answers ?? {})
  const currentPage = ref(restoredState?.currentPage ?? 0)
  const updatedAt = ref(restoredState?.updatedAt ?? null)

  function setAnswer(questionId, value) {
    const normalizedId = Number(questionId)
    const question = questionMap.get(normalizedId)
    if (!isValidAnswer(question, value)) return

    answers.value = { ...answers.value, [normalizedId]: value }
  }

  function nextPage() {
    currentPage.value = Math.min(currentPage.value + 1, totalPages - 1)
  }

  function prevPage() {
    currentPage.value = Math.max(0, currentPage.value - 1)
  }

  function resetQuiz() {
    answers.value = {}
    currentPage.value = 0
  }

  const allAnswered = computed(() => {
    return questionsData.every(q => answers.value[q.id] !== undefined)
  })

  const answeredCount = computed(() => Object.keys(answers.value).length)
  const hasSavedProgress = computed(() => answeredCount.value > 0 && !allAnswered.value)

  watch(
    [answers, currentPage],
    () => {
      const savedAt = Date.now()
      updatedAt.value = savedAt
      localStorage.setItem(
        QUIZ_STORAGE_KEY,
        JSON.stringify({
          version: QUIZ_STORAGE_VERSION,
          answers: answers.value,
          currentPage: currentPage.value,
          updatedAt: savedAt,
        }),
      )
    },
    { deep: true },
  )

  return {
    answers,
    currentPage,
    updatedAt,
    setAnswer,
    nextPage,
    prevPage,
    resetQuiz,
    allAnswered,
    answeredCount,
    hasSavedProgress,
  }
})
