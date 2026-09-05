/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#071426',
          card: '#0D1B2E',
          hover: '#14243B',
          alt: '#0A172A',
        },
        brand: {
          primary: '#2D8CFF',
          accent: '#35D9E8',
          success: '#43E6D5',
          glow: 'rgba(53, 217, 232, 0.15)',
        },
        border: {
          subtle: '#1E314B',
          active: '#2D8CFF',
        },
        text: {
          primary: '#FFFFFF',
          muted: '#AAB8C8',
          dim: '#627D98',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'card': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glow-primary': '0 0 20px rgba(45, 140, 255, 0.35)',
        'glow-accent': '0 0 20px rgba(53, 217, 232, 0.35)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
      }
    },
  },
  plugins: [],
}
