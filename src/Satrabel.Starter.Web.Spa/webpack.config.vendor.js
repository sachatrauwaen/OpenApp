const path = require("path");
const webpack = require("webpack");

module.exports = (env) => {
    const isProdBuild = (env && env.prod) || (process.env.NODE_ENV && process.env.NODE_ENV.trim() === "production");
    const isDevBuild = !isProdBuild;
    const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
    const MiniCssExtractPlugin = require("mini-css-extract-plugin");
    //const VueLoaderPlugin = require('vue-loader/lib/plugin');

    const extractCSS = new MiniCssExtractPlugin("vendor.css");

    return [{
        stats: { modules: false },
        resolve: { extensions: [ ".js" ] },
        entry: {
            vendor: [
                "event-source-polyfill",
                "element-ui",
                "!style-loader!css-loader!element-ui/lib/theme-chalk/index.css",
                "vue",
                "vue-router",
                //'axios',
                "vue-class-component",
                "vue-property-decorator"
            ],
        },
        module: {
            rules: [
                { test: /\.tsx?$/, use: [ "babel-loader", "ts-loader" ] }, 
                {
                    test: /\.css(\?|$)/,
                    use: [MiniCssExtractPlugin.loader, isDevBuild ? "css-loader" : "css-loader?minimize"]
                },
                { test: /\.(png|woff|woff2|eot|ttf|svg)(\?|$)/, use: "url-loader?limit=100000" }
            ]
        },
        output: {
            path: path.join(__dirname, "wwwroot", "dist"),
            publicPath: "dist/",
            filename: "[name].js",
            library: "[name]_[hash]"
        },
        plugins: [
            extractCSS,
            //new VueLoaderPlugin(),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': isDevBuild ? '"development"' : '"production"'
            }),
            new webpack.DllPlugin({
                path: path.join(__dirname, "wwwroot", "dist", "[name]-manifest.json"),
                name: "[name]_[hash]"
            })
        ],
        optimization: {
            minimizer: isDevBuild
                ? []
                : [
                    // we specify a custom UglifyJsPlugin here to get source maps in production
                    new UglifyJsPlugin({
                        cache: true,
                        parallel: true,
                        uglifyOptions: {
                            compress: false,
                            mangle: true
                        },
                        sourceMap: true
                    })
                ]
        }
    }];
};
