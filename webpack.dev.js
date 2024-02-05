const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
module.exports = {
    // 入口
    entry: path.join(__dirname, './example/index.js'),
    devtool: 'source-map',
    devServer: {
        port: 3000, // 服务端口号
        hot: true, // 开启热更新，后面会讲react模块热替换具体配置
        host: 'localhost',
        historyApiFallback: true, // 解决history路由404问题
        static: {
            directory: path.join(__dirname, "./src/recorder/"), //托管静态资源public文件夹
        }
    },
    output: {
      filename: 'index.js',
      clean: true,
      path: path.join(__dirname, './demo')
    },
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
    resolve: {
        extensions: ['.js', '.tsx', '.ts', '.json'],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './example/index.html'),
            filename: 'index.html',
            inject: true
        }),
        new CopyPlugin({
            patterns: [{
                from: './src/recorder/processor.js',
                to: './processor.js'
            }]
        })
    ]
};
