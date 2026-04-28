import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import { InvestmentPassThrough } from './themes/investment-preset.js'
import App from './App.vue'

// Global styles (tokens FIRST, then component styles)
// NOTE: tokens.css is now loaded via index.html (as a raw CSS link)
// to avoid Vue scoped CSS issues with :root and .dark selectors
import './assets/styles.css'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      prefix: 'p',
      darkModeSelector: '.dark',
      cssLayer: false
    }
  },
  // Apply our design tokens via PassThrough
  pt: InvestmentPassThrough
})

app.mount('#app')
