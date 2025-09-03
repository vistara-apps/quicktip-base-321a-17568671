    /** @type {import('tailwindcss').Config} */
    module.exports = {
      content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/components/**/*.{js,ts,jsx,tsx,mdx}",
      ],
      theme: {
        extend: {
          colors: {
            bg: 'hsla(0, 0%, 0%, 0)',
            accent: 'hsla(309, 78%, 53%, 1)',
            primary: 'hsla(194, 78%, 53%, 1)',
            surface: 'hsla(0, 0%, 100%, 0.1)',
          },
          borderRadius: {
            sm: '8px',
            md: '12px',
            lg: '24px',
          },
          spacing: {
            sm: '12px',
            md: '16px',
            lg: '24px',
          },
          boxShadow: {
            card: '0 5px 15px hsla(0, 0%, 0%, 0.1)',
          },
          fontSize: {
            body: ['16px', { lineHeight: '1.5' }],
            display: ['20px', { fontWeight: '700' }],
          },
          transitionDuration: {
            base: '200ms',
            fast: '100ms',
          },
          transitionTimingFunction: {
            'in-out': 'ease-in-out',
          },
        },
      },
      plugins: [],
    };
  