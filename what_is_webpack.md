# Webpack

## Webpack là gì?

-   Webpack là một tool chạy trên môi trường NodeJs giúp chúng ta đóng gói các file js, css, sass, jpg ... Ngoài ra webpack còn giúp chúng ta tạo một server ảo để thuận tiện cho việc code.

## Cài `webpack` và `webpack-cli`

-   Chúng ta cài vào trong devDependencies vì tool này chỉ chạy trong lúc chúng ta dev
-   `webpack-cli` có 2 chế độ cài là **global** và **local**. Mình khuyên các bạn cài `local` cho dễ quản lý.
-   Chạy câu lệnh:
    -   `yarn add webpack webpack-cli -D` để cài
    -   hoặc `npm install webpack webpack-cli --save-dev` để cài
-   Mở file `package.json` lên để thêm dòng `"build"`: `"webpack"` vào trong `script`
-   Mặc định thì `webpack` sẽ sử dụng thư mục `dist` để chứa những file sau khi build và sử dụng
    `src/index.js` để chứa file **entry** (file đầu vào tổng) của dự án. Muốn custom thư mục khác hoặc cấu
    hình sâu hơn thì phải tạo file config là `webpack.config.js`.
-   Webpack sẽ tự nhận diện file `webpack.config.js` và lấy những config trong đó. Nếu bạn tạo tên file
    khác `webpack.confi1.js` thì phải khai báo nó trong đoạn script của `package.json` để webpack biết.

**`webpack.config.js`**

```js
const path = require("path");
module.exports = {
    mode: "development",
    entry: {
        app: path.resolve("src/index.js"),
    },

    output: {
        path: path.resolve(__dirname, "dist"),
    },
};
```

## Sử dụng các Loaders và biên dịch SASS

-   Nếu muốn dùng css trong webpack thì bạn phải cài `style-loader` và `css-loader`.
-   Chạy câu lệnh `yarn add style-loader css-loader -D` (hoặc `npm install style-loader css-loader --save-dev`) để cài.
-   Muốn dùng thêm sass thì phải cài thêm `sass` và `sass-loader`.
-   Chạy câu lệnh `yarn add sass sass-loader -D` (hoặc `npm install sass sass-loader --save-dev`) để cài.
-   Sau khi build và chạy thì chúng ta sẽ thấy thẻ `<style>` được Javascript thao tác DOM vào trong file `index.html`. Nếu các bạn muốn file css nằm riêng biệt thì xem ở bước tiếp theo nhé.

**`webpack.config.js`**

```js
const path = require("path");

module.exports = {
    mode: "production",
    entry: {
        app: path.resolve("src/index.js"),
    },

    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js",
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
```

## Sử dụng HTML Webpack Plugin để tự động tạo ra file HTML

-   Bây giờ có 1 vấn đề là chúng ta đang chỉnh sửa các đường dẫn css và js bằng tay trong file `index.html`. Điều này không hay chút nào vì sau này các tên file sẽ là các hash name thì việc cập nhật lại file `index.html` khá mất thời gian.
-   `html-webpack-plugin` sẽ giúp chúng ta tự tạo ra 1 file html bằng webpack theo cấu hình của chúng ta.
-   Chạy câu lệnh `yarn add html-webpack-plugin -D` (hoặc `npm install html-webpack-plugin --save-dev`) để cài

**`webpack.config.js`**

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "production",
    entry: {
        app: path.resolve("src/index.js"),
    },

    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js",
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

    plugins: [
        new HtmlWebpackPlugin({
            title: "Webpack App",
            template: path.resolve(__dirname, "src/index.html"),
            filename: "index.html",
            inject: "body", // Chèn script vào cuối body
        }),
    ],
};
```

## Tách CSS ra những file riêng

-   Hiện tại thì CSS đang được chèn vào trong file `index.html` thông qua thẻ `<style>`. Điều này không tốt vì khi chúng ta có nhiều file css thì sẽ làm tăng kích thước của file js.

## Vấn đề khi chèn style bằng JS

-   Vấn đề hiện tại là CSS đang được JS DOM vào nên xảy ra tình trạng "chớp trắng" khi mới load trang.
-   Tăng size file JS lên rất nhiều

## Cách fix

-   Dùng `mini-css-extract-plugin` để tách nó ra thành những file riêng
-   Chạy câu lệnh `yarn add mini-css-extract-plugin -D` (hoặc `npm install mini-css-extract-plugin --save-dev`) để cài

## Lưu ý:

-   Hãy đảm bảo bạn đã cài và đang dùng plugin `html-webpack-plugin` , vì nó cần plugin này để tự động generate ra the `<link>` trong file `index.html`.
-   Không dùng plugin `style-loader` cùng với `mini-css-extract-plugin`. Nếu đang dùng `style-loader` thì hãy bỏ nó đi, 2 plugin này xung đột với nhau.

**`webpack.config.js`**

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    mode: "production",
    entry: {
        app: path.resolve("src/index.js"),
    },

    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js",
    },

    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader
                    "css-loader",
                ],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,"css-loader", "sass-loader"
                ],
            },
        ],
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].css",
        }),
        new HtmlWebpackPlugin({
            title: "Webpack App",
            template: path.resolve(__dirname, "src/index.html"),
            filename: "index.html",
            inject: "body", // Chèn script vào cuối body
        }),
    ],
};
```

## Xử lý caching ở trình duyệt bằng hash name file

-   Hiện tại những file css hay js sau khi build đều có 1 cái tên cố định, điều này dẫn đến trình duyệt hoặc server sẽ thực hiện caching. Caching là tốt, điều này giúp cho web chúng ta load nhanh hơn nhưng nó không đúng với ngữ cảnh hiện tại. Chúng ta thường build lại webpack khi có một cập nhật mới gì đó trên website và chúng ta muốn người dùng sẽ thấy ngay lập tức bản cập nhật này. Vì thế chúng ta cần phải xử lý caching.
-   Cách xử lý dễ nhất là mỗi lần build webpack chúng ta lại tạo ra một tên file mới. Webpack cho phép chúng ta chỉnh sửa điều này trong `output.filename` bằng `[contenthash]`

**`webpack.config.js`**

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    mode: "production",
    entry: {
        app: path.resolve("src/index.js"),
    },

    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].[contenthash].js",
    },

    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader
                    "css-loader",
                ],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,"css-loader", "sass-loader"
                ],
            },
        ],
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].[contenthash].css",
        }),
        new HtmlWebpackPlugin({
            title: "Webpack App",
            template: path.resolve(__dirname, "src/index.html"),
            filename: "index.html",
            inject: "body", // Chèn script vào cuối body
        }),
    ],
};
```

## Tạo một server bang webpack để dev

-   Hiện tại chúng ta đang dùng Live Server trên VS code để tự động reload lại trang web. Webpack cung cấp sẵn cho chúng ta tính năng tạo một server localhost không cần dùng đến extension VS code.
-   Để sử dụng thì chúng ta cài `webpack-dev-server`: `yarn add webpack-dev-server -D` (hoặc `npm install webpack-dev-server --save-dev`)
-   Thêm script sau vào `package.json`: `"start": "webpack serve"`

### Lưu ý

-   `webpack-dev-server` cần `html-webpack-plugin` để hoạt động được.
-   `webpack-dev-server` sẽ lưu các tạm các file của bạn vào RAM, vì thế bạn sẽ không thấy chúng ở trong thư mục build (`dist`)

**`webpack.config.js`**

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    mode: "production",
    entry: {
        app: path.resolve("src/index.js"),
    },

    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].[contenthash].js",
    },

    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader
                    "css-loader",
                ],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,"css-loader", "sass-loader"
                ],
            },
        ],
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].[contenthash].css",
        }),
        new HtmlWebpackPlugin({
            title: "Webpack App",
            template: path.resolve(__dirname, "src/index.html"),
            filename: "index.html",
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
```

## Dọn dẹp thư mục build

-   Thêm `output.clean = true` để dọn dẹp thư mục `dist` sau mỗi lần build.

## Source map

-   Thêm `devtool: 'source-map'` để có `source-map` đẩy đủ tiện lợi cho môi trường dev.
-   `source-map` sẽ làm chậm tiến trinh build và rebuild.
-   Ngoài `source-map` ra thì còn có các giá trị khác như `eval`, `eval-cheap-source-map`, ... tuy thuộc vào mục đích sử dụng.
-   **Khuyên dùng**: Chỉ nên để `source-map` khi dev, khi build ra production thì hãy disable nó đi vì `source-map` sẽ làm lộ mã nguồn cũng như là tăng kích thước các file build.
-   Webpack nhận các biến môi trường thông qua `-- env` trong câu lệnh script khi chạy webpack. Vì thế bạn hãy thêm `"start": "webpack serve -- env development"` trong script của `package.json` để truyền `development = true` vào webpack. `module.exports` ở file `webpack.config.js` ngoài bang một object thì nó còn có thể là một function với tham số là biến object môi trường env.
-   Bạn cũng có thể truyền biến môi trường vào webpack thông qua `process.env` của NodeJs. Nếu máy windows thì `"start": "SET NODE_ENV=production&webpack serve"`, con Linux thì `"start": "NODE_ENV=production webpack serve"`. Bên file `webpack.config.js` bạn có thể lấy giá trị của `NODE_ENV` bằng `process.env.NODE_ENV`.

**`webpack.config.js`**

```js
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
        clean: true, // Clean the output directory before emit
    },

    devtool: process.env.NODE_ENV === "production" ? false : "source-map", // Use source-map only in development mode

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
```

## Dùng Babel để dịch code JS thành các phiên bản cũ hơn

-   Nếu như chúng ta viết code JS có các cú pháp của phiên bản ES2022 thì những trình duyệt cũ chỉ chạy được ES6 sẽ không thể hiểu được code và dẫn đến lỗi. Vì thế transpile code thành các version cũ hơn là cần thiết. Công cụ transpile phổ biến nhất là **Babel**
-   Để sử dụng Babel ở webpack các bạn cần cài `yarn add @babel/core @babel/preset-env babel-loader -D` (hoặc `npm install @babel/core @babel/preset-env babel-loader --save-dev`)

-   Để mình giải thích luôn thằng `@babel/core` là lõi của Babel
-   `@babel/preset-env` là bộ preset (thiết lập sẵn) cho từng đối tượng môi trường
-   `babel-loader` dùng để tích hợp Babel vào webpack.
-   Tiếp theo các bạn thêm cái này vào rules là được.

```js
module.exports = {
    // ...
    module: {
        rules: [
            // ...
            // ·\* js
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],
                    },
                },
            },
        ],
    },
};
```

-   Chúng ta exclude `node_modules` vì quá trình dịch code là quá trình rất nặng và chậm. Hãy đảm bảo chúng ta cần dịch ít code nhất có thể, vì thế chúng ta không cần dịch code từ các package trong `node_modules`, nhưng package này đa số đã được dịch để chạy được ở đa số trình duyệt phổ biến rồi.

-   Trừ trường hợp đặc biệt bạn vẫn phải dịch một số thư viện trong `node_modules`. Lúc này có thể kết hợp `test` và `not` như dưới đây.

```js
{
    test: /\.m?js$/,
    exclude: {
        and: [/node_modules/],
        not: [
            /unfetch/,
            /d3-array|d3-scale/,
            /@hapi[\\/]joi-date/
        ]
    },
    use: {
        loader: "babel-loader",
        options: {
            presets: [
                ['@babel/preset-env']
            ]
        },
    }
}
```

-   Nếu không đặt `target` cho `@babel/preset-env` thì [Babel sẽ cho rằng bạn đang target đến các trình duyệt cũ nhất có thể, ví dụ '@babel/preset-env' sẽ dịch code ES2015-ES2020 sang ES5](https://babeljs.io/docs/en/options#no-targets). Vậy nên bạn nên đặt `target` để có thể giảm kích thước file build.

-   Ở phần [doc 'targets' của @babel/preset-env](https://babeljs.io/docs/en/babel-preset-env#targets) thì chúng ta có thể truyền thằng targets vào cái option này kiểu như phía dưới

```js
presets: [
    [
        "@babel/preset-env",
        {
            targets: "ie 11",
        },
    ],
];
```

-   Nhưng theo mình test thì nó không hiệu quả, arrow function vẫn xuất hiện ở file build cho **ie 11**. Có vẻ cái targets option này không hoạt động tốt với những trình duyệt cũ. Nhưng nếu chúng ta làm theo [doc nó recommend là tạo file '.browserslistrc'](https://babels.io/docs/en/babel-preset-env#browserslist-integration) để setting cho cái targets thì lại hoạt động tốt.

-   **Browserslist** là một thư viện giúp chúng ta config target browsers hoặc node.js. Cách viết Browserslist có thể tham khảo tại [doc của nó](https://github.com/browserslist/browserslist)

**`.browserslistrc`**

```bash
ie 11
```

### Lưu ý với `@babel/preset-env`

-   Không phải chỉ cần set targets là tất cả code chạy được trên môi trường muốn, đôi lúc bạn phải setting một số thứ.

-   Ví dụ sử dụng cú pháp ES6 Spread Operator có thể dịch sang để tương thích với **ie 11** mà không cần setting gì nhiều cho `@babel/preset-env`

**`index.js`**

```js
// ES6 Spread Operator
const person = { name: "Duoc" };
const personClone = { ...person };
console.log("personClone", personClone);
```

**`webpack.config.js`**

```js
module: {
    rules: [
        {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [['@babel/preset-env']]
                },
            },
        },
    ],
},
```

-   Nhưng nếu bạn dùng cú pháp ES7 `Object.values` thì bạn phải setting một chút nó mới hoạt động.

-   Trước tiên bạn cần cài `yarn add core-js -D` (hoặc `npm install core-js -D`). **`core-js`** là một thư viện tiêu chuẩn chứa các tính năng của javascript, nó còn chứa các polyfill (những đoạn code dự phòng cho những tính năng mới mà môi trường hiện tại không hỗ trợ)

**`index.js`**

```js
// ES6 Spread Operator
const person = { name: "Duoc" };
const personClone = { ...person };
console.log("personClone", personClone);

// ES7 Object.values
console.log("Object.values", Object.values(personClone));
```

**`webpack.config.js`**

```js
module: {
    rules: [
        {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [
                        [
                            '@babel/preset-env',
                            {
                                debug: true, // Hiển thị debug lên terminal để dễ debug
                                useBuiltIns: 'usage', // Dùng cái này thì đơn giản nhất, không cần import core-js vào code
                                corejs: '3.43.0' // nên quy định verson core-js để babel-preset-env nó hoạt động tối ưu
                            }
                        ]
                    ],
                },
            },
        },
    ],
},
```

Ngoài ra để cho thuận tiện việc tối ưu kích thước file build bạn cũng có thể dùng `useBuiltIns: 'entry'`, lúc này thì bạn phải tự tay import các tính năng
cần dùng. Ví dụ

**`index.js`**

```js
js;
import "core-js/modules/es.object.values";
import "core-js/modules/es.promise";

import sum from "./utils";

console.log(sum(100, 10));

// ES6 Spread Operator
const person = { name: "Duoc" };
const personClone = { ...person };
console.log("personClone", personClone);

// ES7 Object.values
console.log("Object.values", Object.values(personClone));
```
