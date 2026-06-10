module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
            '@components': './src/components',
            '@screens': './src/screens',
            '@navigation': './src/navigation',
            '@services': './src/services',
            '@Services': './src/services',
            '@contexts': './src/contexts',
            '@types': './src/types',
            '@constants': './src/constants',
            '@utils': './src/utils',
            '@assets': './src/assets',
          },
        },
      ],
    ],
  };
};