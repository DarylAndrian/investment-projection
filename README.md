# Investment Projection Calculator

Vue 3 + Vite investment projection app with dividend tracking and chart visualization.

## Features

- 📊 **Interactive Charts** — Portfolio value + dividend projections
- 💰 **Dividend Calculator** — Toggle dividend line on/off
- 📈 **Dual Axes** — Portfolio value (left) + Dividends (right)
- 🎨 **Color-Coded** — Portfolio blue, Dividends orange/red
- 📉 **Dashed Lines** — Dividend projections use dashed style

## Tech Stack

- **Vue 3** — Composition API
- **Vite** — Build tool & dev server
- **Chart.js** — Chart visualizations
- **Pinia** — State management
- **PrimeVue** — UI components

## Getting Started

### Prerequisites

- Node.js v18+

### Install & Run

```bash
npm install
npm run dev
```

Open http://localhost:5173

### Build

```bash
npm run build
```

Output in `dist/`.

## Project Structure

```
investment-projection/
├── src/
│   ├── components/      # Vue components
│   │   ├── InputControls.vue
│   │   ├── ChartComponent.vue
│   │   └── LineChart.vue
│   ├── stores/          # Pinia stores
│   │   └── calculatorStore.js
│   ├── pages/
│   ├── App.vue
│   └── main.js
├── api/                 # API integrations
├── public/
├── index.html
├── package.json
└── vite.config.js
```

## Also Includes

- `dividend_calculator_v3.html` — Standalone HTML calculator (no build required)

---

Built by Daryl Andrian
