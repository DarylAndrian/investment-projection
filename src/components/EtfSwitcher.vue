<template>
  <div class="etf-switcher" role="radiogroup" :aria-label="label">
    <Button
      v-for="etf in etfs"
      :key="etf.value"
      :label="etf.label"
      :severity="modelValue === etf.value ? undefined : 'secondary'"
      :outlined="modelValue !== etf.value"
      @click="$emit('update:modelValue', etf.value)"
      size="small"
    />
  </div>
</template>

<script setup>
import Button from 'primevue/button'

defineProps({
  modelValue: { type: String, required: true },
  etfs: {
    type: Array,
    default: () => [
      { value: 'JEPI', label: 'JEPI' },
      { value: 'SCHD', label: 'SCHD' }
    ]
  },
  label: { type: String, default: 'Select ETF' }
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.etf-switcher {
  display: inline-flex;
  gap: var(--sp-2);
  padding: var(--sp-1);
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-light);
}
</style>
