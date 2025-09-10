const path = require('path');
const nodeExternals = require('webpack-node-externals');

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
    plugins: [],
    stats: {
        warnings: false,
        errorDetails: false, 
    },
};