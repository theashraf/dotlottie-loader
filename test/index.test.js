const path = require('path');

const webpack = require('webpack');
const { createFsFromVolume, Volume } = require('memfs');

function createCompiler(options = {}) {
  const compiler = webpack({
    entry: path.resolve(__dirname, './fixtures/index.jsx'),
    output: {
      filename: 'bundle.js',
      path: __dirname,
    },
    module: {
      rules: [
        {
          test: /\.jsx$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
            },
          },
        },
        {
          test: /\.lottie$/,
          use: {
            loader: path.resolve(__dirname, '../lib/index.js'),
            options,
          },
        },
      ],
    },
  });

  const memoryFs = createFsFromVolume(new Volume());
  compiler.outputFileSystem = memoryFs;

  return compiler;
}

function compileAsync(compiler) {
  return new Promise((resolve, reject) => {
    compiler.run((error, stats) => {
      if (error || stats.hasErrors()) {
        const resolvedError = error || stats.toJson('errors-only')[0];
        reject(resolvedError.message);
      }
      resolve(stats);
    });
  });
}

test('resolve .lottie modules to a react component', async () => {
  const compiler = createCompiler();
  await compileAsync(compiler);
  expect(compiler.outputFileSystem.readdirSync(__dirname))
    .toMatchInlineSnapshot(`
    Array [
      "bundle.js",
      "bundle.js.LICENSE.txt",
      "c23e947239163b9c.lottie",
    ]
  `);
  expect(
    compiler.outputFileSystem.readFileSync(
      path.join(__dirname, 'bundle.js'),
      'utf8'
    )
  ).toMatchSnapshot();
});
