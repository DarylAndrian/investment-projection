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
        <Button :class="{ 'p-button-outlined': singleEtf !== 'JEPI' }" label="JEPI" @click="setEtf('JEPI')" />
        <Button :class="{ 'p-button-outlined': singleEtf !== 'SCHD' }" label="SCHD" @click="setEtf('SCHD')" />
      </div>

      <div class="control-row">
        <label>Starting investment (USD)</label>
        <InputNumber v-model="inputs.startAmount" :min="0" :max="20000" :step="100" prefix="$" />
      </div>
      <div class="control-row">
        <label>Monthly top-up (USD)</label>
        <InputNumber v-model="inputs.monthlyTopUp" :min="0" :max="1000" :step="10" prefix="$" suffix="/mo" />
      </div>
      <div class="control-row">
        <label>Target monthly income (after tax)</label>
        <InputNumber v-model="inputs.targetMonthlyIncome" :min="5" :max="200" :step="5" prefix="$" suffix="/mo" />
      </div>
      <div class="control-row">
        <label>Withholding tax</label>
        <InputNumber v-model="inputs.withholdingTax" :min="0" :max="30" :step="5" suffix="%" />
      </div>

      <!-- Results Cards -->
      <div class="cards">
        <Card>
          <template #title>Net Monthly Dividend</template>
          <template #content>
            <div class="card-value">${{ results.currentNetDiv?.toFixed(2) || '--' }}</div>
          </template>
        </Card>
        <Card>
          <template #title>Months to Goal</template>
          <template #content>
            <div class="card-value">{{ results.timeToGoalMonths || '--' }}</div>
          </template>
        </Card>
        <Card>
          <template #title>Portfolio at Goal</template>
          <template #content>
            <div class="card-value">${{ results.portfolioValueAtGoal?.toLocaleString() || '--' }}</div>
          </template>
        </Card>
      </div>

      <!-- Goal Message -->
      <Message v-if="results.isGoalReached" severity="success" :closable="false">Goal reachable!</Message>
      <Message v-else-if="results.timeToGoalMonths > 120" severity="warn" :closable="false">Goal unlikely within 10 years</Message>
      <Message v-else severity="info" :closable="false">Goal in {{ results.timeToGoalMonths }} months</Message>

      <ChartSection title="Projection" :chartData="singleChartData" />
    </div>

    <!-- SPLIT TAB -->
    <div v-if="activeTab === 'split'" class="tab-panel">
      <div class="control-row">
        <label>Starting investment (USD)</label>
        <InputNumber v-model="splitInputs.startAmount" :min="0" :max="20000" :step="100" prefix="$" />
      </div>
      <div class="control-row">
        <label>Monthly top-up (USD)</label>
        <InputNumber v-model="splitInputs.monthlyTopUp" :min="0" :max="1000" :step="10" prefix="$" suffix="/mo" />
      </div>
      <div class="control-row">
        <label>JEPI allocation</label>
        <InputNumber v-model="splitInputs.splitAllocationRatio" :min="10" :max="90" :step="5" suffix="%" />
      </div>
      <div class="control-row">
        <label>Target monthly income (after tax)</label>
        <InputNumber v-model="splitInputs.targetMonthlyIncome" :min="5" :max="200" :step="5" prefix="$" suffix="/mo" />
      </div>
      <div class="control-row">
        <label>Withholding tax</label>
        <InputNumber v-model="splitInputs.withholdingTax" :min="0" :max="30" :step="5" suffix="%" />
      </div>

      <div class="cards">
        <Card>
          <template #title>Net Monthly Dividend</template>
          <template #content>
            <div class="card-value">${{ splitResults.currentNetDiv?.toFixed(2) || '--' }}</div>
          </template>
        </Card>
        <Card>
          <template #title>Months to Goal</template>
          <template #content>
            <div class="card-value">{{ splitResults.timeToGoalMonths || '--' }}</div>
          </template>
        </Card>
        <Card>
          <template #title>Portfolio at Goal</template>
          <template #content>
            <div class="card-value">${{ splitResults.portfolioValueAtGoal?.toLocaleString() || '--' }}</div>
          </template>
        </Card>
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
import ChartSection from '@/components/ChartSection.vue'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Tag from 'primevue/tag'
import Message from 'primevue/message'
import InputNumber from 'primevue/inputnumber'

const store = useCalculatorStore()
const activeTab = ref('single')
const singleEtf = ref('JEPI')

const inputs = computed(() => store.inputs)
const results = computed(() => store.results)

// Chart data for single ETF
const singleChartData = computed(() => ({
  labels: results.value.chartLabels || [],
  datasets: [
    {
      label: 'Portfolio Value',
      data: results.value.chartValues || [],
      borderColor: '#378ADD',
      backgroundColor: 'rgba(55,138,221,0.1)',
      fill: true
    }
  ]
}))

// Split inputs
const splitInputs = ref({
  startAmount: 2000,
  monthlyTopUp: 100,
  targetMonthlyIncome: 30,
  withholdingTax: 30,
  splitAllocationRatio: 60
})

// Split results (local copy)
const splitResults = ref({
  currentNetDiv: null,
  timeToGoalMonths: null,
  portfolioValueAtGoal: null,
  isGoalReached: false
})

// Split chart data
const splitChartData = computed(() => ({
  labels: results.value.chartLabels || [],
  datasets: [
    {
      label: 'Portfolio Value (Split)',
      data: results.value.chartValues || [],
      borderColor: '#639922',
      backgroundColor: 'rgba(99,153,34,0.1)',
      fill: true
    }
  ]
}))

// Set ETF and sync
function setEtf(etf) {
  singleEtf.value = etf
  store.setEtf(etf)
}

// Watch inputs and recalc
watch(inputs, () => {
  store.calculate()
}, { deep: true })

// Watch split inputs
watch(splitInputs, (v) => {
  store.setEtf('SPLIT')
  store.inputs.startAmount = v.startAmount
  store.inputs.monthlyTopUp = v.monthlyTopUp
  store.inputs.targetMonthlyIncome = v.targetMonthlyIncome
  store.inputs.withholdingTax = v.withholdingTax
  store.inputs.splitAllocationRatio = v.splitAllocationRatio
  store.calculate()
  splitResults.value = {
    currentNetDiv: store.results.currentNetDiv,
    timeToGoalMonths: store.results.timeToGoalMonths,
    portfolioValueAtGoal: store.results.portfolioValueAtGoal,
    isGoalReached: store.results.isGoalReached
  }
}, { deep: true })

// Initialize
store.setEtf('JEPI')
store.calculate()
</script>

<style>
.app { max-width: 800px; margin: 0 auto; padding: 20px; }
.tabs { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; }
.tab-panel { margin-top: 1rem; }
.etf-switcher { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
.control-row { margin-bottom: 1.5rem; }
.control-row label { display: block; font-size: 0.85rem; color: #666; margin-bottom: 0.25rem; }
.cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin: 1.5rem 0; }
.card-value { font-size: 1.5rem; font-weight: 600; margin-top: 0.5rem; }
.etf-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.en { font-weight: 600; margin-bottom: 0.25rem; }
.ed { font-size: 0.85rem; color: #666; margin-bottom: 1rem; }
.es { display: flex; justify-content: space-between; padding: 0.25rem 0; border-bottom: 1px solid #eee; }
.ek { color: #666; }
.ev { font-weight: 500; }
</style>
