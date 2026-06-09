import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1A4A6B',
        'primary-light': '#2C5F8A',
        accent: '#4A9EC4',
        'bg-soft': '#F0F6FB',
        'text-dark': '#1A1A2E',
        'text-mid': '#4A5568',
        'text-light': '#718096',
        border: '#E2EBF3',
        success: '#38A169',
      },
      fontFamily: {
        playfair: ['Playfair Display', 'serif'],
        source: ['Source Sans 3', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '8px',
        lg: '12px',
        xl: '16px',
      },
      boxShadow: {
        card: '0 2px 12px rgba(26, 74, 107, 0.08)',
        'card-hover': '0 8px 24px rgba(26, 74, 107, 0.14)',
      },
    },
  },
  plugins: [],
}

export default config
