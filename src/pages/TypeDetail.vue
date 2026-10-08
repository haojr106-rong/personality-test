<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getTypeById, CATEGORY_STYLES } from '@/lib/type-catalog'

const router = useRouter()
const route = useRoute()

const typeId = computed(() => route.params.id?.toUpperCase() || 'INTP')
const type = computed(() => getTypeById(typeId.value))

// 批量导入头像图片
const imageModules = import.meta.glob('@/assets/16_type/**/*.webp', {
  eager: true,
  query: '?url',
  import: 'default',
})
const typeImages = {}
for (const [filePath, url] of Object.entries(imageModules)) {
  const match = filePath.match(/([A-Z]+)（.+）\.webp$/)
  if (match) typeImages[match[1]] = url
}

const avatarUrl = computed(() => {
  if (!type.value) return ''
  return typeImages[type.value.id] || ''
})

/** 根据类型所属阵营获取主题色 */
const categoryStyle = computed(() => {
  if (!type.value) return CATEGORY_STYLES['秩序基石']
  return CATEGORY_STYLES[type.value.category] || CATEGORY_STYLES['秩序基石']
})
</script>

<template>
  <div
    v-if="type"
    class="font-['Inter'] text-[#151e12] antialiased bg-white min-h-screen"
  >
    <!-- Banner Section -->
    <section
      class="relative pt-32 pb-48 overflow-hidden"
      :style="{
        backgroundColor: type.bannerBg || type.color,
        clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)',
      }"
    >
      <div
        class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between relative z-10"
      >
        <div class="md:w-1/2 text-white space-y-6">
          <div
            v-if="type.englishName"
            class="inline-block px-4 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm font-bold tracking-widest uppercase mb-4"
          >
            {{ type.englishName }} · {{ type.id }}{{ type.variant ? ` / ${type.variant}` : '' }}
          </div>
          <h1
            class="font-extrabold text-[48px] leading-tight font-['Plus_Jakarta_Sans']"
          >
            {{ type.name }}
            <span :style="{ color: categoryStyle.lighter }">{{ type.id }}</span>
          </h1>
          <p class="text-xl max-w-lg opacity-90">
            {{ type.description }}
          </p>
        </div>

        <div class="md:w-1/2 mt-12 md:mt-0 flex justify-center">
          <div class="relative group">
            <div
              class="absolute inset-0 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity"
              :style="{ backgroundColor: categoryStyle.lighter }"
            ></div>
            <img
              :alt="`${type.id} Avatar`"
              class="relative w-64 h-64 md:w-80 md:h-80 object-cover drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:-translate-y-2 transition-transform duration-500"
              :src="avatarUrl"
            />
          </div>
        </div>
      </div>

      <!-- Decorative Elements -->
      <div
        class="absolute top-1/4 left-10 w-24 h-24 bg-white/10 rounded-full blur-2xl"
      ></div>
      <div
        class="absolute bottom-1/4 right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"
      ></div>
    </section>

    <!-- Main Content Layout -->
    <main class="max-w-7xl mx-auto px-6 -mt-20 relative z-20 pb-32">
      <div class="grid grid-cols-1 lg:grid-cols-10 gap-8">
        <!-- Left Column (70%) -->
        <div class="lg:col-span-7 space-y-12">
          <div
            class="bg-white rounded-xl p-8 md:p-12 shadow-[0_20px_50px_rgba(59,130,246,0.08)]"
          >
            <h2
              class="text-3xl font-bold mb-8 flex items-center gap-3 font-['Plus_Jakarta_Sans']"
              :style="{ color: categoryStyle.primary }"
            >
              <span class="material-symbols-outlined text-4xl" :style="{ color: categoryStyle.primary }">psychology</span>
              你的性格类型
            </h2>

            <div
              v-if="type.quote"
              class="border-l-8 pl-8 py-4 mb-10 bg-white rounded-r-2xl italic text-xl text-slate-600 font-medium"
              :style="{ borderLeftColor: categoryStyle.lighter }"
            >
              "{{ type.quote }}"
            </div>

            <div
              class="prose prose-lg max-w-none text-slate-600 space-y-6 leading-relaxed"
            >
              <p
                v-for="(para, pIdx) in type.longDescription?.split('\n\n') || []"
                :key="pIdx"
                class="text-base"
              >
                {{ para }}
              </p>

              <!-- Core Traits Highlight -->
              <div
                v-if="type.traits?.length"
                class="mt-12 p-8 rounded-lg border-2"
              :style="{ backgroundColor: categoryStyle.light + '80', borderColor: categoryStyle.border }"
              >
                <h3
                  class="text-2xl font-bold mb-6 font-['Plus_Jakarta_Sans']"
                :style="{ color: categoryStyle.primary }"
                >
                  核心特质
                </h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div
                    v-for="trait in type.traits"
                    :key="trait.name"
                    class="flex items-start gap-4"
                  >
                    <div
                      class="w-12 h-12 rounded-full text-white flex items-center justify-center shrink-0 shadow-lg"
                      :style="{ backgroundColor: trait.color }"
                    >
                      <span class="material-symbols-outlined">{{ trait.icon }}</span>
                    </div>
                    <div>
                      <h4
                        class="font-bold"
                        :style="{ color: trait.color }"
                      >
                        {{ trait.name }}
                      </h4>
                      <p class="text-sm opacity-80">
                        {{ trait.description }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Secondary Cards -->
          <div
            v-if="type.career || type.relationship"
            class="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <div
              v-if="type.career"
              class="bg-white rounded-lg p-6 shadow-xl border-t-8"
            :style="{ borderTopColor: categoryStyle.primary }"
            >
              <h4 class="text-xl font-bold mb-4" :style="{ color: categoryStyle.primary }">职场路径</h4>
              <p class="text-slate-600">{{ type.career }}</p>
            </div>
            <div
              v-if="type.relationship"
              class="bg-white rounded-lg p-6 shadow-xl border-t-8"
            :style="{ borderTopColor: categoryStyle.primary }"
            >
              <h4 class="text-xl font-bold mb-4" :style="{ color: categoryStyle.primary }">人际关系</h4>
              <p class="text-slate-600">{{ type.relationship }}</p>
            </div>
          </div>
        </div>

        <!-- Right Column (30%) -->
        <div class="lg:col-span-3">
          <aside class="sticky top-28">
            <div
              class="bg-white rounded-xl p-8 shadow-[0_30px_60px_rgba(0,0,0,0.1)] text-center hover:-translate-y-2 transition-transform duration-300"
            >
              <div
                class="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              :style="{ backgroundColor: categoryStyle.primary + '1A' }"
              >
                <span
                  class="material-symbols-outlined text-4xl"
                  :style="{ color: categoryStyle.primary }"
                  >stars</span
                >
              </div>
              <h3 class="text-2xl font-bold text-[#151e12] mb-2">新来的？</h3>
              <p class="text-slate-600 mb-8 px-4">
                发现你独特的性格代码，开启自我认知的奇妙旅程。
              </p>
              <button
                class="w-full py-4 px-6 rounded-full font-bold text-lg shadow-[0_10px_20px_rgba(115,77,133,0.3)] flex items-center justify-center gap-2 group active:scale-95 transition-all text-white"
                :style="{ backgroundColor: type.color }"
                @click="router.push('/quiz')"
              >
                <span>进行测试</span>
                <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div>

            <div
              v-if="type.population"
              class="mt-8 rounded-xl p-6 border-2 border-dashed"
            :style="{ backgroundColor: categoryStyle.light + 'B3', borderColor: categoryStyle.border }"
            >
              <h4
                class="font-bold flex items-center gap-2 mb-4" :style="{ color: categoryStyle.primary }"
              >
                <span class="material-symbols-outlined">analytics</span>
                实时统计
              </h4>
              <div class="space-y-4">
                <div class="flex justify-between items-end">
                  <span class="text-sm text-slate-600">人口占比</span>
                  <span class="text-lg font-black" :style="{ color: categoryStyle.primary }">{{ type.population }}</span>
                </div>
                <div class="w-full bg-white/50 h-2 rounded-full overflow-hidden">
                  <div
                    class="h-full rounded-full"
                    :style="{ backgroundColor: categoryStyle.primary, width: type.population }"
                  ></div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  </div>

  <!-- Type not found -->
  <div
    v-else
    class="font-['Inter'] text-[#151e12] min-h-screen flex items-center justify-center"
  >
    <div class="text-center">
      <h2 class="text-3xl font-bold mb-4">未找到该人格类型</h2>
      <button
        class="text-[#3b82f6] underline"
        @click="router.push('/types')"
      >
        返回列表
      </button>
    </div>
  </div>
</template>
