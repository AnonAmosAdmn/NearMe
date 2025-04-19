module.exports = {
  plugins: [
    'tailwindcss',
    'autoprefixer',
    'postcss-import',
    'postcss-extend-rule',
    [
      'cssnano',
      {
        preset: 'default',
      },
    ],
    'postcss-flexbugs-fixes',
    [
      'postcss-preset-env',
      {
        stage: 1,
      },
    ],
  ],
};
