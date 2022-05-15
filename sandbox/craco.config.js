const path = require('path');

module.exports = {
  webpack: {
    configure: (config) => {
      config.module.rules.push({
        test: /\.lottie$/,
        type: 'javascript/auto',
        use: {
          loader: path.resolve('../dist/index.js'),
          options: {},
        },
      });
      return config;
    },
  },
};
