/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        adobe: {
          bg: '#1e1e1e',
          surface: '#2d2d2d',
          'surface-light': '#3d3d3d',
          accent: '#ff0050',
          'accent-hover': '#ff3370',
          text: '#f0f0f0',
          'text-secondary': '#a0a0a0',
          border: '#404040',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'adobe': '0 4px 16px rgba(0, 0, 0, 0.3)',
        'adobe-lg': '0 8px 32px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
}

