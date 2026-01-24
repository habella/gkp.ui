/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        // Paleta principal - Azul corporativo (energía, tecnología)
        primary: {
          50: '#e6f4ff',
          100: '#bae3ff',
          200: '#7ccdff',
          300: '#36b3ff',
          400: '#0095eb',
          500: '#007ed1',  // Color principal
          600: '#0066ab',
          700: '#004f87',
          800: '#003a65',
          900: '#002744',
          950: '#001a2e',
        },
        // Secundario - Verde energía (sostenibilidad, naturaleza)
        energy: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',  // Color principal verde
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        // Acento - Naranja/Ámbar (alertas, destacados)
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        // Peligro - Rojo corporativo
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#fe3940',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },
        // Superficie - Grises neutros
        surface: {
          50: '#fafbfc',
          100: '#f4f6f8',
          200: '#e9ecef',
          300: '#dee2e6',
          400: '#ced4da',
          500: '#adb5bd',
          600: '#6c757d',
          700: '#495057',
          800: '#343a40',
          900: '#212529',
          950: '#0d1117',
        },
      },
      fontFamily: {
        sans: ['Satoshi', 'Inter', 'Segoe UI', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Satoshi', 'Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)',
        'card-hover': '0 10px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        'card-dark': '0 4px 20px 0 rgb(0 0 0 / 0.25)',
        'sidebar': '4px 0 20px -2px rgb(0 0 0 / 0.15)',
        'dropdown': '0 20px 50px -12px rgb(0 0 0 / 0.25)',
        'glow-primary': '0 0 30px rgb(0 126 209 / 0.4)',
        'glow-energy': '0 0 30px rgb(16 185 129 / 0.4)',
        'glow-accent': '0 0 30px rgb(245 158 11 / 0.4)',
        'inner-soft': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #007ed1 0%, #0095eb 50%, #36b3ff 100%)',
        'gradient-energy': 'linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)',
        'gradient-dark': 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        'gradient-sidebar': 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
        'gradient-card': 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)',
        'gradient-glow': 'radial-gradient(ellipse at center, rgba(0, 126, 209, 0.15) 0%, transparent 70%)',
        'mesh-pattern': 'radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(0, 126, 209, 0.05) 0%, transparent 50%)',
        'dots-pattern': 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      borderRadius: {
        'xl': '0.875rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}

