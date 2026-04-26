/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      colors: {
        green: {
          brand: '#00C060',
          light: '#E6F9F0',
          glow: 'rgba(0,192,96,0.25)',
        },
        warm: {
          50:  '#FAF8F5',
          100: '#F5F1EB',
          200: '#EDE8DF',
          300: '#DDD6C8',
          400: '#B8AFA0',
          500: '#8C8070',
        },
        ink: {
          DEFAULT: '#1A1612',
          muted: '#5A5248',
          faint: '#9B9188',
        },
        night: {
          900: '#080C14',
          800: '#0E1420',
          700: '#141C2C',
          600: '#1A2336',
        }
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        'card-light': '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 20px rgba(0,0,0,0.1)',
        'green-glow': '0 0 24px rgba(0,192,96,0.3)',
        'sheet': '0 -8px 40px rgba(0,0,0,0.15)',
      },
      animation: {
        'fade-up': 'fadeUp 0.4s ease both',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.32,0.72,0,1) both',
        'slide-down': 'slideDown 0.3s ease both',
        'success-pop': 'successPop 0.5s cubic-bezier(0.175,0.885,0.32,1.275) both',
        'spin-slow': 'spin 1s linear infinite',
        'pulse-dot': 'pulseDot 1.5s ease infinite',
        'ticker': 'ticker 3s ease infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          from: { transform: 'translateY(100%)' },
          to:   { transform: 'translateY(0)' },
        },
        slideDown: {
          from: { transform: 'translateY(0)' },
          to:   { transform: 'translateY(100%)' },
        },
        successPop: {
          '0%':   { transform: 'scale(0) rotate(-15deg)', opacity: '0' },
          '60%':  { transform: 'scale(1.15) rotate(3deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(0deg)' },
        },
        pulseDot: {
          '0%,100%': { opacity: '1' },
          '50%':     { opacity: '0.3' },
        },
        glowPulse: {
          '0%,100%': { boxShadow: '0 0 20px rgba(0,192,96,0.3)' },
          '50%':     { boxShadow: '0 0 40px rgba(0,192,96,0.5)' },
        },
      },
    },
  },
  plugins: [],
}
