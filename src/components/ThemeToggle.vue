<template>
  <div :class="['theme-toggle', { active: isDark }]">
    <Button
      @click="$emit('toggle')"
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

const props = defineProps({
  isDark: { type: Boolean, default: false }
})

defineEmits(['toggle'])
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
