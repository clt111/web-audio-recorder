const { join } = require('path');

const CopyPlugin = require('copy-webpack-plugin');
module.exports = {
    entry: join(__dirname, './src/index.ts'),
    mode: 'production',
    output: {
        filename: '[name].js',
        path: join(__dirname, './dist'),
        clean: true,
        publicPath: '/',
        library: {
            name: '"webAudioRecorder',
            type: 'umd'
        },
    },
    externals: {
        webAudioRecorder: 'webAudioRecorder'
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    plugins: [
        new CopyPlugin({
            patterns: [{
                from: './src/recorder/processor.js',
                to: './processor.js'
            }, {
                from: './README.md',
                to: './README.md'

            }]
        })
    ],
    module: {
        rules: [
            {
                test: /.(ts)$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env', 
                            '@babel/preset-typescript'
                        ]
                    }
                },
            }
        ],
    },
}