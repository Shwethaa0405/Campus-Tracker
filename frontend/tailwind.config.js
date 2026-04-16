/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        display: ['"Source Serif 4"', 'Georgia', 'serif'],
      },
      colors: {
        primary: {
          50: '#eefcf9',
          100: '#d7f5ef',
          200: '#afe8dd',
          300: '#7fd6c8',
          400: '#47bfaf',
          500: '#1f9f92',
          600: '#157f75',
          700: '#12665e',
          800: '#114f49',
          900: '#103f3a',
        },
        accent: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#dbe4ee',
          300: '#c2d0dd',
          400: '#8fa2b3',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1f2937',
          900: '#0f172a',
        },
        neutral: {
          50: '#fcfcfd',
          100: '#f5f7fa',
          200: '#e8edf2',
          300: '#d5dde6',
          400: '#95a3b3',
          500: '#66758a',
          600: '#4b596b',
          700: '#334155',
          800: '#1f2937',
          900: '#0f172a',
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.6s ease-in-out',
        slideUp: 'slideUp 0.6s ease-out',
        slideDown: 'slideDown 0.6s ease-out',
        shimmer: 'shimmer 2s infinite',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shimmer: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
    },
  },
  plugins: [],
}
