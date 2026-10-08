<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div
    class="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-fade-in"
  >
    <div
      class="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 shadow-inner"
    >
      <span class="material-symbols-outlined text-5xl text-slate-400">lock</span>
    </div>
    <h2
      class="text-3xl font-bold text-[#151e12] mb-3 font-['Plus_Jakarta_Sans']"
    >
      尚未进行测试，暂无结果
    </h2>
    <p class="text-lg text-[#6b7c65] mb-8 max-w-md">
      请先完成全部 80 道性格探索题，系统才能为您生成专属的性格雷达图与深度分析报告。
    </p>
    <button
      class="bg-[#059669] text-white px-10 py-4 rounded-full font-bold shadow-[0_10px_20px_rgba(5,150,105,0.2)] hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(5,150,105,0.3)] transition-all active:scale-95 inline-flex items-center gap-2"
      @click="router.push('/quiz')"
    >
      <span>立即开始测试</span>
      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
      </svg>
    </button>
  </div>
</template>
