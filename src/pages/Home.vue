<script setup>
import { useRouter } from 'vue-router'
import { readQuizProgress } from '@/lib/quiz-progress'
import { TOTAL_QUESTIONS } from '@/quiz-config'

const router = useRouter()
const progress = readQuizProgress()

const primaryAction = progress.allAnswered
  ? { label: '查看测评报告', path: '/result' }
  : progress.hasSavedProgress
    ? { label: `继续测试（${progress.answeredCount}/${TOTAL_QUESTIONS}）`, path: '/quiz' }
    : { label: '开始测试', path: '/quiz' }
</script>

<template>
  <div
    class="bg-white text-[#151e12] min-h-screen flex flex-col font-['Inter']"
  >
    <!-- Main Content (Hero) -->
    <main
      class="flex-grow flex items-center justify-center py-20 px-6"
    >
      <div class="w-full md:w-[70%] max-w-6xl mx-auto text-center space-y-10">
        <div class="space-y-6">
          <h1
            class="text-2xl sm:text-3xl md:text-[48px] lg:text-[56px] font-extrabold font-['Plus_Jakarta_Sans'] leading-snug md:leading-tight tracking-tight text-[#151e12]"
          >
            "未曾宣之于口的渴望，在此刻得到了精准的共鸣"
          </h1>
          <p class="text-sm md:text-base text-slate-500 max-w-2xl mx-auto italic">
            "通过科学的性格评估，深入了解你的天赋、倾向与内心世界。仅需 10
            分钟，遇见未知潜能。"
          </p>
        </div>

        <div class="pt-8">
          <button
            class="bg-[#3b82f6] text-white text-xl font-bold px-14 py-6 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 inline-flex items-center gap-3 mx-auto"
            @click="router.push(primaryAction.path)"
          >
            {{ primaryAction.label }}
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 pt-16">
          <div class="flex flex-col items-center">
            <span class="text-4xl font-extrabold text-green-500">12,840</span>
            <span
              class="text-sm font-bold text-slate-500 mt-2 uppercase tracking-wider"
              >今日测试人数</span
            >
          </div>
          <div class="flex flex-col items-center">
            <span class="text-4xl font-extrabold text-blue-500">2.5M+</span>
            <span
              class="text-sm font-bold text-slate-500 mt-2 uppercase tracking-wider"
              >累计测试人数</span
            >
          </div>
          <div class="flex flex-col items-center">
            <span class="text-4xl font-extrabold text-purple-500">98.4%</span>
            <span
              class="text-sm font-bold text-slate-500 mt-2 uppercase tracking-wider"
              >准确率</span
            >
          </div>
          <div class="flex flex-col items-center">
            <span class="text-4xl font-extrabold text-yellow-500">8.5m</span>
            <span
              class="text-sm font-bold text-slate-500 mt-2 uppercase tracking-wider"
              >平均答题耗时</span
            >
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white w-full py-12 border-t border-slate-100 mt-auto">
      <div
        class="flex flex-col md:flex-row justify-between items-center px-4 md:px-8 max-w-7xl mx-auto gap-6 md:gap-8 font-['Plus_Jakarta_Sans'] text-sm"
      >
        <div class="text-lg font-bold text-slate-800">Personality Test</div>
        <div class="text-slate-400">
          © 2026 Personality Test. Discover your inner world.
        </div>
        <div class="flex gap-8">
          <router-link
            class="text-slate-500 hover:text-[#3b82f6] transition-colors"
            to="/notice/privacy"
            >隐私政策</router-link
          >
          <router-link
            class="text-slate-500 hover:text-[#3b82f6] transition-colors"
            to="/notice/terms"
            >服务条款</router-link
          >
          <router-link
            class="text-slate-500 hover:text-[#3b82f6] transition-colors"
            to="/notice/contact"
            >联系我们</router-link
          >
        </div>
      </div>
    </footer>
  </div>
</template>
