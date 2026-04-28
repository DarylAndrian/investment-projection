<template>
  <div class="chart-section">
    <h3 v-if="title" class="chart-title">{{ title }}</h3>
    <div class="chart-controls" v-if="$slots.controls">
      <slot name="controls" />
    </div>
    <div class="chart-container">
      <!-- Loading Skeleton -->
      <div v-if="loading" class="chart-skeleton">
        <div class="skeleton-line" v-for="n in 5" :key="n" :style="{ width: `${Math.random() * 40 + 60}%` }" />
      </div>
      <!-- Empty State -->
      <div v-else-if="empty" class="empty-chart">
        <i class="fas fa-chart-line" />
        <span>No projection data yet</span>
        <p class="empty-hint">Adjust your inputs to see the projection</p>
      </div>
      <!-- Chart -->
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
.chart-skeleton {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 100%;
  gap: var(--sp-3);
  padding: var(--sp-4);
}
.skeleton-line {
  height: 12px;
  background: linear-gradient(
    90deg,
    var(--gray-200) 25%,
    var(--gray-100) 50%,
    var(--gray-200) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-sm);
}
:deep(.dark) .skeleton-line {
  background: linear-gradient(
    90deg,
    var(--gray-700) 25%,
    var(--gray-600) 50%,
    var(--gray-700) 75%
  );
  background-size: 200% 100%;
}
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
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
.empty-hint {
  font-size: var(--text-xs);
  opacity: 0.7;
  margin-top: var(--sp-1);
}
</style>
