/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#2E7D32',      // Verde principal solicitado
          'primary-hover': '#256629',
          'primary-dark': '#1B5E20',
          light: '#E8F5E9',        // Verde claro solicitado
          'light-hover': '#C8E6C9',
          surface: '#FFFFFF',      // Branco
          background: '#F8FAFC',   // Cinza muito claro
          card: '#FFFFFF',
          border: '#E2E8F0',
          subtle: '#F1F5F9',
        }
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)',
        'elevated': '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.02)',
      }
    },
  },
  plugins: [],
}
