/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Pure-white base, near-black ink
        canvas: '#ffffff',
        surface: '#ffffff',
        ink: '#18181b',
        // Cool, near-neutral greys (true neutral, not warm) for a crisp white feel
        grey: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e8e8ea',
          300: '#d6d6d9',
          400: '#a8a8ad',
          500: '#85858b',
          600: '#646469',
          700: '#3f3f45',
        },
        // Soft stage behind the playground / demos
        panel: '#f6f6f7',
        // One warm accent, reserved for interactive / active states
        accent: {
          DEFAULT: '#ff6b3d',
          soft: '#ff6b3d1a',
          ring: '#ff6b3d66',
        },
        good: '#2f9e6b',
        bad: '#d6453d',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'ui-serif', 'serif'],
        mono: ['"Geist Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(24,24,27,0.05), 0 6px 18px -10px rgba(24,24,27,0.12)',
        card: '0 1px 2px rgba(24,24,27,0.05), 0 1px 0 rgba(24,24,27,0.02), 0 12px 28px -12px rgba(24,24,27,0.16)',
        // Crisp, layered popup elevation: tight contact + soft ambient.
        pop: '0 0 0 1px rgba(24,24,27,0.04), 0 2px 4px rgba(24,24,27,0.06), 0 12px 24px -8px rgba(24,24,27,0.14), 0 28px 56px -20px rgba(24,24,27,0.26)',
        float:
          '0 2px 6px rgba(24,24,27,0.06), 0 18px 40px -16px rgba(24,24,27,0.22)',
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
        '3xl': '22px',
      },
      letterSpacing: {
        eyebrow: '0.14em',
      },
      maxWidth: {
        reading: '38rem',
      },
      keyframes: {
        caret: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
      },
      animation: {
        caret: 'caret 1.06s step-end infinite',
      },
    },
  },
  plugins: [],
}
