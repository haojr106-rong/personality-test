<script setup>
import { useRouter } from 'vue-router'
import { getTypesByCategoryName } from '@/lib/type-utils'

const router = useRouter()

// 批量导入 16 型人格 PNG 图片，构建类型ID → 图片URL 的映射
const imageModules = import.meta.glob('@/assets/16_type/**/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
})

const typeImages = {}
for (const [filePath, url] of Object.entries(imageModules)) {
  const match = filePath.match(/([A-Z]+)（.+）\.png$/)
  if (match) {
    typeImages[match[1]] = url
  }
}

const categories = [
  {
    key: '秩序基石',
    title: '秩序基石',
    subtitle: '现实 + 掌控',
    watermark: '秩序',
    accentColor: '#7c3aed',
    bgClass: 'bg-violet-50',
  },
  {
    key: '机变原力',
    title: '机变原力',
    subtitle: '现实 + 随性',
    watermark: '机变',
    accentColor: '#059669',
    bgClass: 'bg-emerald-50/50',
  },
  {
    key: '远见智囊',
    title: '远见智囊',
    subtitle: '构想 + 掌控',
    watermark: '远见',
    accentColor: '#3b82f6',
    bgClass: 'bg-blue-50',
  },
  {
    key: '无界星火',
    title: '无界星火',
    subtitle: '构想 + 随性',
    watermark: '无界',
    accentColor: '#d97706',
    bgClass: 'bg-amber-50/50',
  },
]

function getTypesByCategory(category) {
  return getTypesByCategoryName(category)
}

function clipPath(index) {
  // 奇偶交替两种 clipping 形状
  return index % 2 === 0
    ? 'polygon(0 0, 100% 5%, 100% 100%, 0 95%)'
    : 'polygon(0 5%, 100% 0, 100% 95%, 0 100%)'
}
</script>

<template>
  <div class="font-['Inter'] text-[#151e12] min-h-screen bg-white">
    <main class="pt-12 pb-32 overflow-x-hidden">
      <!-- Hero Title Section -->
      <section class="max-w-7xl mx-auto px-4 md:px-8 mb-12 text-center">
        <h1
          class="text-5xl font-extrabold text-[#059669] mb-4 font-['Plus_Jakarta_Sans']"
        >
          洞见 16 种核心人格
        </h1>
        <p class="text-lg text-[#6b7c65] max-w-2xl mx-auto mb-8">
          摒弃繁冗标签，深度解析你在复杂社会模型中的决策基准与底层驱动力。
        </p>
        <div class="flex justify-center mb-4">
          <button
            class="bg-[#7c3aed] text-white px-10 py-3 rounded-full font-bold inline-flex items-center gap-2 shadow-[0_10px_25px_rgba(124,58,237,0.35)] hover:-translate-y-1 hover:scale-105 hover:shadow-[0_15px_30px_rgba(124,58,237,0.45)] hover:bg-[#6d28d9] active:translate-y-0 active:scale-95 transition-all duration-300 text-lg"
            @click="router.push('/quiz')"
          >
            <span>开启深度测评</span>
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>
      </section>

      <!-- Category Sections -->
      <section
        v-for="(cat, idx) in categories"
        :key="cat.key"
        :class="[cat.bgClass, 'relative w-full py-12 md:py-20 mb-8 md:mb-12 overflow-hidden']"
        :style="{ clipPath: clipPath(idx) }"
      >
        <!-- Watermark -->
        <div
          class="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none"
        >
          <span
            class="text-[12rem] font-black hidden md:block"
            :style="{ color: cat.accentColor }"
          >
            {{ cat.watermark }}
          </span>
        </div>

        <div class="relative max-w-7xl mx-auto px-4 md:px-8">
          <!-- Category Header -->
          <div class="flex items-center gap-3 mb-10">
            <div
              class="w-3 h-10 rounded-full"
              :style="{ backgroundColor: cat.accentColor }"
            ></div>
            <h2
              class="text-3xl font-bold font-['Plus_Jakarta_Sans']"
              :style="{ color: cat.accentColor }"
            >
              {{ cat.title }}
              <span class="text-lg font-normal opacity-70">
                ({{ cat.subtitle }})
              </span>
            </h2>
          </div>

          <!-- Type Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div
              v-for="type in getTypesByCategory(cat.key)"
              :key="type.id"
              class="group bg-white rounded-xl p-8 shadow-[0_20px_50px_rgba(115,77,133,0.1)] hover:-translate-y-2 transition-transform duration-300"
            >
              <div
                class="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white shadow-inner"
                :style="{ backgroundColor: `#${type.avatarBg}` }"
              >
                <img
                  :alt="type.id"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  :src="typeImages[type.id]"
                />
              </div>
              <h3
                class="text-2xl font-bold text-center mb-1 font-['Plus_Jakarta_Sans']"
              >
                {{ type.name }}
              </h3>
              <p
                class="text-center font-semibold mb-4 tracking-widest"
                :style="{ color: type.color }"
              >
                {{ type.id }}
              </p>
              <p class="text-center text-[#6b7c65] text-sm">
                {{ type.description }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Final CTA Section -->
      <section class="max-w-7xl mx-auto px-4 md:px-8 py-16 text-center">
        <div class="flex flex-col items-center gap-6">
          <h2
            class="text-3xl font-bold text-[#059669] font-['Plus_Jakarta_Sans']"
          >
            准备好定位你的核心图谱了吗？
          </h2>
          <p class="text-[#6b7c65] text-lg max-w-lg">
            通过科学严谨的评估矩阵，建立你的专属认知行为模型。
          </p>
          <button
            class="bg-[#7c3aed] text-white px-12 py-4 rounded-full font-bold inline-flex items-center gap-2 shadow-[0_10px_25px_rgba(124,58,237,0.35)] hover:-translate-y-1 hover:scale-105 hover:shadow-[0_15px_30px_rgba(124,58,237,0.45)] hover:bg-[#6d28d9] active:translate-y-0 active:scale-95 transition-all duration-300 text-xl"
            @click="router.push('/quiz')"
          >
            <span>进入评估系统</span>
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>
      </section>
    </main>
  </div>
</template>
