import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  preflight: true,

  include: ['./src/**/*.{js,jsx,ts,tsx}'],

  exclude: [],

  theme: {
    extend: {
      tokens: {
        colors: {
          teal: {
            50: { value: '#D8F3FA' },
            500: { value: '#2CA6BE' },
            600: { value: '#009BB2' },
          },
          green: {
            500: { value: '#2DBE7E' },
          },
          red: {
            500: { value: '#E5484D' },
          },
          gray: {
            50: { value: '#F6FAFC' },
            100: { value: '#EEF4F6' },
            200: { value: '#DCE5E8' },
            300: { value: '#B1BBBF' },
            500: { value: '#8A9AA0' },
            900: { value: '#263238' },
            white: { value: '#FFFFFF' },
          },
        },
        fonts: {
          body: {
            value:
              'var(--font-pretendard), -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
          },
        },
        fontSizes: {
          xs: { value: '12px' },
          sm: { value: '14px' },
          md: { value: '16px' },
          lg: { value: '18px' },
          xl: { value: '20px' },
          '2xl': { value: '24px' },
          '3xl': { value: '32px' },
        },
        fontWeights: {
          regular: { value: '400' },
          medium: { value: '500' },
          semibold: { value: '600' },
          bold: { value: '700' },
        },
        lineHeights: {
          tight: { value: '1.25' },
          normal: { value: '1.5' },
          relaxed: { value: '1.65' },
        },
        spacing: {
          0: { value: '0px' },
          1: { value: '4px' },
          2: { value: '8px' },
          3: { value: '12px' },
          4: { value: '16px' },
          5: { value: '20px' },
          6: { value: '24px' },
          8: { value: '32px' },
          10: { value: '40px' },
          12: { value: '48px' },
          16: { value: '64px' },
        },
        radii: {
          xs: { value: '3px' },
          sm: { value: '8px' },
          md: { value: '10px' },
          lg: { value: '12px' },
          xl: { value: '16px' },
          pill: { value: '9999px' },
        },
        shadows: {
          sm: { value: '0 1px 2px rgba(38, 50, 56, 0.08)' },
          md: { value: '0 8px 24px rgba(38, 50, 56, 0.10)' },
          focus: { value: '0 0 0 3px rgba(44, 166, 190, 0.24)' },
        },
        borderWidths: {
          DEFAULT: { value: '1px' },
          thick: { value: '2px' },
        },
      },
      semanticTokens: {
        colors: {
          primary: {
            DEFAULT: { value: '{colors.teal.500}' },
            soft: { value: '{colors.teal.50}' },
            hover: { value: '{colors.teal.600}' },
          },
          success: { value: '{colors.green.500}' },
          warning: { value: '{colors.red.500}' },
          text: {
            primary: { value: '{colors.gray.900}' },
            secondary: { value: '{colors.gray.500}' },
            inverse: { value: '{colors.gray.white}' },
          },
          border: {
            DEFAULT: { value: '{colors.gray.300}' },
            subtle: { value: '{colors.gray.200}' },
          },
          bg: {
            canvas: { value: '{colors.gray.50}' },
            surface: { value: '{colors.gray.white}' },
            muted: { value: '{colors.gray.100}' },
          },
        },
      },
    },
  },

  globalCss: {
    'html, body': {
      minHeight: '100%',
      backgroundColor: 'bg.canvas',
      color: 'text.primary',
      fontFamily: 'body',
      lineHeight: 'normal',
    },
    body: {
      margin: 0,
      textRendering: 'optimizeLegibility',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
    },
    '*, *::before, *::after': {
      boxSizing: 'border-box',
    },
    a: {
      color: 'inherit',
      textDecoration: 'none',
    },
    'button, input, textarea, select': {
      font: 'inherit',
    },
    button: {
      cursor: 'pointer',
    },
    'button:disabled': {
      cursor: 'not-allowed',
    },
    'img, picture, video, canvas, svg': {
      display: 'block',
      maxWidth: '100%',
    },
  },

  outdir: 'styled-system',
})
