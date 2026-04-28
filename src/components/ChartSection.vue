<template>
  <div class="chart-section">
    <h3 v-if="title" class="chart-title">{{ title }}</h3>
    <div class="chart-controls" v-if="$slots.controls">
      <slot name="controls" />
    </div>
    <div class="chart-container">
      <div v-if="loading" class="loading-overlay">
        <i v-if="loading" class="fas fa-spinner fa-spin" style="font-size: 2rem; color: var(--brand-500)" />
      </div>
      <div v-else-if="empty" class="empty-chart">
        <i class="fas fa-chart-line" />
        <span>No projection data yet</span>
      </div>
      <slot v-else />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, default: '' },
  loading: { type: Boolean, default: false },
  empty: { type: Boolean, default: false }
})
</script>

<style scoped>
.chart-section {
  margin-top: var(--sp-6);
}
.chart-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  margin-bottom: var(--sp-3);
  color: var(--text-primary);
}
.chart-controls {
  margin-bottom: var(--sp-4);
}
.chart-container {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: var(--sp-5);
  height: 320px;
  position: relative;
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--duration-fast) var(--ease-in-out);
}
.chart-container:hover {
  box-shadow: var(--shadow-md);
}
.loading-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-lg);
  z-index: 10;
}
:deep(.dark) .loading-overlay {
  background: rgba(15, 23, 42, 0.8);
}
.empty-chart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-tertiary);
  font-size: var(--text-sm);
  gap: var(--sp-2);
}
.empty-chart i {
  font-size: 2rem;
  opacity: 0.4;
}
</style>
