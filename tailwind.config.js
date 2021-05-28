module.exports = {
  mode: 'jit',
  prefix: 'sg-ig-',
  purge: [
    './Neos.Ui/*/src/**/*.tsx'
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontSize: {
      small: '12px',
      regular: '14px',
      large: '20px'
    },
    colors: {
      transparent: 'rgba(0,0,0,0)',
      white: '#fff',
      gray: {
        '500': '#999',
        '800': '#3f3f3f',
        '900': '#141414',
      }
    },
    extend: {
      animation: {
        'overlay-appear': 'overlayAppear .5s ease-in-out',
        'modal-appear': 'modalAppear .5s ease-in-out'
      },
      keyframes: {
        overlayAppear: {
          from: {
            opacity: '0'
          }
        },
        modalAppear: {
          from: {
            opacity: '0',
            transform: 'translateX(-50%) translateY(-50%) scale(.94)'
          }
        }
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
