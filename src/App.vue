<template>
  <div :class="['app', { dark: isDark }]">
    <ThemeToggle class="app-theme-toggle" :isDark="isDark" @toggle="toggleTheme" />

    <header class="app-header">
      <h1 class="app-title">
        <span class="app-icon"><i class="fas fa-coins"></i></span>
        Dividend Yield Planner
      </h1>
      <p class="app-subtitle">JEPI & SCHD projection calculator</p>
    </header>

    <!-- Tab Navigation -->
    <nav class="tabs" role="tablist" aria-label="Calculator views">
      <Button
        v-for="tab in tabs"
        :key="tab.value"
        :label="tab.label"
        :severity="activeTab === tab.value ? undefined : 'secondary'"
        :outlined="activeTab !== tab.value"
        @click="activeTab = tab.value"
        role="tab"
        :aria-selected="activeTab === tab.value"
        class="tab-button"
      />
    </nav>

    <!-- Single ETF Tab -->
    <section v-if="activeTab === 'single'" class="tab-panel" role="tabpanel">
      <EtfSwitcher v-model="singleEtf" class="mb-4" />

      <InputSliderRow v-model="inputs.startAmount" label="Starting investment (USD)" :min="0" :max="20000" :step="100" prefix="$" tooltip="Initial lump sum to invest" />
      <InputSliderRow v-model="inputs.monthlyTopUp" label="Monthly top-up (USD)" :min="0" :max="1000" :step="10" prefix="$" suffix="/mo" tooltip="Regular monthly contribution" />
      <InputSliderRow v-model="inputs.targetMonthlyIncome" label="Target monthly income (after tax)" :min="5" :max="200" :step="5" prefix="$" suffix="/mo" tooltip="Your desired monthly dividend income" />
      <InputSliderRow v-model="inputs.withholdingTax" label="Withholding tax" :min="0" :max="30" :step="5" suffix="%" tooltip="Tax rate applied to dividends (e.g. 30% for non-US residents)" />

      <!-- Results -->
      <div class="cards">
        <MetricCard title="Net Monthly Dividend" :value="results.currentNetDiv" prefix="$" decimals="2" severity="primary" />
        <MetricCard title="Months to Goal" :value="results.timeToGoalMonths" suffix="mo" severity="info" />
        <MetricCard title="Portfolio at Goal" :value="results.portfolioValueAtGoal" prefix="$" severity="success" />
      </div>

      <!-- Goal Messages -->
      <Message v-if="results.isGoalReached" severity="success" :closable="false">Goal reachable!</Message>
      <Message v-else-if="results.timeToGoalMonths > 120" severity="warn" :closable="false">Goal unlikely within 10 years</Message>
      <Message v-else severity="info" :closable="false">Goal in {{ results.timeToGoalMonths }} months</Message>

      <!-- Chart -->
      <ChartSection title="Projection" :empty="!results.chartValues?.length">
        <template #controls>
          <div class="chart-toggles">
            <label class="toggle-label">
              <input type="checkbox" v-model="showPortfolio" />
              <span>Portfolio Value</span>
            </label>
            <label class="toggle-label">
              <input type="checkbox" v-model="showDividends" />
              <span>Dividends</span>
            </label>
          </div>
        </template>
        <ChartVisualization :chartData="singleChartData" :options="singleChartOptions" />
      </ChartSection>
    </section>

    <!-- Split Tab -->
    <section v-if="activeTab === 'split'" class="tab-panel" role="tabpanel">
      <InputSliderRow v-model="splitInputs.startAmount" label="Starting investment (USD)" :min="0" :max="20000" :step="100" prefix="$" />
      <InputSliderRow v-model="splitInputs.monthlyTopUp" label="Monthly top-up (USD)" :min="0" :max="1000" :step="10" prefix="$" suffix="/mo" />
      <InputSliderRow v-model="splitInputs.splitAllocationRatio" label="JEPI allocation" :min="10" :max="90" :step="5" suffix="%" />
      <InputSliderRow v-model="splitInputs.targetMonthlyIncome" label="Target monthly income (after tax)" :min="5" :max="200" :step="5" prefix="$" suffix="/mo" />
      <InputSliderRow v-model="splitInputs.withholdingTax" label="Withholding tax" :min="0" :max="30" :step="5" suffix="%" />

      <div class="cards">
        <MetricCard title="Net Monthly Dividend (Split)" :value="splitResults.currentNetDiv" prefix="$" decimals="2" severity="primary" />
        <MetricCard title="Months to Goal" :value="splitResults.timeToGoalMonths" suffix="mo" severity="info" />
        <MetricCard title="Portfolio at Goal" :value="splitResults.portfolioValueAtGoal" prefix="$" severity="success" />
      </div>

      <Message v-if="splitResults.isGoalReached" severity="success" :closable="false">Goal reachable!</Message>
      <Message v-else-if="splitResults.timeToGoalMonths > 120" severity="warn" :closable="false">Goal unlikely within 10 years</Message>
      <Message v-else severity="info" :closable="false">Split goal in {{ splitResults.timeToGoalMonths }} months</Message>

      <ChartSection title="Split Projection" :empty="!results.chartValues?.length">
        <template #controls>
          <div class="chart-toggles">
            <label class="toggle-label">
              <input type="checkbox" v-model="showPortfolio" />
              <span>Portfolio Value</span>
            </label>
            <label class="toggle-label">
              <input type="checkbox" v-model="showDividends" />
              <span>Dividends</span>
            </label>
          </div>
        </template>
        <ChartVisualization :chartData="splitChartData" :options="splitChartOptions" />
      </ChartSection>
    </section>

    <!-- Compare Tab -->
    <section v-if="activeTab === 'compare'" class="tab-panel" role="tabpanel">
      <p class="compare-hint">Compare JEPI vs SCHD side by side.</p>
      <div class="etf-grid">
        <Card class="etf-card">
          <template #title><Tag value="JEPI" severity="info" /></template>
          <template #content>
            <div class="etf-name">JPMorgan Equity Premium Income ETF</div>
            <div class="etf-desc">High yield, monthly payouts</div>
            <div class="etf-stat"><span class="etf-stat-label">Yield</span><span class="etf-stat-value">8.26%</span></div>
            <div class="etf-stat"><span class="etf-stat-label">Growth (est)</span><span class="etf-stat-value">2.0%</span></div>
            <div class="etf-stat"><span class="etf-stat-label">Expense Ratio</span><span class="etf-stat-value">0.35%</span></div>
          </template>
        </Card>
        <Card class="etf-card">
          <template #title><Tag value="SCHD" severity="success" /></template>
          <template #content>
            <div class="etf-name">Schwab US Dividend Equity ETF</div>
            <div class="etf-desc">Dividend growth focus</div>
            <div class="etf-stat"><span class="etf-stat-label">Yield</span><span class="etf-stat-value">3.35%</span></div>
            <div class="etf-stat"><span class="etf-stat-label">Growth (est)</span><span class="etf-stat-value">7.0%</span></div>
            <div class="etf-stat"><span class="etf-stat-label">Expense Ratio</span><span class="etf-stat-value">0.06%</span></div>
          </template>
        </Card>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useCalculatorStore } from '../stores/calculatorStore.js'
import ThemeToggle from './components/ThemeToggle.vue'
import EtfSwitcher from './components/EtfSwitcher.vue'
import InputSliderRow from './components/InputSliderRow.vue'
import MetricCard from './components/MetricCard.vue'
import ChartSection from './components/ChartSection.vue'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Tag from 'primevue/tag'
import Message from 'primevue/message'
import ChartVisualization from './components/ChartVisualization.vue'

const store = useCalculatorStore()
const activeTab = ref('single')
const singleEtf = ref('JEPI')
const isDark = ref(false)

// Chart visibility toggles
const showPortfolio = ref(true)
const showDividends = ref(true)

// Tab config
const tabs = [
  { value: 'single', label: 'Single ETF' },
  { value: 'split', label: 'JEPI + SCHD Split' },
  { value: 'compare', label: 'Compare' }
]

// Computed
const inputs = computed(() => store.inputs)
const results = computed(() => store.results)

// Split inputs (local)
const splitInputs = ref({
  startAmount: 2000,
  monthlyTopUp: 100,
  splitAllocationRatio: 60,
  targetMonthlyIncome: 30,
  withholdingTax: 30
})

// Chart data for single ETF
const singleChartData = computed(() => {
  const brandColor = getComputedStyle(document.documentElement).getPropertyValue('--brand-500').trim() || '#E8630A'
  const warningColor = getComputedStyle(document.documentElement).getPropertyValue('--warning').trim() || '#F5A623'
  const datasets = []
  if (showPortfolio.value) {
    datasets.push({
      label: 'Portfolio Value',
      data: results.value.chartValues || [],
      borderColor: brandColor,
      backgroundColor: brandColor + '1A', // 10% opacity
      fill: true,
      yAxisID: 'y',
      tension: 0.3
    })
  }
  if (showDividends.value && results.value.chartDividends?.length) {
    datasets.push({
      label: 'Dividends',
      data: results.value.chartDividends,
      borderColor: warningColor,
      backgroundColor: warningColor + '0D', // 5% opacity
      fill: false,
      yAxisID: 'y1',
      borderDash: [5, 5],
      tension: 0.3
    })
  }
  return {
    labels: results.value.chartLabels || [],
    datasets
  }
})

const singleChartOptions = computed(() => ({
  scales: {
    y: {
      title: { display: true, text: 'Portfolio Value ($)', font: { size: 12 } },
      ticks: {
        color: getComputedStyle(document.documentElement).getPropertyValue('--brand-500').trim() || '#E8630A',
        font: { size: 11 },
        callback: formatAxisCurrency
      },
      grid: { color: 'rgba(232, 99, 10, 0.08)' }
    },
    y1: {
      position: 'right',
      title: { display: true, text: 'Dividends ($)', font: { size: 12 } },
      ticks: {
        color: getComputedStyle(document.documentElement).getPropertyValue('--warning').trim() || '#F5A623',
        font: { size: 11 },
        callback: formatAxisCurrency
      },
      grid: { drawOnChartArea: false }
    }
  }
}))

// Split chart data
const splitChartData = computed(() => {
  const successColor = getComputedStyle(document.documentElement).getPropertyValue('--success').trim() || '#2E8B57'
  const infoColor = getComputedStyle(document.documentElement).getPropertyValue('--info').trim() || '#1CA8C4'
  const datasets = []
  if (showPortfolio.value) {
    datasets.push({
      label: 'Portfolio Value (Split)',
      data: results.value.chartValues || [],
      borderColor: successColor,
      backgroundColor: successColor + '1A', // 10% opacity
      fill: true,
      yAxisID: 'y',
      tension: 0.3
    })
  }
  if (showDividends.value && results.value.chartDividends?.length) {
    datasets.push({
      label: 'Dividends (Split)',
      data: results.value.chartDividends,
      borderColor: infoColor,
      backgroundColor: infoColor + '0D', // 5% opacity
      fill: false,
      yAxisID: 'y1',
      borderDash: [5, 5],
      tension: 0.3
    })
  }
  return {
    labels: results.value.chartLabels || [],
    datasets
  }
})

const splitChartOptions = computed(() => ({
  scales: {
    y: {
      title: { display: true, text: 'Portfolio Value ($)', font: { size: 12 } },
      ticks: {
        color: getComputedStyle(document.documentElement).getPropertyValue('--success').trim() || '#2E8B57',
        font: { size: 11 },
        callback: formatAxisCurrency
      },
      grid: { color: 'rgba(46, 139, 87, 0.08)' }
    },
    y1: {
      position: 'right',
      title: { display: true, text: 'Dividends ($)', font: { size: 12 } },
      ticks: {
        color: getComputedStyle(document.documentElement).getPropertyValue('--info').trim() || '#1CA8C4',
        font: { size: 11 },
        callback: formatAxisCurrency
      },
      grid: { drawOnChartArea: false }
    }
  }
}))

// Format axis currency (2 decimal places)
function formatAxisCurrency(value) {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

// Theme toggle
function toggleTheme() {
  isDark.value = !isDark.value
  applyTheme()
}

function applyTheme() {
  const appEl = document.getElementById('app')
  if (isDark.value) {
    appEl?.classList.add('dark')
  } else {
    appEl?.classList.remove('dark')
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
  store.setEtf('JEPI')
  store.calculate()
})

// Watch single ETF
watch(singleEtf, (val) => store.setEtf(val))
watch(inputs, () => store.calculate(), { deep: true })

// Watch split inputs
watch(splitInputs, (v) => {
  store.setEtf('SPLIT')
  store.inputs.startAmount = v.startAmount
  store.inputs.monthlyTopUp = v.monthlyTopUp
  store.inputs.targetMonthlyIncome = v.targetMonthlyIncome
  store.inputs.withholdingTax = v.withholdingTax
  store.inputs.splitAllocationRatio = v.splitAllocationRatio
  store.calculate()
}, { deep: true })
</script>

<style scoped>
.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--sp-4);
  min-height: 100vh;
  background: var(--bg-app);
  color: var(--text-primary);
  transition: background var(--duration-normal) var(--ease-in-out),
              color var(--duration-normal) var(--ease-in-out);
}
.app-header {
  margin-bottom: var(--sp-6);
}
.app-title {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  line-height: var(--leading-tight);
  margin-bottom: var(--sp-1);
}
.app-icon {
  font-size: 1.5em;
}
.app-subtitle {
  font-size: var(--text-sm);
  color: var(--text-tertiary);
  margin: 0;
}
.app-theme-toggle {
  position: fixed;
  top: var(--sp-4);
  right: var(--sp-4);
  z-index: var(--z-sticky);
}
.tabs {
  display: flex;
  gap: var(--sp-2);
  margin-bottom: var(--sp-6);
  padding: var(--sp-1);
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-light);
  box-shadow: var(--shadow-xs);
}
.tab-button {
  flex: 1;
  border-radius: var(--radius-md) !important;
  font-size: var(--text-sm);
}
.tab-panel {
  animation: fadeIn var(--duration-normal) var(--ease-in-out);
}
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--sp-4);
  margin: var(--sp-5) 0;
}
.etf-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--sp-4);
  margin-top: var(--sp-4);
}
.etf-card {
  border-radius: var(--radius-lg) !important;
}
.etf-name {
  font-weight: var(--font-semibold);
  margin-bottom: var(--sp-1);
  color: var(--text-primary);
}
.etf-desc {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin-bottom: var(--sp-3);
}
.etf-stat {
  display: flex;
  justify-content: space-between;
  padding: var(--sp-1) 0;
  border-bottom: 1px solid var(--border-light);
}
.etf-stat-label {
  font-size: var(--text-sm);
  color: var(--text-secondary);
}
.etf-stat-value {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  font-family: var(--font-mono);
}
.compare-hint {
  font-size: var(--text-sm);
  color: var(--text-tertiary);
  margin-bottom: var(--sp-4);
}
.chart-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--text-secondary);
  font-family: var(--font-mono);
}
.mb-4 { margin-bottom: var(--sp-4); }

.chart-toggles {
  display: flex;
  gap: var(--sp-4);
  align-items: center;
}
.toggle-label {
  display: flex;
  align-items: center;
  gap: var(--sp-1);
  font-size: var(--text-sm);
  color: var(--text-secondary);
  cursor: pointer;
  user-select: none;
}
.toggle-label input[type="checkbox"] {
  accent-color: var(--brand-500);
  cursor: pointer;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

@media (max-width: 768px) {
  .app { padding: var(--sp-3); }
  .app-title { font-size: var(--text-2xl); }
  .tabs { flex-direction: column; }
  .cards { grid-template-columns: 1fr; }
}
</style>
