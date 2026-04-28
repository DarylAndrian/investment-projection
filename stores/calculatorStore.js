import { defineStore } from 'pinia';

// Financial constants for ETFs
const ETF = {
  JEPI: { yield: 0.0826, growth: 0.02, er: 0.0035, freq: 12, label: 'JEPI', color: '#E8630A' },
  SCHD: { yield: 0.0335, growth: 0.07, er: 0.0006, freq: 4, label: 'SCHD', color: '#2E8B57' }
};

/**
 * Calculates the monthly dividend payout based on current assets and ETF specifics.
 * Deducts expense ratio before dividend calculation.
 */
function calculateDividend(balance, monthlyTopUp, etf, taxRate) {
  const annualDiv = (balance + monthlyTopUp) * etf.yield;
  const monthlyDiv = annualDiv / 12;
  const afterExpense = monthlyDiv * (1 - etf.er);
  const netDiv = afterExpense * (1 - taxRate / 100);
  return Math.max(0, netDiv);
}

/**
 * Runs monthly simulation, returns results + chart data (labels + values over months).
 * Compounds monthly, deducts expense ratio + fees.
 */
function runSimulation(allocations, targetMonthlyIncome, taxRate) {
  const MAX_MONTHS = 300; // 25 years
  let month = 0;
  const labels = [];
  const values = [];
  const dividends = [];
  let totalFees = 0;

  for (month = 1; month <= MAX_MONTHS; month++) {
    // Calculate total dividend across all allocations
    let totalDiv = 0;
    for (const alloc of allocations) {
      totalDiv += calculateDividend(alloc.balance, alloc.monthlyTopUp, alloc.etf, taxRate);
    }

    // Record portfolio value and dividend for chart
    const totalBalance = allocations.reduce((sum, a) => sum + a.balance, 0);
    labels.push(`Month ${month}`);
    values.push(parseFloat(totalBalance.toFixed(2)));
    dividends.push(parseFloat(totalDiv.toFixed(2)));

    // Check goal
    if (month > 1 && totalDiv >= targetMonthlyIncome) {
      return {
        months: month,
        portfolioValue: totalBalance,
        reached: true,
        chartLabels: labels,
        chartValues: values,
        chartDividends: dividends,
        totalFees
      };
    }

    // Compound each allocation (monthly growth - expense ratio)
    for (const alloc of allocations) {
      const monthlyGrowth = alloc.etf.growth / 12;
      const monthlyFee = alloc.balance * (alloc.etf.er / 12);
      totalFees += monthlyFee;
      alloc.balance = alloc.balance * (1 + monthlyGrowth) - monthlyFee + alloc.monthlyTopUp;
    }
  }

  const finalBalance = allocations.reduce((sum, a) => sum + a.balance, 0);
  return {
    months: MAX_MONTHS,
    portfolioValue: finalBalance,
    reached: false,
    chartLabels: labels,
    chartValues: values,
    chartDividends: dividends,
    totalFees
  };
}

export const useCalculatorStore = defineStore('calculator', {
  state: () => ({
    selectedEtf: 'JEPI',
    inputs: {
      startAmount: 2000,
      monthlyTopUp: 100,
      targetMonthlyIncome: 30,
      withholdingTax: 30,
      splitAllocationRatio: 60
    },
    results: {
      currentNetDiv: null,
      timeToGoalMonths: null,
      portfolioValueAtGoal: null,
      isGoalReached: false,
      metrics: {},
      chartLabels: [],
      chartValues: [],
      chartDividends: []
    }
  }),
  getters: {
    currentMetrics: (state) => state.results
  },
  actions: {
    setEtf(etfKey) {
      this.selectedEtf = etfKey;
      this.calculate();
    },
    updateInput(key, value) {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        this.inputs[key] = numValue;
      }
      this.calculate();
    },
    calculate() {
      const { startAmount: start, monthlyTopUp: monthly, targetMonthlyIncome: target, withholdingTax: tax, splitAllocationRatio: splitRatio } = this.inputs;

      let netDivResult = null;
      let goalMonths = null;
      let finalValue = null;
      let isReached = false;
      let etfDetails = {};
      let chartLabels = [];
      let chartValues = [];
      let chartDividends = [];
      let totalFees = 0;

      if (this.selectedEtf === 'JEPI' || this.selectedEtf === 'SCHD') {
        const etf = ETF[this.selectedEtf];

        netDivResult = calculateDividend(start, monthly, etf, tax);
        etfDetails = { name: etf.label, color: etf.color };

        const simulation = runSimulation(
          [{ etf, balance: start, monthlyTopUp: monthly }],
          target,
          tax
        );

        goalMonths = simulation.months;
        finalValue = Math.floor(simulation.portfolioValue);
        isReached = simulation.reached;
        chartLabels = simulation.chartLabels;
        chartValues = simulation.chartValues;
        chartDividends = simulation.chartDividends;
        totalFees = simulation.totalFees;

      } else if (this.selectedEtf === 'SPLIT') {
        const jepiBalance = start * splitRatio / 100;
        const schdBalance = start - jepiBalance;
        const jepiMonthly = monthly * splitRatio / 100;
        const schdMonthly = monthly - jepiMonthly;

        netDivResult = calculateDividend(jepiBalance, jepiMonthly, ETF.JEPI, tax) +
                       calculateDividend(schdBalance, schdMonthly, ETF.SCHD, tax);

        etfDetails = [
          { name: ETF.JEPI.label, color: ETF.JEPI.color, weight: splitRatio },
          { name: ETF.SCHD.label, color: ETF.SCHD.color, weight: 100 - splitRatio }
        ];

        const simulation = runSimulation(
          [
            { etf: ETF.JEPI, balance: jepiBalance, monthlyTopUp: jepiMonthly },
            { etf: ETF.SCHD, balance: schdBalance, monthlyTopUp: schdMonthly }
          ],
          target,
          tax
        );

        goalMonths = simulation.months;
        finalValue = Math.floor(simulation.portfolioValue);
        isReached = simulation.reached;
        chartLabels = simulation.chartLabels;
        chartValues = simulation.chartValues;
        chartDividends = simulation.chartDividends;
        totalFees = simulation.totalFees;
      }

      this.results.currentNetDiv = netDivResult;
      this.results.timeToGoalMonths = goalMonths;
      this.results.portfolioValueAtGoal = finalValue;
      this.results.isGoalReached = isReached;
      this.results.metrics = { etfDetails, totalFees };
      this.results.chartLabels = chartLabels;
      this.results.chartValues = chartValues;
      this.results.chartDividends = chartDividends;

      // Persist inputs to localStorage
      localStorage.setItem('investment-inputs', JSON.stringify(this.inputs));
    }
  }
});
