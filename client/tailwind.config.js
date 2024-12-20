module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#185F95',
        secondary: '#343434',
        tertiary: '#f0f0f0',
        complementary: '#D9D9D9',
        white: '#FFFFFF',
        background: '#FFFFFF',
        'primary-transparent': 'rgba(24, 95, 149, 0.7)',
        'secondary-transparent': 'rgba(57, 57, 57, 0.9)',
        'tertiary-transparent': 'rgba(245, 245, 245, 0.7)',
        'complementary-transparent': 'rgba(217, 217, 217, 0.7)',
        'white-transparent': 'rgba(255, 255, 255, 0.7)',
        'white-transparent-navbar': 'rgba(255, 255, 255, 0.85)',
        'background-transparent': 'rgba(255, 255, 255, 0.7)',
        'mount-meadow': '#185F95',
        'white-smoke': '#f0f0f0',
        'night-rider': '#343434',
        black: '#191b17',
      },
      container: {
        width: {
          lg: '86%',
          md: '90%',
          sm: '94%',
          form: '50%',
        },
      },
      transitionTimingFunction: {
        DEFAULT: 'all 400ms ease',
      },
    },
  },
  plugins: [],
};
