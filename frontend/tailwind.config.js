/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      },
      colors: {
        'app-bg': '#F0F2FF',
        'sidebar-bg': '#0D0F2B',
        'sidebar-mid': '#1A1040',
        'primary': '#2563EB',
        'primary-dark': '#1D4ED8',
        'secondary': '#7C3AED',
        'secondary-dark': '#6D28D9',
        'accent': '#059669',
        'accent-light': '#10B981',
        'main-text': '#0F172A',
        'sub-text': '#64748B',
        'border-col': '#CBD5E1',
        'card-bg': '#FFFFFF',
        'danger': '#DC2626',
        'warning': '#D97706',
        'success': '#059669',
        'soft-red': '#FEE2E2',
        'hover-bg': '#EEF2FF',
        // keep old names for backward compat with charts
        'main-bg': '#F0F2FF',
        'primary-text': '#0F172A',
        'secondary-text': '#64748B',
        'border-color': '#CBD5E1',
        'hover-highlight': '#EEF2FF',
        'soft-olive': '#059669',
        'soft-blue': '#BFDBFE',
        'soft-yellow': '#FDE68A',
        'soft-pink': '#E9D5FF',
        'sidebar-bg-old': '#0D0F2B',
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
        'gradient-sidebar': 'linear-gradient(180deg, #0D0F2B 0%, #1A1040 100%)',
        'gradient-accent': 'linear-gradient(135deg, #059669 0%, #2563EB 100%)',
        'gradient-card-top': 'linear-gradient(90deg, #2563EB, #7C3AED)',
      },
      boxShadow: {
        'sharp': '4px 4px 0px #CBD5E1',
        'sharp-primary': '4px 4px 0px #2563EB',
        'sharp-secondary': '4px 4px 0px #7C3AED',
        'sharp-accent': '4px 4px 0px #059669',
        'card': '0 1px 4px rgba(0,0,0,0.08)',
        'card-hover': '0 4px 16px rgba(37,99,235,0.12)',
      }
    }
  },
  plugins: []
}
