export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Inter Tight', 'Inter', 'Arial', 'sans-serif'],
        body: ['Inter', 'Arial', 'sans-serif'],
      },
      colors: {
        loops: {
          paper: 'var(--color-paper)',
          ink: 'var(--color-ink)',
          blue: 'var(--color-blue)',
          blueSoft: 'var(--color-blue-soft)',
          lime: 'var(--color-lime)',
          glass: 'var(--color-glass)',
        },
      },
      boxShadow: {
        glass: '0 24px 80px rgba(17, 23, 41, 0.12)',
        blue: '0 18px 50px rgba(73, 154, 255, 0.26)',
      },
    },
  },
  plugins: [],
};
