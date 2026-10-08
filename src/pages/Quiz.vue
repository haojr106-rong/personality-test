<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CircleQuestion from '@/components/quiz/CircleQuestion.vue'
import OptionQuestion from '@/components/quiz/OptionQuestion.vue'
import { useQuizStore } from '@/stores/quiz'
import questionsData from '@/data/questions.json'
import { QUESTIONS_PER_PAGE } from '@/quiz-config'

const router = useRouter()
const route = useRoute()
const store = useQuizStore()

const totalQuestions = questionsData.length
const totalPages = Math.ceil(totalQuestions / QUESTIONS_PER_PAGE)

const startIndex = computed(() => store.currentPage * QUESTIONS_PER_PAGE)
const currentQuestions = computed(() =>
  questionsData.slice(startIndex.value, startIndex.value + QUESTIONS_PER_PAGE)
)

const progressPercent = computed(
  () => (store.answeredCount / totalQuestions) * 100
)
const showCompletionNotice = computed(
  () => route.query.notice === 'complete-required',
)

function handleAnswer(questionId, value, index) {
  const isFirstTime = store.answers[questionId] === undefined
  store.setAnswer(questionId, value)
  if (isFirstTime) {
    setTimeout(() => {
      const nextId = currentQuestions.value[index + 1]?.id
      if (nextId) {
        const el = document.getElementById(`q-${nextId}`)
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      } else {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth',
        })
      }
    }, 400)
  }
}

function goNext() {
  if (store.currentPage < totalPages - 1) {
    store.nextPage()
    window.scrollTo(0, 0)
  } else {
    router.push('/result')
  }
}

function goPrev() {
  store.prevPage()
  window.scrollTo(0, 0)
}

function restartQuiz() {
  if (!window.confirm('重新测试将清空当前答题进度，是否继续？')) return
  store.resetQuiz()
  router.replace('/quiz')
  window.scrollTo(0, 0)
}

const allCurrentAnswered = computed(() =>
  currentQuestions.value.every((q) => store.answers[q.id] !== undefined)
)

function isQuestionActive(qId) {
  // 未回答的题（包括当前和后面的）都亮
  return store.answers[qId] === undefined
}

function isCurrentQuestion(qId, index) {
  // 第一个未回答的题作为"当前题"，加绿环高亮
  if (store.answers[qId] !== undefined) return false
  if (index === 0) return true
  const prevId = currentQuestions.value[index - 1]?.id
  if (prevId && store.answers[prevId] !== undefined) return true
  return false
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 pb-24">
    <!-- 吸顶控制台 -->
    <header
      class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center gap-4"
    >
      <div class="flex-grow flex justify-center">
        <div class="w-full max-w-2xl space-y-2">
          <div class="flex justify-between items-end">
            <span class="text-lg font-black text-[#059669] italic"
              >{{ store.answeredCount }}/{{ totalQuestions }}</span
            >
            <div class="flex items-center gap-3">
              <span class="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                进度已自动保存
              </span>
              <button
                v-if="store.answeredCount"
                class="text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors"
                @click="restartQuiz"
              >
                重新测试
              </button>
            </div>
          </div>
          <div class="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              class="h-full bg-[#3b82f6] transition-all duration-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"
              :style="{ width: `${progressPercent}%` }"
            />
          </div>
        </div>
      </div>
    </header>

    <div
      v-if="showCompletionNotice"
      class="max-w-xl mx-auto mt-5 px-4"
    >
      <div class="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
        完成全部 60 道题目后才能生成测评报告，当前进度已为你保留。
      </div>
    </div>

    <main class="max-w-xl mx-auto px-4 mt-6 space-y-4">
      <div v-for="(q, i) in currentQuestions" :key="q.id" :id="`q-${q.id}`">
        <CircleQuestion
          v-if="q.type === 'circle'"
          :question="q"
          :isActive="isQuestionActive(q.id)"
          :isCurrent="isCurrentQuestion(q.id, i)"
          :selectedValue="store.answers[q.id] ?? null"
          @select="(val) => handleAnswer(q.id, val, i)"
        />
        <OptionQuestion
          v-else
          :question="q"
          :isActive="isQuestionActive(q.id)"
          :isCurrent="isCurrentQuestion(q.id, i)"
          :selectedValue="store.answers[q.id] ?? null"
          @select="(val) => handleAnswer(q.id, val, i)"
        />
      </div>

      <!-- 导航按钮 -->
      <div class="flex justify-between pt-8">
        <button
          :disabled="store.currentPage === 0"
          class="px-6 py-2 bg-white border border-slate-200 rounded-full text-sm font-bold disabled:opacity-20"
          @click="goPrev"
        >
          上一页
        </button>
        <button
          :disabled="!allCurrentAnswered"
          class="px-8 py-2 bg-[#059669] text-white rounded-full text-sm font-bold shadow-lg disabled:opacity-30"
          @click="goNext"
        >
          {{ store.currentPage === totalPages - 1 ? '查看结果' : '下一组题目' }}
        </button>
      </div>
    </main>
  </div>
</template>
