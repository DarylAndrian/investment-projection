# Refactor Summary — Investment Projection Design System

## What Changed

### 1. Design Tokens Layer
**New:** `public/tokens.css`
- Token-driven CSS architecture (brand, neutrals, semantic, surfaces, typography, spacing, borders, shadows, transitions)
- Dark mode variables under `.dark`
- Uses 4px base spacing scale, consistent naming

### 2. PrimeVue 4 Integration
**New:** `src/themes/investment-preset.js`
- PassThrough config maps design tokens to PrimeVue components
- Covers: Button, Card, InputText, Slider, Message, Tag
- No hardcoded colors — everything references `var(--token)`

### 3. Component Wrappers (Scalable)
**New components in `src/components/`:**
| Component | Purpose |
|-----------|----------|
| `ThemeToggle.vue` | Fixed-position dark/light toggle, reusable |
| `EtfSwitcher.vue` | ETF selector (JEPI/SCHD), emits v-model |
| `InputSliderRow.vue` | Label + InputNumber + Slider combo, single prop interface |
| `MetricCard.vue` | Reusable metric display with severity colors |
| `ChartSection.vue` | Chart wrapper with loading/empty states + slot for controls |

### 4. Refactored Files
| File | Change |
|------|--------|
| `src/main.js` | Imports tokens.css globally, applies PrimeVue + PassThrough |
| `src/App.vue` | Full rewrite — uses new components, cleaner template, scoped styles use tokens |
| `src/assets/styles.css` | Global resets + PrimeVue overrides using tokens |
| `pages/index.vue` | Deleted (logic merged into `App.vue`) |

### 5. Benefits
- **Scalable:** Add new components, they inherit token styles automatically
- **Sustainable:** Change `--brand-500` once → updates everywhere
- **Dark mode:** Toggled via `.dark` class + CSS vars (no JS theme switching needed)
- **PrimeVue native:** Uses PassThrough (PrimeVue 4's recommended approach)
- **Maintainable:** Component wrappers reduce duplication (e.g., `InputSliderRow` used 5+ times)

## File Structure (After)
```
investment-projection/
├── public/
│   ├── tokens.css          ← NEW: Design tokens
│   ├── theme.css          (exists, can be removed later)
│   └── favicon.svg
├── src/
│   ├── themes/
│   │   └── investment-preset.js   ← NEW: PrimeVue PassThrough config
│   ├── components/        ← NEW: Reusable wrappers
│   │   ├── ThemeToggle.vue
│   │   ├── EtfSwitcher.vue
│   │   ├── InputSliderRow.vue
│   │   ├── MetricCard.vue
│   │   └── ChartSection.vue
│   ├── assets/
│   │   └── styles.css     ← UPDATED: Uses tokens
│   ├── stores/
│   │   └── calculatorStore.js
│   ├── main.js            ← UPDATED: Imports tokens, applies PrimeVue config
│   └── App.vue            ← REWRITTEN: Uses new components
├── pages/
│   └── index.vue         ← DELETED (merged into App.vue)
└── package.json
```

## How to Extend
1. **Add a new color:** Define in `tokens.css` → use `var(--new-color)` in components
2. **Add a new PrimeVue component:** Add entry in `investment-preset.js` PassThrough
3. **Create a new page section:** Use existing wrappers (`MetricCard`, `InputSliderRow`) — they handle tokens automatically

## Build Status
✅ `npm run build` — passes (187 modules, 386KB JS, 12KB CSS)
