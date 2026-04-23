/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00435a',
          light: '#005c7a',
          dark: '#003544',
        },
        secondary: '#4a626d',
        tertiary: '#004545',
        surface: {
          DEFAULT: '#f8f9fc',
          container: '#eceef1',
          'container-low': '#f2f4f6',
          'container-high': '#e6e8eb',
        },
        outline: {
          DEFAULT: '#70787e',
          variant: '#bfc8ce',
        },
        error: '#ba1a1a',
        success: '#16a34a',
        warning: '#ca8a04',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      },
      boxShadow: {
        'card': '0 4px 20px rgba(0, 30, 43, 0.04)',
        'card-hover': '0 8px 30px rgba(0, 30, 43, 0.08)',
      },
    },
  },
  plugins: [],
}
