<template>
  <div class="app">
    <h1>JEPI & SCHD Dividend Calculator</h1>

    <!-- Tabs -->
    <div class="tabs">
      <button :class="{ active: activeTab === 'single' }" @click="activeTab = 'single'">Single ETF</button>
      <button :class="{ active: activeTab === 'split' }" @click="activeTab = 'split'">JEPI + SCHD Split</button>
      <button :class="{ active: activeTab === 'compare' }" @click="activeTab = 'compare'">Compare</button>
    </div>

    <!-- SINGLE ETF TAB -->
    <div v-if="activeTab === 'single'" class="tab-panel">
      <div class="etf-switcher">
        <button :class="{ active: singleEtf === 'JEPI' }" @click="singleEtf = 'JEPI'">JEPI</button>
        <button :class="{ active: singleEtf === 'SCHD' }" @click="singleEtf = 'SCHD'">SCHD</button>
      </div>

      <Slider label="Starting investment (USD)" v-model="inputs.startAmount" :min="0" :max="20000" :step="100" prefix="$" />
      <Slider label="Monthly top-up (USD)" v-model="inputs.monthlyTopUp" :min="0" :max="1000" :step="10" prefix="$" suffix="/mo" />
      <Slider label="Target monthly income (after tax)" v-model="inputs.targetMonthlyIncome" :min="5" :max="200" :step="5" prefix="$" suffix="/mo" />
      <Slider label="Withholding tax" v-model="inputs.withholdingTax" :min="0" :max="30" :step="5" suffix="%" />

      <div class="cards">
        <MetricCard title="Net Monthly Dividend" :value="results.currentNetDiv" />
        <MetricCard title="Months to Goal" :value="results.timeToGoalMonths" />
        <MetricCard title="Portfolio at Goal" :value="results.portfolioValueAtGoal" />
      </div>

      <div class="goal-banner" :class="goalClass">
        {{ goalText }}
      </div>

      <div class="chart-wrap">
        <LineChart :data="chartData" />
      </div>
    </div>

    <!-- SPLIT TAB -->
    <div v-if="activeTab === 'split'" class="tab-panel">
      <Slider label="Starting investment (USD)" v-model="splitInputs.startAmount" :min="0" :max="20000" :step="100" prefix="$" />
      <Slider label="Monthly top-up (USD)" v-model="splitInputs.monthlyTopUp" :min="0" :max="1000" :step="10" prefix="$" suffix="/mo" />
      <Slider label="JEPI allocation" v-model="splitInputs.splitAllocationRatio" :min="10" :max="90" :step="5" suffix="%" />
      <Slider label="Target monthly income (after tax)" v-model="splitInputs.targetMonthlyIncome" :min="5" :max="200" :step="5" prefix="$" suffix="/mo" />
      <Slider label="Withholding tax" v-model="splitInputs.withholdingTax" :min="0" :max="30" :step="5" suffix="%" />

      <div class="cards">
        <MetricCard title="Net Monthly Dividend" :value="splitResults.currentNetDiv" />
        <MetricCard title="Months to Goal" :value="splitResults.timeToGoalMonths" />
        <MetricCard title="Portfolio at Goal" :value="splitResults.portfolioValueAtGoal" />
      </div>

      <div class="goal-banner" :class="splitGoalClass">
        {{ splitGoalText }}
      </div>

      <div class="chart-wrap">
        <LineChart :data="splitChartData" />
      </div>
    </div>

    <!-- COMPARE TAB -->
    <div v-if="activeTab === 'compare'" class="tab-panel">
      <p style="color:#666;margin-bottom:12px">Compare JEPI vs SCHD side by side.</p>
      <div class="etf-grid">
        <div class="ec">
          <div class="etag j">JEPI</div>
          <div class="en">JPMorgan Equity Premium Income ETF</div>
          <div class="ed">High yield, monthly payouts</div>
          <div class="es"><span class="ek">Yield</span><span class="ev">8.26%</span></div>
          <div class="es"><span class="ek">Growth (est)</span><span class="ev">2.0%</span></div>
          <div class="es"><span class="ek">Expense Ratio</span><span class="ev">0.35%</span></div>
        </div>
        <div class="ec">
          <div class="etag s">SCHD</div>
          <div class="en">Schwab US Dividend Equity ETF</div>
          <div class="ed">Dividend growth focus</div>
          <div class="es"><span class="ek">Yield</span><span class="ev">3.35%</span></div>
          <div class="es"><span class="ek">Growth (est)</span><span class="ev">7.0%</span></div>
          <div class="es"><span class="ek">Expense Ratio</span><span class="ev">0.06%</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useCalculatorStore } from '@/stores/calculatorStore.js'
import Slider from '@/components/Slider.vue'
import MetricCard from '@/components/MetricCard.vue'
import LineChart from '@/components/LineChart.vue'

const store = useCalculatorStore()
const activeTab = ref('single')
const singleEtf = ref('JEPI')

// Single ETF inputs bound to store
const inputs = computed(() => store.inputs)
const results = computed(() => store.results)

// Split inputs (local state)
const splitInputs = ref({
  startAmount: 2000,
  monthlyTopUp: 100,
  targetMonthlyIncome: 30,
  withholdingTax: 30,
  splitAllocationRatio: 60
})

const splitResults = ref({
  currentNetDiv: null,
  timeToGoalMonths: null,
  portfolioValueAtGoal: null,
  isGoalReached: false
})

// Chart data placeholders
const chartData = ref({ labels: [], datasets: [] })
const splitChartData = ref({ labels: [], datasets: [] })

// Goal banners
const goalClass = computed(() => {
  if (results.value.isGoalReached) return 'ok'
  if (results.value.timeToGoalMonths > 120) return 'no'
  return 'warn'
})
const goalText = computed(() => {
  if (results.value.isGoalReached) return '✅ Goal reachable!'
  if (results.value.timeToGoalMonths > 120) return '⚠️ Goal unlikely within 10 years'
  return '🕒 Keep saving — goal in ' + results.value.timeToGoalMonths + ' months'
})

const splitGoalClass = computed(() => {
  if (splitResults.value.isGoalReached) return 'ok'
  if (splitResults.value.timeToGoalMonths > 120) return 'no'
  return 'warn'
})
const splitGoalText = computed(() => {
  if (splitResults.value.isGoalReached) return '✅ Goal reachable!'
  if (splitResults.value.timeToGoalMonths > 120) return '⚠️ Goal unlikely within 10 years'
  return '🕒 Split goal in ' + splitResults.value.timeToGoalMonths + ' months'
})

// Watch singleEtf changes
watch(singleEtf, (val) => {
  store.setEtf(val)
})

// Watch store inputs to update store
watch(inputs, () => {
  store.calculate()
}, { deep: true })

// Update split results when split inputs change
watch(splitInputs, (v) => {
  // Temporarily set store to JEPI to run sim for split
  store.setEtf('SPLIT')
  // Override store inputs for split calculation
  store.inputs.startAmount = v.startAmount
  store.inputs.monthlyTopUp = v.monthlyTopUp
  store.inputs.targetMonthlyIncome = v.targetMonthlyIncome
  store.inputs.withholdingTax = v.withholdingTax
  store.inputs.splitAllocationRatio = v.splitAllocationRatio
  store.calculate()
  // Copy results
  splitResults.value.currentNetDiv = store.results.currentNetDiv
  splitResults.value.timeToGoalMonths = store.results.timeToGoalMonths
  splitResults.value.portfolioValueAtGoal = store.results.portfolioValueAtGoal
  splitResults.value.isGoalReached = store.results.isGoalReached
}, { deep: true })

// Initial calcs
store.setEtf('JEPI')
store.calculate()
</script>

<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f9f9f7; color: #1a1a1a; padding: 24px; font-size: 15px; }
h1 { font-size: 20px; font-weight: 500; margin-bottom: 1.5rem; color: #1a1a1a; }
.tabs { display: flex; gap: 8px; margin-bottom: 1.5rem; }
.tabs button { padding: 7px 20px; border-radius: 8px; border: 0.5px solid #ccc; background: transparent; color: #666; font-size: 14px; cursor: pointer; }
.tabs button.active { background: #f0f0ee; color: #1a1a1a; border-color: #999; font-weight: 500; }
.slabel { font-size: 12px; color: #666; margin-bottom: 4px; letter-spacing: .03em; }
.srow { display: flex; align-items: center; gap: 12px; margin-bottom: 1.1rem; }
.srow input[type=range] { flex: 1; accent-color: #378ADD; }
.sval { font-size: 14px; font-weight: 500; min-width: 72px; text-align: right; color: #1a1a1a; }
.cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px; margin-bottom: 1.25rem; }
.metric-card { background: #f0f0ee; border-radius: 8px; padding: 12px 14px; }
.metric-card .ml { font-size: 12px; color: #666; margin-bottom: 4px; }
.metric-card .mv { font-size: 19px; font-weight: 500; color: #1a1a1a; }
.metric-card .ms { font-size: 11px; color: #999; margin-top: 2px; }
.goal-banner { background: #f0f0ee; border-radius: 8px; padding: 11px 16px; font-size: 13px; text-align: center; }
.goal-banner.ok { color: #3B6D11; font-weight: 500; }
.goal-banner.no { color: #993C1D; font-weight: 500; }
.goal-banner.warn { color: #854F0B; font-weight: 500; }
.chart-wrap { background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 12px; height: 280px; }
.etf-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.ec { background: #fff; border: 1px solid #ddd; border-radius: 12px; padding: 14px 16px; }
.etag { display: inline-block; font-size: 11px; padding: 2px 8px; border-radius: 6px; margin-bottom: 8px; }
.etag.j { background: #E6F1FB; color: #0C447C; }
.etag.s { background: #EAF3DE; color: #3B6D11; }
.en { font-size: 14px; font-weight: 500; color: #1a1a1a; margin-bottom: 2px; }
.ed { font-size: 12px; color: #666; margin-bottom: 10px; }
.es { display: flex; justify-content: space-between; font-size: 13px; padding: 4px 0; border-bottom: .5px solid #eee; }
.es:last-child { border-bottom: none; }
.ek { color: #666; }
.ev { font-weight: 500; color: #1a1a1a; }
</style>