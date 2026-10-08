<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const titles = {
  privacy: '隐私政策',
  terms: '服务条款',
  contact: '联系我们',
}

const pageTitle = titles[route.params.type] || '公告'
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col items-center justify-center px-6 py-20 relative"
  >
    <!-- 返回按钮 -->
    <div class="absolute top-8 left-8 md:top-12 md:left-12">
      <button
        class="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/70 backdrop-blur-sm border border-slate-200 shadow-sm text-slate-600 hover:bg-white hover:border-[#3b82f6] hover:text-[#3b82f6] hover:shadow-md active:scale-95 transition-all font-medium text-sm"
        @click="router.push('/')"
      >
        <svg
          class="w-4 h-4 transition-transform group-hover:-translate-x-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        <span>返回首页</span>
      </button>
    </div>

    <div class="max-w-2xl w-full mx-auto text-center space-y-10">
      <!-- 页面标题 -->
      <h1
        class="text-4xl md:text-5xl font-extrabold font-['Plus_Jakarta_Sans'] text-slate-800 tracking-tight"
      >
        {{ pageTitle }}
      </h1>

      <!-- 醒目的公告内容 -->
      <div
        class="bg-red-50 border-2 border-red-300 rounded-2xl p-8 md:p-12 shadow-lg"
      >
        <div class="flex items-start justify-center gap-3 mb-4">
          <svg
            class="w-8 h-8 text-red-500 mt-1 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
          <p class="text-2xl md:text-3xl font-bold text-red-600 leading-relaxed">
            该网站纯属设计玩，不要在作者授权下传播给任何人，因为涉及侵权问题
          </p>
        </div>
      </div>

      <!-- 联系 QQ -->
      <div class="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <p class="text-lg text-slate-600 font-medium">如有任何问题，请联系</p>
        <div class="flex items-center justify-center gap-3 mt-3">
          <svg
            class="w-7 h-7 text-[#3b82f6]"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 16.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm1.5-5.5c0 .828-.672 1.5-1.5 1.5s-1.5-.672-1.5-1.5V9c0-.828.672-1.5 1.5-1.5s1.5.672 1.5 1.5v4z"
            />
          </svg>
          <p class="text-3xl font-extrabold text-[#3b82f6] tracking-wider">
            QQ：2228315102
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
