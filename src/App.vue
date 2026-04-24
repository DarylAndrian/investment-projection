<template>
  <div class="app">
    <h1>JEPI & SCHD Dividend Calculator</h1>

    <!-- Tabs -->
    <div class="tabs">
      <Button :class="{ 'p-button-outlined': activeTab !== 'single' }" label="Single ETF" @click="activeTab = 'single'" />
      <Button :class="{ 'p-button-outlined': activeTab !== 'split' }" label="JEPI + SCHD Split" @click="activeTab = 'split'" />
      <Button :class="{ 'p-button-outlined': activeTab !== 'compare' }" label="Compare" @click="activeTab = 'compare'" />
    </div>

    <!-- SINGLE ETF TAB -->
    <div v-if="activeTab === 'single'" class="tab-panel">
      <div class="etf-switcher">
        <Button :class="{ 'p-button-outlined': singleEtf !== 'JEPI' }" label="JEPI" @click="singleEtf = 'JEPI'" />
        <Button :class="{ 'p-button-outlined': singleEtf !== 'SCHD' }" label="SCHD" @click="singleEtf = 'SCHD'" />
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

      <Message v-if="results.isGoalReached" severity="success" :closable="false">Goal reachable!</Message>
      <Message v-else-if="results.timeToGoalMonths > 120" severity="warn" :closable="false">Goal unlikely within 10 years</Message>
      <Message v-else severity="info" :closable="false">Goal in {{ results.timeToGoalMonths }} months</Message>

      <ChartSection title="Projection" :chartData="chartData" />
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

      <Message v-if="splitResults.isGoalReached" severity="success" :closable="false">Goal reachable!</Message>
      <Message v-else-if="splitResults.timeToGoalMonths > 120" severity="warn" :closable="false">Goal unlikely within 10 years</Message>
      <Message v-else severity="info" :closable="false">Split goal in {{ splitResults.timeToGoalMonths }} months</Message>

      <ChartSection title="Split Projection" :chartData="splitChartData" />
    </div>

    <!-- COMPARE TAB -->
    <div v-if="activeTab === 'compare'" class="tab-panel">
      <p style="color:#666;margin-bottom:12px">Compare JEPI vs SCHD side by side.</p>
      <div class="etf-grid">
        <Card>
          <template #title><Tag value="JEPI" severity="info" /></template>
          <template #content>
            <div class="en">JPMorgan Equity Premium Income ETF</div>
            <div class="ed">High yield, monthly payouts</div>
            <div class="es"><span class="ek">Yield</span><span class="ev">8.26%</span></div>
            <div class="es"><span class="ek">Growth (est)</span><span class="ev">2.0%</span></div>
            <div class="es"><span class="ek">Expense Ratio</span><span class="ev">0.35%</span></div>
          </template>
        </Card>
        <Card>
          <template #title><Tag value="SCHD" severity="success" /></template>
          <template #content>
            <div class="en">Schwab US Dividend Equity ETF</div>
            <div class="ed">Dividend growth focus</div>
            <div class="es"><span class="ek">Yield</span><span class="ev">3.35%</span></div>
            <div class="es"><span class="ek">Growth (est)</span><span class="ev">7.0%</span></div>
            <div class="es"><span class="ek">Expense Ratio</span><span class="ev">0.06%</span></div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useCalculatorStore } from '@/stores/calculatorStore.js'
import Slider from '@/components/Slider.vue'
import MetricCard from '@/components/MetricCard.vue'
import ChartSection from '@/components/ChartSection.vue'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Tag from 'primevue/tag'
import Message from 'primevue/message'

const store = useCalculatorStore()
const activeTab = ref('single')
const singleEtf = ref('JEPI')

const inputs = computed(() => store.inputs)
const results = computed(() => store.results)

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

const chartData = ref({ labels: [], datasets: [] })
const splitChartData = ref({ labels: [], datasets: [] })

watch(singleEtf, (val) => {
  store.setEtf(val)
})

watch(inputs, () => {
  store.calculate()
}, { deep: true })

watch(splitInputs, (v) => {
  store.setEtf('SPLIT')
  store.inputs.startAmount = v.startAmount
  store.inputs.monthlyTopUp = v.monthlyTopUp
  store.inputs.targetMonthlyIncome = v.targetMonthlyIncome
  store.inputs.withholdingTax = v.withholdingTax
  store.inputs.splitAllocationRatio = v.splitAllocationRatio
  store.calculate()
  splitResults.value.currentNetDiv = store.results.currentNetDiv
  splitResults.value.timeToGoalMonths = store.results.timeToGoalMonths
  splitResults.value.portfolioValueAtGoal = store.results.portfolioValueAtGoal
  splitResults.value.isGoalReached = store.results.isGoalReached
}, { deep: true })

store.setEtf('JEPI')
store.calculate()
</script>

<style>
.tabs { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; }
.tab-panel { margin-top: 1rem; }
.etf-switcher { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
.cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin: 1.5rem 0; }
.etf-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.en { font-weight: 600; margin-bottom: 0.25rem; }
.ed { font-size: 0.85rem; color: #666; margin-bottom: 1rem; }
.es { display: flex; justify-content: space-between; padding: 0.25rem 0; border-bottom: 1px solid #eee; }
.ek { color: #666; }
.ev { font-weight: 500; }
</style>