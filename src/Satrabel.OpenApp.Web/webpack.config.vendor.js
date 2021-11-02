const path = require("path");
const webpack = require("webpack");

module.exports = (env) => {
    const isProdBuild = (env && env.prod) || (process.env.NODE_ENV && process.env.NODE_ENV.trim() === "production");
    const isDevBuild = !isProdBuild;
    const TerserPlugin = require("terser-webpack-plugin");
    const MiniCssExtractPlugin = require("mini-css-extract-plugin");
    //const VueLoaderPlugin = require('vue-loader/lib/plugin');
    const extractCss = new MiniCssExtractPlugin({filename:'vendor.css'});

    return [{
        mode: JSON.stringify(isDevBuild ? "development" : "production"),
        stats: { modules: false },
        resolve: { extensions: [".js"] },
        entry: {
            vendor: [
                "event-source-polyfill",
                "element-ui",
                "!style-loader!css-loader!element-ui/lib/theme-chalk/index.css",
                "vue",
                "vue-router"
            ],
        },
        module: {
            rules: [
                {
                    test: /\.css(\?|$)/,
                    use: [MiniCssExtractPlugin.loader, 'css-loader']
                },
                { test: /\.(png|woff|woff2|eot|ttf|svg)(\?|$)/, use: "url-loader?limit=100000" }
            ]
        },
        output: {
            path: path.join(__dirname, "Views", "dist"),
            publicPath: "dist/",
            filename: "[name].js",
            library: "[name]_[hash]"
        },
        plugins: [
            extractCss,
            //new VueLoaderPlugin(),
            new webpack.DllPlugin({
                path: path.join(__dirname, "Views", "dist", "[name]-manifest.json"),
                name: "[name]_[hash]"
            })
        ],
        devtool: (isDevBuild ? 'source-map' : 'hidden-source-map' ),
        optimization: {
            minimizer: isDevBuild
                ? []
                : [new TerserPlugin()] // https://github.com/webpack-contrib/terser-webpack-plugin
        }
    }];
};
