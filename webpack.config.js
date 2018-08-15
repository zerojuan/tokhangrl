const webpack = require("webpack");
const path = require("path");

const APP_DIR = path.resolve(__dirname, "src");
const BUILD_DIR = path.resolve(__dirname, "dist");
const PHASER_DIR = path.resolve(__dirname, "/node_modules/phaser");

const config = {
    entry: `${APP_DIR}/index.js`,
    output: {
        path: BUILD_DIR,
        filename: "bundle.js",
        publicPath: "/"
    },
    mode: "development",
    devtool: "cheap-source-map",
    resolve: {
        extensions: [".js", ".json"],
        modules: [APP_DIR, "node_modules"]
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ["babel-loader"],
                include: APP_DIR
            },
            {
                test: /\.css$/,
                loaders: ["style-loader", "css-loader"]
            },
            {
                test: [/\.vert$/, /\.frag$/],
                use: ["raw-loader"]
            },
            {
                test: /\.(ttf|eot|svg|woff|woff2)(\?.+)?$/,
                loader: "file-loader?name=[hash:12].[ext]"
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            CANVAS_RENDERER: true,
            WEBGL_RENDERER: true
        })
    ],
    devServer: {
        contentBase: BUILD_DIR,
        port: 8080,
        stats: "minimal",
        historyApiFallback: true
    }
};

module.exports = config;
