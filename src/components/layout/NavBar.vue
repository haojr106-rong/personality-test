<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const mobileMenuOpen = ref(false)

const navLinks = [
  { to: '/quiz', label: '人格测试' },
  { to: '/types', label: '人格类型' },
  { to: '/result', label: '人格分析' },
]

function isActive(path) {
  return route.path === path
}

function closeMenu() {
  mobileMenuOpen.value = false
}
</script>

<template>
  <nav class="bg-white/80 backdrop-blur-md border-b border-slate-100 w-full top-0 sticky z-50">
    <div class="flex justify-between items-center px-4 md:px-8 py-3 md:py-4 max-w-7xl mx-auto">
      <router-link
        to="/"
        class="text-xl md:text-2xl font-black text-[#3b82f6] tracking-tight font-['Plus_Jakarta_Sans'] hover:scale-105 active:scale-95 transition-all"
      >
        Personality Test
      </router-link>

      <!-- 桌面导航 -->
      <div class="hidden md:flex items-center gap-8 lg:gap-10 font-['Plus_Jakarta_Sans'] font-bold">
        <router-link
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          :class="[
            'pb-1 transition-all text-sm lg:text-base',
            isActive(link.to)
              ? 'text-[#3b82f6] border-b-2 border-[#3b82f6]'
              : 'text-slate-600 hover:text-[#3b82f6]'
          ]"
        >
          {{ link.label }}
        </router-link>
      </div>

      <!-- 移动端汉堡按钮 -->
      <button
        class="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition-colors"
        @click="mobileMenuOpen = !mobileMenuOpen"
        aria-label="切换导航菜单"
      >
        <span class="material-symbols-outlined text-2xl">
          {{ mobileMenuOpen ? 'close' : 'menu' }}
        </span>
      </button>
    </div>

    <!-- 移动端下拉菜单 -->
    <div
      v-if="mobileMenuOpen"
      class="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-md px-4 py-3 space-y-1"
    >
      <router-link
        v-for="link in navLinks"
        :key="link.to"
        :to="link.to"
        class="block px-4 py-3 rounded-xl font-bold text-sm transition-colors"
        :class="
          isActive(link.to)
            ? 'text-[#3b82f6] bg-blue-50'
            : 'text-slate-600 hover:bg-slate-50'
        "
        @click="closeMenu"
      >
        {{ link.label }}
      </router-link>
    </div>
  </nav>
</template>
