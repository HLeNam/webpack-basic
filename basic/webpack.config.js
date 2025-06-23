const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env) => {
    const isDevelopment = Boolean(env.development);
    // nodejs way
    // const isDevelopment = process.env.NODE_ENV !== "production"; // Alternatively, you can use this to determine the environment

    return {
        // mode: "development",
        mode: isDevelopment ? "development" : "production", // Set to 'production' for minification and optimizations
        entry: {
            app: path.resolve("src/index.js"),
        },

        output: {
            path: path.resolve(__dirname, "dist"),
            // filename: "bundle.js",
            filename: "[name].[contenthash].js", // This would allow multiple entry points to be bundled into separate files
            clean: true, // Clean the output directory before emit
            assetModuleFilename: "[file]",
        },

        devtool: isDevelopment ? "source-map" : false, // Disable source maps in production for performance, enable in development

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
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: [
                                [
                                    "@babel/preset-env",
                                    {
                                        debug: true, // Hiển thị debug lên terminal để dễ debug
                                        // useBuiltIns: "usage", // Dùng cái này thì đơn giản nhất, không cần import core-js vào code
                                        useBuiltIns: "entry", // Dùng cái này thì phải import core-js vào code
                                        corejs: "3.43.0", // nên quy định verson core-js để babel-preset-env nó hoạt động tối ưu
                                    },
                                ],
                            ],
                        },
                    },
                },
                {
                    test: /\.(png|svg|jpg|jpeg|gif|pdf)$/i,
                    type: "asset/resource",
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
};
