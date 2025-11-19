export const theme = {
  colors: {
    // Core palette from specification
    background: '#0a0a0a',
    secondary: '#1a1a1a',
    card: '#2a2a2a',
    border: {
      subtle: 'rgba(255,255,255,0.1)',
      emphasis: 'rgba(255,255,255,0.2)',
    },
    text: {
      primary: '#ffffff',
      secondary: '#cccccc',
      muted: '#999999',
    },
    accent: {
      burgundy: '#c9302c',
      gold: '#d4af37',
      blue: '#4a90e2',
    },
    // Semantic colors
    success: '#22c55e',
    warning: '#d4af37',
    error: '#ef4444',
    info: '#4a90e2',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #c9302c 0%, #d4af37 100%)',
    secondary: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
    glass: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
    shimmer: 'linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%)',
  },
  shadows: {
    subtle: '0 4px 12px rgba(0,0,0,0.15)',
    medium: '0 8px 24px rgba(0,0,0,0.25)',
    large: '0 16px 40px rgba(0,0,0,0.35)',
    glow: {
      burgundy: '0 0 20px rgba(201, 48, 44, 0.3)',
      gold: '0 0 20px rgba(212, 175, 55, 0.3)',
      blue: '0 0 20px rgba(74, 144, 226, 0.3)',
    },
    floating: '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(201, 48, 44, 0.1)',
  },
  backdropBlur: {
    light: 'blur(5px)',
    medium: 'blur(10px)',
    heavy: 'blur(20px)',
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  typography: {
    fontFamily: {
      sans: ['Inter', 'Helvetica Neue', 'system-ui', 'sans-serif'],
      display: ['Inter', 'Helvetica Neue', 'system-ui', 'sans-serif'],
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '1' }],
    },
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    },
    letterSpacing: {
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    },
  },
  animations: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
      slower: '1000ms',
    },
    easing: {
      ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      luxury: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  zIndex: {
    base: 0,
    overlay: 10,
    modal: 20,
    dropdown: 30,
    tooltip: 40,
    notification: 50,
  },
} as const;

export type Theme = typeof theme;