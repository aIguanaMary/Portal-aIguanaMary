import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      /* ── FONTES ── */
      fontFamily: {
        // font-space → Orbitron (headings sci-fi)
        space: ['var(--font-orbitron)', 'sans-serif'],
        // font-body  → Space Grotesk (corpo de texto)
        body:  ['var(--font-space-grotesk)', 'sans-serif'],
        // font-mono  → Share Tech Mono (terminal)
        mono:  ['var(--font-share-tech-mono)', 'Courier New', 'monospace'],
      },

      /* ── CORES ── */
      colors: {
        background: '#050505',
        iguana: {
          neon:    '#39FF14',
          purple:  '#8A2BE2',
          dark:    '#050505',
          teal:    '#00e5ff',
          amber:   '#FFE86B',
          surface: '#0a0a0a',
        },
      },

      /* ── BACKGROUNDS ── */
      backgroundImage: {
        'cyber-grid':
          'linear-gradient(to right, rgba(57,255,20,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(57,255,20,0.06) 1px, transparent 1px)',
        'neon-gradient':
          'linear-gradient(135deg, #39FF14 0%, #8A2BE2 50%, #00e5ff 100%)',
        'dark-radial':
          'radial-gradient(ellipse at center, #0a1a0a 0%, #050505 70%)',
      },
      backgroundSize: {
        'grid-size': '40px 40px',
      },

      /* ── ANIMAÇÕES ── */
      animation: {
        'pulse-slow':    'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'neon-pulse':    'neon-pulse 2s ease-in-out infinite',
        'float-y':       'float-y 6s ease-in-out infinite',
        'scan-down':     'scan-down 3s ease-in-out infinite',
        'glitch-1':      'glitch-1 4s infinite linear',
        'glitch-2':      'glitch-2 4s infinite linear',
        'grid-drift':    'grid-drift 40s linear infinite',
        'holo-shimmer':  'holo-shimmer 3s linear infinite',
        'border-run':    'border-run 3s linear infinite',
        'flicker':       'flicker 5s infinite',
        'orbit':         'orbit 4s linear infinite',
        'blink':         'blink 1s step-end infinite',
        'radar-sweep':   'radar-sweep 4s linear infinite',
        'count-glow':    'count-glow 2s ease-in-out infinite',
      },

      /* ── BOX SHADOWS NEON ── */
      boxShadow: {
        'neon-green':  '0 0 10px #39FF14, 0 0 30px rgba(57,255,20,0.4), 0 0 60px rgba(57,255,20,0.15)',
        'neon-purple': '0 0 10px #8A2BE2, 0 0 30px rgba(138,43,226,0.4)',
        'neon-sm':     '0 0 5px #39FF14,  0 0 15px rgba(57,255,20,0.3)',
        'card-dark':   '0 20px 60px rgba(0,0,0,0.8), inset 0 0 30px rgba(57,255,20,0.04)',
      },

      /* ── DROP SHADOWS ── */
      dropShadow: {
        'neon-green':  ['0 0 8px rgba(57,255,20,0.9)', '0 0 20px rgba(57,255,20,0.5)'],
        'neon-purple': ['0 0 8px rgba(138,43,226,0.9)', '0 0 20px rgba(138,43,226,0.5)'],
        'neon-teal':   ['0 0 8px rgba(0,229,255,0.9)', '0 0 20px rgba(0,229,255,0.5)'],
      },
    },
  },
  plugins: [],
};

export default config;
