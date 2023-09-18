import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      gridTemplateColumns: {
        'auto-cols-min': 'repeat(auto-fill, minmax(min-content, 1fr))',
      },
      backgroundImage: {
        'gradient-one': 'linear-gradient(to right, #00a2c3, #49ccb8)',
        'gradient-two': 'linear-gradient(to right, #7571e1, #00a2c3)',
        'background-1': "url('/Background_2.svg')",

      },


      animation: {
        'grow': 'grow 0.75s ease-in-out',
        'insideright': 'insideright 10s cubic-bezier(0.25, 0.1, 0.25, 1) infinite',
        'topright': 'topright 10s cubic-bezier(0.25, 0.1, 0.25, 1) infinite',
        'right': 'right 10s cubic-bezier(0.25, 0.1, 0.25, 1) infinite',
        'topleft': 'topleft 10s cubic-bezier(0.25, 0.1, 0.25, 1) infinite',
        'left': 'left 10s cubic-bezier(0.25, 0.1, 0.25, 1) infinite',
        'bottomleft': 'bottomleft 10s cubic-bezier(0.25, 0.1, 0.25, 1) infinite',
        'insideleft': 'insideleft 10s cubic-bezier(0.25, 0.1, 0.25, 1) infinite',
        'bottomright': 'bottomright 10s cubic-bezier(0.25, 0.1, 0.25, 1) infinite',
        'contract': 'contract 10s cubic-bezier(0.25, 0.1, 0.25, 1) infinite',
        'slidein': 'slidein 1.5s ease-in-out',
        'slidedown': 'slidedown 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)',
        'dynamic': 'dynamic 4000ms ease-in-out infinite',
        'fade-in': 'fade-in 2s linear',
        'fade-in-out': 'fade-in-out 8s linear infinite',
        'fade-grow-r': 'fade-grow-r 10s cubic-bezier(0.25, 0.1, 0.25, 1) infinite 5s',
        'fade-grow-l': 'fade-grow-l 10s cubic-bezier(0.25, 0.1, 0.25, 1) infinite 5s',
        'fade-grow-xl': 'fade-grow-xl 10s cubic-bezier(0.25, 0.1, 0.25, 1) infinite 5s',
        'bounce': 'bounce 10s  infinite ',
        'expand': 'expand 10s  infinite ',
        'expandfast': 'expand 2s  infinite ',
        'exitright': ' exitright 20s ease-in-out infinite',
        'flash': 'flash 20s infinite',
        'flashfast': 'flashfast 1s infinite',
        'rotate': 'rotate 10s  linear  infinite',
        'popone': 'popone ease-in-out 10s  infinite',
        'poptwo': 'poptwo ease-in-out 10s infinite',
        'slideright': 'slideright 0.5s ease-out',
        'squeezeright': 'squeezeright 1s ease-in-out'

      },
      keyframes: {

        'fade-in': {
          '0%': {
            opacity: '0'
          },
          '10%': {
            opacity: '0'
          },
          '1000%': {
            opacity: '1'
          }
        },

        'rotate': {
          '0%': {
            transform: 'rotate(0)'
          },
          '100%': {
            transform: 'rotate(360deg)'
          }
        },

        'popone': {
          '0%, 100%': {
            transform: 'scale(0)'
          },
          '12.5%': {
            transform: 'scale(0.95)'
          },
          '25%': {
            transform: 'scale(1)'
          },
          '37.5%': {
            transform: 'scale(0.95)'
          },
          '50%': {
            transform: 'scale(0)'
          },
        },


        'poptwo': {
          '0%, 100%': {
            transform: 'scale(0)'
          },
          '50%': {
            transform: 'scale(0)'
          },
          '55%': {
            transform: 'scale(0.95)'
          },
          '75%': {
            transform: 'scale(1)'
          },
          '87.5%': {
            transform: 'scale(0.95)'
          },
          // '50%' : {
          //   transform: 'scale(0)'
          // },
        },

        'flash': {
          '0%': {
            opacity: '0'
          },
          '40%': {
            opacity: '0'
          },
          '50%': {
            opacity: '1'
          },
          '60%': {
            opacity: '0'
          },
          '100%': {
            opacity: '0'
          },
        },

        'flashfast': {
          '0%': {
            opacity: '1'
          },
          '80%': {
            opacity: '1'
          },
          '100%': {
            opacity: '0'
          },
        },

        'exitright': {
          '0%': {
            transform: 'translate(-525px, -300px)'
          },
          '40%': {
            transform: 'translate(0px, 0px)'
          },
          '60%': {
            transform: 'translate(0px, 0px)'
          },
          '100%': {
            transform: 'translate(525px, 300px)'
          },
        },

        'expand': {
          '0%, 100%': {
            transform: 'scale(1)'
          },
          '30%': {
            transform: 'scale(1.2)'
          },
          '50%': {
            transform: 'scale(1)'
          },
          '80%, 100%': {
            transform: 'scale(1)'
          },
        },
        'expandfast': {
          '0%, 100%': {
            transform: 'scale(1)'
          },
          '30%': {
            transform: 'scale(1.2)'
          },
          '50%': {
            transform: 'scale(1)'
          },
          '80%, 100%': {
            transform: 'scale(1)'
          },
        },
        'bounce': {
          '0%, 100%': {
            transform: 'translate(0px, 0px)'
          },
          '30%': {
            transform: 'translate(0px, -30px)'
          },
          '50%': {
            transform: 'translate(0px, 0px)'
          },
          '80%, 100%': {
            transform: 'translate(0px, 0px)'
          }
        },



        'fade-grow-r': {
          '0%, 100%': {
            transform: 'translate(400px, 0) scale(0.3)',
            opacity: '0',
          },
          '50%': {
            transform: 'scale(0.9)',
            opacity: '1',
          },
        },

        'fade-grow-l': {
          '0%, 100%': {
            transform: 'translate(-400px, 0) scale(0.3)',
            opacity: '0',
          },
          '50%': {
            transform: 'scale(0.9)',
            opacity: '1',
          },
        },

        'fade-grow-xl': {
          '0%, 100%': {
            transform: ' scale(0.3)',
            opacity: '0',
          },

          '50%': {
            transform: 'scale(4)',
            opacity: '0.3',
          },
        },

        'fade-in-out': {
          '0%, 100%': { opacity: '0' },
          '50%': { opacity: '1' },
        },

        grow: {
          '0%': { transform: 'scale(0.4)' },
          '100%': { transform: 'scale(1)' },
        },

        insideright: {
          '0%, 100%': {
            transform: 'translate(0, 0) scale(1)',
            opacity: '0',
          },
          '50%': {
            transform: 'translate(350px,-270px) scale(3)',
            opacity: '0.9',
          },
        },

        topright: {
          '0%, 100%': {
            transform: 'translate(0, 0) scale(1)',
            opacity: '0',
          },
          '50%': {
            transform: 'translate(500px,-500px) scale(2)',
            opacity: '0.9',
          },
        },

        right: {
          '0%, 100%': {
            transform: 'translate(0, 0) scale(1)',
            opacity: '0',
          },
          '50%': {
            transform: 'translate(550px,0px) scale(5)',
            opacity: '0.9',
          },
        },

        left: {
          '0%, 100%': {
            transform: 'translate(0, 0) scale(1)',
            opacity: '0',
          },
          '50%': {
            transform: 'translate(-550px,0px) scale(4)',
            opacity: '1',
          },
        },

        topleft: {
          '0%, 100%': {
            transform: 'translate(0, 0) scale(1)',
            opacity: '0',
          },
          '50%': {
            transform: 'translate(-500px,-500px) scale(4)',
            opacity: '0.9',
          },
        },

        insideleft: {
          '0%, 100%': {
            transform: 'translate(0, 0) scale(1)',
            opacity: '0',
          },
          '50%': {
            transform: 'translate(-500px,-300px) scale(2)',
            opacity: '0.9',
          },
        },

        bottomright: {
          '0%, 100%': {
            transform: 'translate(0, 0) scale(1)',
            opacity: '0',
          },
          '50%': {
            transform: 'translate(550px,-200px) scale(15)',
            opacity: '0.3',
          },
        },

        bottomleft: {
          '0%, 100%': {
            transform: 'translate(0, 0) scale(1)',
            opacity: '0',
          },
          '50%': {
            transform: 'translate(-550px,-250px) scale(10)',
            opacity: '0.3',
          },
        },

        contract: {
          '0%, 100%': {
            transform: 'scale(1)',
          },
          '50%': {
            transform: 'scale(0.8)',

          },
        },

        slidein: {
          '0%': {
            transform: 'translateX(100%) scale(0.5)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateX(0) scale(1)',
            opacity: '1',


          },
        },


        slideright: {
          '0%': {
            transform: 'translateX(100%)',
            opacity: '0.5',
          },
          '100%': {
            transform: 'translateX(0)',
            opacity: '1',


          },
        },

        squeezeright: {
          '0%': {
            transform: 'translateX(-100%)',
            opacity: '0.5',
          },
          '100%': {
            transform: 'translateX(0)',
            opacity: '1',


          },
        },

        slidedown: {
          '0%': {
            transform: 'translateY(-100%)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateX(0)',
            opacity: '1',


          },
        },

        dynamic: {
          '0%': {
            opacity: '0',
          },
          '20%': {
            opacity: '1',
          },
          '80%': {
            opacity: '1',
          },
          '100%': {
            opacity: '0',
          },
        },
      },
      colors: {
        turquoise: {
          DEFAULT: '#3BBCAC'
        },
        green: {
          DEFAULT: '#44B549'
        },
        navy: {
          DEFAULT: '#051D38'
        },
        deep_blue: {
          DEFAULT: '#051D6D'
        },
        purple: {
          DEFAULT: '#A14CAC'
        },
        blue: {
          DEFAULT: '#133BD1'
        },
        light_purple: {
          DEFAULT: '#D060D6'
        },
        lilac: {
          DEFAULT: '#051D38'
        },
        white: {
          DEFAULT: '#FAF6F3'
        }
      },
      boxShadow: {
        'center-sm': '0 0 2px 0 #00000050)',
        'center': '0 0 3px 0 rgb(0 0 0 / 0.1), 0 0 2px -1px #00000050',
        'center-md': '0 0 6px -1px rgb(0 0 0 / 0.1), 0 0 4px -2px #00000090',
        'center-lg': '0 0 15px -3px rgb(0 0 0 / 0.1), 0 0 6px -4px #00000090',
        'center-xl': '0 0 25px -5px rgb(0 0 0 / 0.1), 0 0 10px -6px #00000050',
        'center-2xl': '0 0 50px -12px #00000050',
      }
    },
  },
  plugins: [],
} satisfies Config;
