import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'Archivo', 'sans-serif'],
        body: ['var(--font-body)', 'Figtree', 'sans-serif'],
        figtree: ['var(--font-body)', 'Figtree', 'sans-serif'],
        archivo: ['var(--font-display)', 'Archivo', 'sans-serif'],
      },
      borderRadius: {
        control: '9999px',
        card: '24px',
        container: '32px',
        hero: '40px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '32px',
        '3xl': '40px',
        pill: '9999px',
        full: '9999px',
      },
      colors: {
        saasable: {
          primary: '#606BDF',
          'primary-50': '#F0F2FE',
          'primary-100': '#E0E3FD',
          'primary-500': '#606BDF',
          'primary-600': '#4B55D4',
          dark: '#1E293B',
          surface: '#F8FAFC',
          border: '#E2E8F0',
        },
        ink: {
          DEFAULT: '#0F172A',
        },
        surface: {
          DEFAULT: '#F8FAFC',
          2: '#FFFFFF',
        },
        accent: {
          DEFAULT: '#606BDF',
          dim: '#E0E3FD',
          hover: '#4B55D4',
        },
        trust: {
          DEFAULT: '#334155',
        },
        success: {
          DEFAULT: '#16A34A',
        },
        danger: {
          DEFAULT: '#DC2626',
        },
        border: {
          DEFAULT: '#E2E8F0',
        },
        muted: {
          DEFAULT: '#64748B',
        },
        background: '#F8FAFC',
        foreground: '#0F172A',
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#0F172A',
        },
        popover: {
          DEFAULT: '#FFFFFF',
          foreground: '#0F172A',
        },
        primary: {
          DEFAULT: '#606BDF',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#F1F5F9',
          foreground: '#0F172A',
        },
        destructive: {
          DEFAULT: '#DC2626',
          foreground: '#FFFFFF',
        },
        ring: '#606BDF',
        input: '#E2E8F0',
      },
      boxShadow: {
        'level-0': 'none',
        'level-1': '0 1px 3px rgba(15, 23, 42, 0.05)',
        'level-2': '0 10px 30px -5px rgba(15, 23, 42, 0.08)',
        saasable: '0 20px 40px -15px rgba(96, 107, 223, 0.2)',
      },
      animation: {
        float: 'float 22s ease-in-out infinite',
        'ticker-scroll': 'ticker-scroll 40s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(40px, -50px) scale(1.08)' },
          '66%': { transform: 'translate(-30px, 30px) scale(0.94)' },
        },
        'ticker-scroll': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;
