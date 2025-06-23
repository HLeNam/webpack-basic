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
        filename: "[name].[contenthash].js", // This would allow multiple entry points to be bundled into separate files
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
        new MiniCssExtractPlugin({
            filename: "[name].[contenthash].css", // Use contenthash for cache busting
        }),
        new HtmlWebpackPlugin({
            title: "Webpack App",
            filename: "index.html",
            template: path.resolve(__dirname, "src", "template.html"),
            inject: "body", // Chèn script vào cuối body
        }),
    ],

    devServer: {
        static: {
            directory: path.join(__dirname, "dist"),
        },
        port: 3000, // Cổng mà server sẽ chạy
        open: true, // Mở trang webpack khi chạy terminal
        hot: true, // Bật tính năng reload nhanh Host Module Replacement
        compress: true, // Nén các file để giảm băng thông (gzip)
        historyApiFallback: true, // Cho phép sử dụng HTML5 History API (để hỗ trợ các route không phải là file tĩnh) (nếu dùng Single Page Application)
    },
};
