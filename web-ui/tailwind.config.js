/*
 ** TailwindCSS Configuration File
 **
 ** Docs: https://tailwindcss.com/docs/configuration
 ** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
 */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans]
      },
      // @ref: https://tailwind.ink/
      colors: {
        manatee: {
          '50':  '#f2f9f9',
          '100': '#e2f6f6',
          '200': '#bfecec',
          '300': '#8fdee2',
          '400': '#49c4d1',
          '500': '#78a8ad',
          '600': '#19829f',
          '700': '#1d677f',
          '800': '#1c4f60',
          '900': '#19404c',
        },
        denim: {
          '50':  '#f4f9fb',
          '100': '#e7f4fa',
          '200': '#cae5f6',
          '300': '#a5d0f2',
          '400': '#6facef',
          '500': '#4183ea',
          '600': '#305fdc',
          '700': '#2d4bba',
          '800': '#263a8c',
          '900': '#20306c',
        },
        royalblue: {
          '50':  '#f5f8fb',
          '100': '#e9f2fa',
          '200': '#d0e1f7',
          '300': '#b2c9f4',
          '400': '#86a2f1',
          '500': '#5b77ee',
          '600': '#4454e3',
          '700': '#3a42c4',
          '800': '#2f3495',
          '900': '#272b73',
        },
        orchid: {
          '50':  '#f8f8fa',
          '100': '#f3f0f8',
          '200': '#e6daf3',
          '300': '#d9beee',
          '400': '#c991e7',
          '500': '#b664df',
          '600': '#9643cd',
          '700': '#7034a9',
          '800': '#542a7e',
          '900': '#412460',
        },
        violet: {
          '50':  '#f9f8f9',
          '100': '#f7f0f7',
          '200': '#eedaef',
          '300': '#e6bce6',
          '400': '#de8dd8',
          '500': '#d561c8',
          '600': '#b83fac',
          '700': '#8b3189',
          '800': '#662865',
          '900': '#4e214e',
        },
        sunset: {
          '50':  '#fbf9f8',
          '100': '#fbf1f1',
          '200': '#f7dce0',
          '300': '#f4bdc5',
          '400': '#f28c98',
          '500': '#f0606b',
          '600': '#e03e4a',
          '700': '#b52f3e',
          '800': '#872635',
          '900': '#681f2c',
        },
        coral: {
          '50':  '#fbf9f6',
          '100': '#fbf2eb',
          '200': '#f7e0d1',
          '300': '#f4c4a7',
          '400': '#f1976a',
          '500': '#ee6c3c',
          '600': '#dd4826',
          '700': '#b23625',
          '800': '#862b25',
          '900': '#682321',
        },
        chocolate: {
          '50':  '#fbf9f4',
          '100': '#faf3e3',
          '200': '#f6e5bd',
          '300': '#f2ce84',
          '400': '#eba741',
          '500': '#e5801e',
          '600': '#cf5a12',
          '700': '#a44315',
          '800': '#7b3419',
          '900': '#5f2a18',
        },
        olive: {
          '50':  '#faf9f5',
          '100': '#f9f6e5',
          '200': '#f2ecbd',
          '300': '#e8d984',
          '400': '#d6b840',
          '500': '#bf951c',
          '600': '#9b6f11',
          '700': '#755414',
          '800': '#574018',
          '900': '#433317',
        },
        asparagus: {
          '50':  '#f8f9f7',
          '100': '#f4f6ed',
          '200': '#e7edd2',
          '300': '#d3dcac',
          '400': '#a9bf71',
          '500': '#7b9d40',
          '600': '#5b792a',
          '700': '#495d28',
          '800': '#3a4727',
          '900': '#2e3823',
        },
      }
    }
  },
  variants: {},
  plugins: [
    require("@tailwindcss/ui"),
    require('@tailwindcss/forms'),
    require("@tailwindcss/typography"),
  ]
};
