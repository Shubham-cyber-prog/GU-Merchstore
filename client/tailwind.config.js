/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'rgb(var(--bg) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        primary: 'rgb(var(--primary) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        text: 'rgb(var(--text) / <alpha-value>)',
        'text-secondary': 'rgb(var(--text-secondary) / <alpha-value>)',
        border: 'rgb(var(--border) / <alpha-value>)',
        success: 'rgb(var(--success) / <alpha-value>)',
        warning: 'rgb(var(--warning) / <alpha-value>)',
        error: 'rgb(var(--error) / <alpha-value>)',
        brand: {
          maroon: {
            50: 'rgb(var(--brand-maroon-50) / <alpha-value>)',
            100: 'rgb(var(--brand-maroon-100) / <alpha-value>)',
            150: 'rgb(var(--brand-maroon-150) / <alpha-value>)',
            200: 'rgb(var(--brand-maroon-200) / <alpha-value>)',
            300: 'rgb(var(--brand-maroon-300) / <alpha-value>)',
            400: 'rgb(var(--brand-maroon-400) / <alpha-value>)',
            500: 'rgb(var(--brand-maroon-500) / <alpha-value>)',
            600: 'rgb(var(--brand-maroon-600) / <alpha-value>)',
            700: 'rgb(var(--brand-maroon-700) / <alpha-value>)',
            800: 'rgb(var(--brand-maroon-800) / <alpha-value>)',
            850: 'rgb(var(--brand-maroon-850) / <alpha-value>)',
            900: 'rgb(var(--brand-maroon-900) / <alpha-value>)',
            950: 'rgb(var(--brand-maroon-950) / <alpha-value>)',
          },
          gold: {
            50: 'rgb(var(--brand-gold-50) / <alpha-value>)',
            100: 'rgb(var(--brand-gold-100) / <alpha-value>)',
            200: 'rgb(var(--brand-gold-200) / <alpha-value>)',
            250: 'rgb(var(--brand-gold-250) / <alpha-value>)',
            300: 'rgb(var(--brand-gold-300) / <alpha-value>)',
            400: 'rgb(var(--brand-gold-400) / <alpha-value>)',
            500: 'rgb(var(--brand-gold-500) / <alpha-value>)',
            600: 'rgb(var(--brand-gold-600) / <alpha-value>)',
            700: 'rgb(var(--brand-gold-700) / <alpha-value>)',
            800: 'rgb(var(--brand-gold-800) / <alpha-value>)',
            900: 'rgb(var(--brand-gold-900) / <alpha-value>)',
            950: 'rgb(var(--brand-gold-950) / <alpha-value>)',
          },
          dark: {
            50: 'rgb(var(--bg) / <alpha-value>)',
            100: 'rgb(var(--surface) / <alpha-value>)',
            200: 'rgb(var(--border) / <alpha-value>)',
            250: 'rgb(var(--border) / <alpha-value>)',
            300: 'rgb(var(--border) / <alpha-value>)',
            350: 'rgb(var(--text-secondary) / <alpha-value>)',
            400: 'rgb(var(--text-secondary) / <alpha-value>)',
            450: 'rgb(var(--text-secondary) / <alpha-value>)',
            500: 'rgb(var(--text-secondary) / <alpha-value>)',
            550: 'rgb(var(--text-secondary) / <alpha-value>)',
            600: 'rgb(var(--text) / <alpha-value>)',
            700: 'rgb(var(--text) / <alpha-value>)',
            800: 'rgb(var(--text) / <alpha-value>)',
            900: 'rgb(var(--text) / <alpha-value>)',
            950: 'rgb(var(--bg) / <alpha-value>)',
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      fontSize: {
        'xxs': ['0.65rem', { lineHeight: '1rem' }],
        'xs.5': ['0.8125rem', { lineHeight: '1.25rem' }],
      },
      spacing: {
        '4.5': '1.125rem',
        '5.5': '1.375rem',
        '6.5': '1.625rem',
        '13': '3.25rem',
        '18': '4.5rem',
      },
      boxShadow: {
        'premium': '0 12px 40px -10px rgba(0, 0, 0, 0.04)',
        'premium-hover': '0 24px 50px -12px rgba(0, 0, 0, 0.12)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.02)',
        'glass-hover': '0 16px 40px 0 rgba(0, 0, 0, 0.04)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
        'scaleIn': 'scaleIn 0.15s ease-out',
        'fadeIn': 'fadeIn 0.2s ease-out',
        'slideUp': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(138, 23, 58, 0.4)' },
          '50%': { boxShadow: '0 0 20px 4px rgba(138, 23, 58, 0.1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      }
    },
  },
  plugins: [],
}
