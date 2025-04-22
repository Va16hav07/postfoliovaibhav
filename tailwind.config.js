/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // New modern color palette
        neon: {
          blue: '#00f3ff',
          pink: '#ff00e5',
          green: '#00ff9d',
        },
        cyber: {
          purple: '#6b00ff',
          dark: '#0a0a1f',
        },
        lavender: '#e6e6fa',
        gold: '#ffd700',
        dark: {
          DEFAULT: '#121212',
          light: '#1e1e1e',
          surface: '#2a2a2a',
        },
        light: {
          DEFAULT: '#f8fafc',
          dark: '#e2e8f0',
        },
      },
      animation: {
        'float-rotate': 'float-rotate 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
        'cyber-glitch': 'cyber-glitch 3s infinite linear alternate-reverse',
        'aurora-wave': 'aurora-wave 15s ease infinite',
        'matrix-rain': 'matrix-rain 20s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'slide-up': 'slide-up 0.7s ease-out',
      },
      keyframes: {
        'float-rotate': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(5deg)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: 1, boxShadow: '0 0 20px rgba(0, 243, 255, 0.7)' },
          '50%': { opacity: 0.7, boxShadow: '0 0 30px rgba(255, 0, 229, 0.9)' },
        },
        'shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      },
      backgroundImage: {
        'circuit-pattern': 'linear-gradient(90deg, rgba(107, 0, 255, 0.1) 1px, transparent 1px), linear-gradient(0deg, rgba(0, 243, 255, 0.1) 1px, transparent 1px)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'cyber-grid': 'linear-gradient(to right, rgba(0, 243, 255, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 0, 229, 0.1) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
}