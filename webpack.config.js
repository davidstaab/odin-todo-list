import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import Path from 'path';
import Url from 'url';
// import webpack from 'webpack';

const projectFolder = Path.dirname(Url.fileURLToPath(import.meta.url));

console.log('NODE_ENV = "' + process.env.NODE_ENV + '"\n');
const devMode = process.env.NODE_ENV !== "production";

const styleLoaderRuleConfig = {
    loader: 'style-loader',
    options: {
        injectType: "autoStyleTag",
    },
};

export default {
    entry: './src/index.js',
    output: {
        clean: true,
        filename: 'main.js',
        path: Path.resolve(projectFolder, 'dist'),
    },
    devtool: 'inline-source-map',
    // devServer: {
    //     static: './dist',
    // }
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/template.html',
            scriptLoading: 'module',
        }),
    ].concat(devMode ? [] : [new MiniCssExtractPlugin()]),
    module: {
        rules: [
            {
                // CSS files
                test: /\.css$/i,
                use: [
                    devMode ? styleLoaderRuleConfig : MiniCssExtractPlugin.loader,
                    'css-loader',
                ],
                sideEffects: true, // Prevent tree shaking on css imports (in prod)
            },
            // {
            //     // Image files
            //     test: /\.(png|jpg|jpeg|svg|gif|webp)$/i,
            //     type: 'asset/resource',
            //     generator: { filename: 'static/[name][ext]'},
            // },
        ],
    },
}