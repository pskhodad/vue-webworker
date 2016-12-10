const buble = require('rollup-plugin-buble')
const version = process.env.VERSION || require('../package.json').version

module.exports = {
    entry: 'src/index.js',
    dest: 'dist/vue-webworker.js',
    format: 'umd',
    moduleName: 'VueWebWorker',
    plugins: [buble()],
    banner:
    `/**
 * vuex v${version}
 * (c) ${new Date().getFullYear()} Prashant S Khodade
 * @license MIT
 */`
}