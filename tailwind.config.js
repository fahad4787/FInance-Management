/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        surface: {
          DEFAULT: '#f8fafc',
          card: '#ffffff',
          elevated: '#ffffff',
        },
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
        'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.06)',
        'elevated': '0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05), 0 0 0 1px rgb(0 0 0 / 0.04)',
        'panel': '0 10px 25px -5px rgb(0 0 0 / 0.08), 0 4px 10px -4px rgb(0 0 0 / 0.04), 0 0 0 1px rgb(16 185 129 / 0.08)',
        'modal': '0 25px 50px -12px rgb(0 0 0 / 0.2), 0 0 0 1px rgb(0 0 0 / 0.05), 0 0 0 3px rgb(16 185 129 / 0.15)',
        'glow': '0 0 0 1px rgb(16 185 129 / 0.1), 0 4px 14px -2px rgb(16 185 129 / 0.25)',
      },
    },
  },
  plugins: [],
}
