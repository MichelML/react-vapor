const webpackConfig = require('./webpack.config.test.js');
const mainReporter = !!process.env.TRAVIS ? 'dots' : 'mocha';

module.exports = (config) => {
    config.set({
        frameworks: ['jasmine', 'source-map-support'],

        files: ['./karma.entry.ts'],

        preprocessors: {
            './karma.entry.ts': ['webpack'],
        },

        mime: {
            'text/x-typescript': ['ts', 'tsx'],
        },

        webpack: webpackConfig,

        webpackServer: {
            noInfo: true,
        },

        reporters: [mainReporter, 'coverage'],

        mochaReporter: {
            ignoreSkipped: true,
        },

        coverageReporter: {
            dir: 'coverage',
            reporters: [
                {type: 'json', subdir: '.', file: 'coverage.json'},
                {type: 'text-summary'},
            ],
        },

        port: 9876,
        colors: true,

        browsers: ['ChromeHeadless'],
        customLaunchers: {
            ChromeHeadlessNoSandbox: {
                base: 'ChromeHeadless',
                flags: ['--no-sandbox'],
            },
        },

        autoWatch: true,
        singleRun: true,

        browserNoActivityTimeout: 30000,
    });
};
