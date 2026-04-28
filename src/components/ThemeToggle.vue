<template>
  <div :class="['theme-toggle', { active: isDark }]">
    <Button
      @click="toggleTheme"
      v-bind="$attrs"
      :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    >
      <i :class="isDark ? 'fas fa-sun' : 'fas fa-moon'" />
    </Button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Button from 'primevue/button'

const isDark = ref(false)

function toggleTheme() {
  isDark.value = !isDark.value
  applyTheme()
}

function applyTheme() {
  const root = document.documentElement
  if (isDark.value) {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
  localStorage.setItem('investment-theme', isDark.value ? 'dark' : 'light')
}

onMounted(() => {
  const saved = localStorage.getItem('investment-theme')
  if (saved) {
    isDark.value = saved === 'dark'
  } else {
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  applyTheme()
})

defineExpose({ isDark, toggleTheme })
</script>

<style scoped>
.theme-toggle {
  position: fixed;
  top: var(--sp-4);
  right: var(--sp-4);
  z-index: var(--z-sticky);
}
.theme-toggle :deep(.p-button) {
  border-radius: var(--radius-full) !important;
  width: 3rem !important;
  height: 3rem !important;
  padding: 0 !important;
}
</style>
