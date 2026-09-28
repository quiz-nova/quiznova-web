import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

export const QuizNovaPreset = definePreset(Aura, {
  primitive: {
    fontFamily: "'Inter', sans-serif",
    borderRadius: {
      none: '0',
      xs: '2px',
      sm: '5px',
      md: '10px',
      lg: '15px',
      xl: '20px',
    },
  },
  semantic: {
    primary: {
      50: 'var(--clr-green-50)',
      100: 'var(--clr-green-100)',
      200: 'var(--clr-green-200)',
      300: 'var(--clr-green-300)',
      400: 'var(--clr-green-400)',
      500: 'var(--clr-green-400)',
      600: 'var(--clr-green-600)',
      700: 'var(--clr-green-700)',
      800: 'var(--clr-green-800)',
      900: 'var(--clr-green-800)',
    },
    green: {
      50: 'var(--clr-green-50)',
      100: 'var(--clr-green-100)',
      200: 'var(--clr-green-200)',
      300: 'var(--clr-green-300)',
      400: 'var(--clr-green-400)',
      500: 'var(--clr-green-400)',
      600: 'var(--clr-green-600)',
      700: 'var(--clr-green-700)',
      800: 'var(--clr-green-800)',
      900: 'var(--clr-green-800)',
    },
    emerald: {
      50: 'var(--clr-green-50)',
      100: 'var(--clr-green-100)',
      200: 'var(--clr-green-200)',
      300: 'var(--clr-green-300)',
      400: 'var(--clr-green-400)',
      500: 'var(--clr-green-400)',
      600: 'var(--clr-green-600)',
      700: 'var(--clr-green-700)',
      800: 'var(--clr-green-800)',
      900: 'var(--clr-green-800)',
    },
    success: {
      50: 'var(--clr-green-50)',
      100: 'var(--clr-green-100)',
      200: 'var(--clr-green-200)',
      300: 'var(--clr-green-300)',
      400: 'var(--clr-green-400)',
      500: 'var(--clr-green-400)',
      600: 'var(--clr-green-600)',
      700: 'var(--clr-green-700)',
      800: 'var(--clr-green-800)',
      900: 'var(--clr-green-800)',
    },
    colorScheme: {
      light: {
        primary: {
          color: '{primary.400}',
          contrastColor: '#ffffff',
          hoverColor: '{primary.600}',
          activeColor: '{primary.800}',
        },
        success: {
          color: '{success.400}',
          contrastColor: '#ffffff',
          hoverColor: '{success.600}',
          activeColor: '{success.800}',
        },
      },
    },
  },
});
