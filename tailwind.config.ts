import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.{md,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-body)', 'DM Sans', 'system-ui', 'sans-serif'],
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
      },
      colors: {
        brand: {
          yellow: '#F5CF49',
          gold: '#f2c833',
          black: '#000000',
        },
        navy: {
          DEFAULT: '#0A1628',
          light: '#1A2B4A',
          mid: '#132038',
        },
        cream: {
          DEFAULT: '#FAF7F2',
          dark: '#F2EDE4',
        },
      },
      maxWidth: {
        content: '1200px',
      },
      borderRadius: {
        pill: '9999px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
export default config
