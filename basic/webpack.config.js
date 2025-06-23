const path = require("path");

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
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.s[ac]ss$/i,
                use: ["style-loader", "css-loader", "sass-loader"],
            },
        ],
    },
};
