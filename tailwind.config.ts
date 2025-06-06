import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fontFamily: {
        'oswald': ['Oswald', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

module.exports = {
  ...config,
  theme: {
    extend: {
      ...config.theme?.extend,
    },
  },
  plugins: [],
  // Add custom utilities
  corePlugins: {
    transform: true,
  },
  variants: {
    extend: {
      transform: ['hover', 'focus'],
    },
  },
} 