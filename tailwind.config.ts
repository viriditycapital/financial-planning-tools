import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Source Sans Pro', 'system-ui', 'sans-serif'],
        mono: ['Anonymous Pro', 'ui-monospace', 'monospace'],
      },
      colors: {
        chart: {
          olive: 'rgb(85, 107, 47)',
          green: 'rgb(60, 179, 113)',
          gray: 'rgb(127, 127, 127)',
          'gray-light': 'rgb(200, 200, 200)',
        },
        brand: {
          primary: '#006400',
          'primary-hover': '#208420',
          nav: '#335533',
          'nav-hover': '#457545',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
