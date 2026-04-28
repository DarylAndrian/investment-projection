/**
 * Investment Projection — PrimeVue 4 Theme Config
 * Uses PassThrough to apply our design tokens globally
 */
export const InvestmentPassThrough = {
  button: {
    root: ({ props }) => ({
      style: {
        borderRadius: 'var(--radius-md)',
        fontSize: 'var(--text-sm)',
        fontFamily: 'var(--font-sans)',
        transition: 'all var(--duration-fast) var(--ease-in-out)'
      }
    })
  },
  card: {
    root: {
      style: {
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--border-light)',
        padding: 'var(--sp-5)'
      }
    },
    title: {
      style: {
        fontSize: 'var(--text-sm)',
        color: 'var(--text-secondary)',
        fontWeight: 'var(--font-medium)'
      }
    }
  },
  inputtext: {
    root: {
      style: {
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-light)',
        padding: '0.6rem 0.75rem',
        fontSize: 'var(--text-sm)',
        fontFamily: 'var(--font-mono)',
        background: 'var(--bg-input)',
        color: 'var(--text-primary)',
        transition: 'border-color var(--duration-fast), box-shadow var(--duration-fast)'
      }
    }
  },
  slider: {
    root: {
      style: {
        background: 'var(--gray-200)'
      }
    },
    range: {
      style: {
        background: 'var(--brand-500)'
      }
    },
    handle: {
      style: {
        borderColor: 'var(--brand-500)',
        background: 'var(--surface-1)',
        transition: 'transform var(--duration-fast) var(--ease-spring)'
      }
    }
  },
  message: {
    root: ({ props }) => ({
      style: {
        borderRadius: 'var(--radius-lg)',
        fontSize: 'var(--text-sm)',
        margin: 'var(--sp-4) 0'
      }
    })
  },
  tag: {
    root: {
      style: {
        borderRadius: 'var(--radius-sm)',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--font-semibold)'
      }
    }
  }
}

export default InvestmentPassThrough
