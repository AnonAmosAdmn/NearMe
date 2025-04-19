const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  mode: 'jit', // Enable Just-in-Time mode for Tailwind CSS
  purge: {
    content: ['./pages/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'], // Specify content sources for purging unused CSS
  },
  darkMode: 'media',
  
  // Other Tailwind CSS configurations
  theme: {
    extend: {
      colors: {
        // Add custom colors here
        primary: '#FF5722',
        secondary: '#2196F3',
      },
      fontFamily: {
        // Extend or override font families
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      // Add more theme customizations as needed
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    // Include additional Tailwind CSS plugins here
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
};
