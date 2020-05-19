const gulp = require('gulp');
const rollup = require('rollup');
const commonjs = require('rollup-plugin-commonjs'); /* Конвертирование CommonJS модулей в ES6 */
const rollupBabel = require('rollup-plugin-babel'); /* Транспиляция/добавление полифилов для умеренной поддержки браузеров */
const resolve = require('rollup-plugin-node-resolve');
const nodeGlobals = require('rollup-plugin-node-globals');

gulp.task('js', function (done) {
  rollup
    .rollup({
      input: 'src/LocalStorageAdapter.js',
      plugins: [
        resolve(),
        commonjs(),
        rollupBabel({
          exclude: ['node_modules/**'],
          babelrc: false,
          extensions: ['.js'],
          presets: [['@babel/preset-env']],
        }),
        nodeGlobals(),
      ],
    })
    .then((bundle) => {
      bundle.write({
        file: 'dist/LocalStorageAdapter.js',
        format: 'iife', // amd ,cjs , esm, iife ,umd, system
        name: 'LocalStorageAdapter',
        sourcemap: true,
      });
    })
    .then(() => {
      done();
    });
});

gulp.task('default', function () {
  return gulp.watch('src/*.js', gulp.series('js'));
});
