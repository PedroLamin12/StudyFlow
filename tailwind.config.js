/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0F0F11',
        'dark-card': '#16161A',
        'neon-blue': '#00E5FF',
        'neon-purple': '#7B2CBF',
        'success': '#39D353',
        'warning': '#FFB703',
        'error': '#FF4A5A',
      },
      fontWeight: { 'extra-bold': 800 },
      boxShadow: {
        'neon-glow': '0 0 20px rgba(0, 229, 255, 0.3)',
        'neon-purple-glow': '0 0 20px rgba(123, 44, 191, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-in-out',
        'shake': 'shake 0.5s ease-in-out',
        'bounce-in': 'bounceIn 0.5s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(100%)' }, '100%': { transform: 'translateY(0)' } },
        shake: { '0%,100%': { transform: 'translateX(0)' }, '10%,30%,50%,70%,90%': { transform: 'translateX(-4px)' }, '20%,40%,60%,80%': { transform: 'translateX(4px)' } },
        bounceIn: { '0%': { transform: 'scale(0.3)', opacity: '0' }, '50%': { transform: 'scale(1.1)', opacity: '1' }, '70%': { transform: 'scale(0.95)' }, '100%': { transform: 'scale(1)' } },
      },
    },
  },
  plugins: [],
}
