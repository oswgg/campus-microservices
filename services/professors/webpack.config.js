const path = require('path');
const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');

module.exports = {
    entry: './src/main.ts',
    target: 'node',
    externals: [
        nodeExternals({
            allowlist: ['@campus/*']
        })
    ],
    module: {
        rules: [
            {
                use: {
                    loader: 'ts-loader',
                    options: {
                        configFile: 'tsconfig.build.json'
                    }
                },
                exclude: /node_modules/,
            },
        ],
    },
    mode: 'development',
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            '@campus/*': path.resolve(__dirname, '../../libs/*'),
            '@': path.resolve(__dirname, 'src'),
        },
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'main.js',
    },
    plugins: [
        new webpack.IgnorePlugin({
            resourceRegExp: /^(@grpc\/grpc-js|@grpc\/proto-loader|kafkajs|mqtt|nats|ioredis)$/,
        }),
    ],
    stats: {
        warnings: false,
        errorDetails: false, 
    }
};