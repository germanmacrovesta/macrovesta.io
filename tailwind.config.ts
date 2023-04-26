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
      }
    },
  },
  plugins: [],
} satisfies Config;
