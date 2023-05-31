import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
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
