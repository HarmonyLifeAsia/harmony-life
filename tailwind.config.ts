import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Paleta wzorowana na harmony-life.vercel.app
        navy: {
          DEFAULT: '#1A1A2E',
          50: '#2A2A44',
          900: '#13131F',
          950: '#0E0E18',
        },
        gold: {
          DEFAULT: '#C9A876',
          light: '#DEC399',
          dark: '#A8884F',
        },
        cream: {
          DEFAULT: '#F5F0E8',
          dark: '#EAE2D4',
        },
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        container: '1200px',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'ken-burns': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.08)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fade-in 1.2s ease both',
        'ken-burns': 'ken-burns 18s ease-out both',
      },
    },
  },
  plugins: [],
};

export default config;
