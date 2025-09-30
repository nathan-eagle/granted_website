import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.{md,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: '#F5CF49',
          black: '#000000',
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
  plugins: [],
}
export default config
