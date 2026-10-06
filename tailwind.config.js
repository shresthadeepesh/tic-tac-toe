module.exports = {
  mode: 'jit',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '1.5rem'
    },
    extend: {
      colors: {
        // Not in tailwind 3.0's palette yet; the darkest base the glass sits on.
        slate: { 950: '#020617' }
      },
      keyframes: {
        'mark-in': {
          '0%': { opacity: '0', transform: 'scale(0.4)' },
          '60%': { opacity: '1', transform: 'scale(1.12)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        drift: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '50%': { transform: 'translate3d(4%, -6%, 0) scale(1.12)' }
        },
        shake: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '10%': { transform: 'translate3d(-10px, 4px, 0) rotate(-0.8deg)' },
          '25%': { transform: 'translate3d(9px, -5px, 0) rotate(0.7deg)' },
          '40%': { transform: 'translate3d(-7px, 3px, 0) rotate(-0.5deg)' },
          '55%': { transform: 'translate3d(5px, -2px, 0) rotate(0.4deg)' },
          '70%': { transform: 'translate3d(-3px, 1px, 0) rotate(-0.2deg)' },
          '85%': { transform: 'translate3d(2px, 0, 0)' }
        },
        nudge: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '20%': { transform: 'translate3d(-6px, 0, 0)' },
          '40%': { transform: 'translate3d(6px, 0, 0)' },
          '60%': { transform: 'translate3d(-3px, 0, 0)' },
          '80%': { transform: 'translate3d(3px, 0, 0)' }
        },
        'win-pulse': {
          '0%, 100%': { transform: 'scale(1)', filter: 'brightness(1)' },
          '50%': { transform: 'scale(1.06)', filter: 'brightness(1.5)' }
        },
        'flash-up': {
          '0%': { opacity: '0', transform: 'translateY(6px) scale(0.96)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' }
        }
      },
      animation: {
        'mark-in': 'mark-in 260ms cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'fade-up': 'fade-up 320ms ease-out both',
        drift: 'drift 18s ease-in-out infinite',
        shake: 'shake 620ms cubic-bezier(0.36, 0.07, 0.19, 0.97) both',
        nudge: 'nudge 320ms ease-in-out both',
        'win-pulse': 'win-pulse 900ms ease-in-out infinite',
        'flash-up': 'flash-up 220ms cubic-bezier(0.34, 1.56, 0.64, 1) both'
      }
    }
  },
  plugins: []
};
