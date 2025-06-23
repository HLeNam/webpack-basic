const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    // mode: "development",
    mode: "production", // Set to 'production' for minification and optimizations
    entry: {
        app: path.resolve("src/index.js"),
    },

    output: {
        path: path.resolve(__dirname, "dist"),
        // filename: "bundle.js",
        filename: "[name].js", // This would allow multiple entry points to be bundled into separate files
    },

    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
            },
        ],
    },

    plugins: [
        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({
            title: "Webpack App",
            filename: "index.html",
            template: path.resolve(__dirname, "src", "template.html"),
            inject: "body", // Chèn script vào cuối body
        }),
    ],
};
