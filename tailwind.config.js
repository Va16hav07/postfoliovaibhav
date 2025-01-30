/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'neon-blue': '#00f3ff',
        'neon-pink': '#ff00e5',
        'cyber-purple': '#6b00ff',
        'deep-space': '#0a0a1f',
        'aurora-green': '#00ff9d',
        'lavender': '#e6e6fa',
        'gold': '#ffd700',
        'royal-light': '#9370db',
        'royal-dark': '#4b0082',
      },
      animation: {
        'float-rotate': 'float-rotate 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
        'cyber-glitch': 'cyber-glitch 3s infinite linear alternate-reverse',
        'aurora-wave': 'aurora-wave 15s ease infinite',
        'matrix-rain': 'matrix-rain 20s linear infinite',
      },
      backgroundImage: {
        'circuit-pattern': 'linear-gradient(90deg, rgba(107, 0, 255, 0.1) 1px, transparent 1px), linear-gradient(0deg, rgba(0, 243, 255, 0.1) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
};