const path = require('path');

module.exports = {
  webpack: {
    configure: (config) => {
      config.resolveLoader = {
        ...config.resolveLoader,
        alias: {
          'dotlottie-loader': path.resolve(__dirname, '../lib/index.js'),
        },
      };

      config.module.rules.push({
        test: /\.lottie$/,
        type: 'javascript/auto',
        use: 'dotlottie-loader',
      });

      return config;
    },
  },
};
