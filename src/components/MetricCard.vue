<template>
  <Card class="metric-card" :class="[`severity-${severity}`]">
    <template #title>
      <span class="metric-label">{{ title }}</span>
    </template>
    <template #content>
      <div class="metric-value">
        <span v-if="prefix" class="metric-prefix">{{ prefix }}</span>
        <span class="metric-number">{{ formattedValue }}</span>
        <span v-if="suffix" class="metric-suffix">{{ suffix }}</span>
      </div>
      <div v-if="subtext" class="metric-subtext">{{ subtext }}</div>
    </template>
  </Card>
</template>

<script setup>
import { computed } from 'vue'
import Card from 'primevue/card'

const props = defineProps({
  title: { type: String, required: true },
  value: { type: [Number, String], default: null },
  prefix: { type: String, default: '' },
  suffix: { type: String, default: '' },
  subtext: { type: String, default: '' },
  severity: { type: String, default: 'primary' }, // primary | success | warning | danger
  decimals: { type: Number, default: 2 }
})

const formattedValue = computed(() => {
  if (props.value === null || props.value === undefined) return '--'
  if (typeof props.value === 'string') return props.value
  return props.value.toLocaleString('en-US', {
    minimumFractionDigits: props.decimals,
    maximumFractionDigits: props.decimals
  })
})
</script>

<style scoped>
.metric-card {
  background: var(--bg-card) !important;
  border: 1px solid var(--border-light) !important;
  border-radius: var(--radius-lg) !important;
  box-shadow: var(--shadow-sm) !important;
  transition: box-shadow var(--duration-fast) var(--ease-in-out),
              transform var(--duration-fast) var(--ease-in-out);
}
.metric-card:hover {
  box-shadow: var(--shadow-md) !important;
  transform: translateY(-2px);
}
.metric-label {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  font-weight: var(--font-medium);
}
.metric-value {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  line-height: var(--leading-tight);
  margin-top: var(--sp-2);
}
.metric-prefix,
.metric-suffix {
  font-size: var(--text-lg);
  color: var(--text-tertiary);
  font-weight: var(--font-normal);
}
.severity-success .metric-value { color: var(--success); }
.severity-warning .metric-value { color: var(--warning); }
.severity-danger .metric-value  { color: var(--danger);  }
.metric-subtext {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  margin-top: var(--sp-1);
}
</style>
