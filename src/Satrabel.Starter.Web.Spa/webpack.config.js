/// <binding />
const path = require("path");
const webpack = require("webpack");

const bundleOutputDir = "./wwwroot/dist";


module.exports = (env) => {
    const isProdBuild = (env && env.prod) || (process.env.NODE_ENV && process.env.NODE_ENV.trim() === "production");
    const isDevBuild = !isProdBuild;
    const TerserPlugin = require("terser-webpack-plugin");
    const MiniCssExtractPlugin = require("mini-css-extract-plugin");
    const VueLoaderPlugin = require('vue-loader/lib/plugin');

    // https://webpack.js.org/api/logging/
    //const logging = require('webpack/lib/logging/runtime');
    //const logger = logging.getLogger();
    //logger.warn('isDevBuild:', isDevBuild);

    return [{
        mode: JSON.stringify(isDevBuild ? "development" : "production"),
        stats: { modules: false },
        context: __dirname,
        resolve: {
            extensions: [".js", ".ts", ".tsx"],
            symlinks: false
        },
        entry: {
            'home': "./ClientApp/home/boot.ts",
            'demo1': "./ClientApp/demo1/boot.ts"
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    include: /ClientApp/,
                    exclude: /node_modules|vue\/src/,
                    loader: "ts-loader",
                    options: {
                        appendTsSuffixTo: [/\.vue$/]
                    }
                },
                {
                    test: /\.vue$/,
                    include: /ClientApp/,
                    loader: "vue-loader",
                    options: {
                        esModule: true,
                        extractCSS: !isDevBuild
                    }
                },
                {
                    test: /\.js$/,
                    loader: "babel-loader",
                    exclude: /node_modules/
                },
                {
                    test: /\.css$/,
                    use: isDevBuild
                        ? ["style-loader", "css-loader"]
                        : [MiniCssExtractPlugin.loader,  "css-loader?minimize"]
                },
                { test: /\.(png|jpg|jpeg|gif|svg|ttf|eot|woff|woff2|gif)$/, use: "url-loader?limit=25000" }
            ]
        },
        output: {
            path: path.join(__dirname, bundleOutputDir),
            filename: "[name].js",
            publicPath: "dist/"
        },
        plugins: [
            new webpack.WatchIgnorePlugin([
                /css\.d\.ts$/
            ]),
            new VueLoaderPlugin(),
            new webpack.DllReferencePlugin({
                context: __dirname,
                manifest: require("./wwwroot/dist/vendor-manifest.json")
            })
        ].concat(isDevBuild
            ? [
                // Plugins that apply in development builds only
                new webpack.SourceMapDevToolPlugin({
                    filename: "[file].map", // Remove this line if you prefer inline source maps
                    moduleFilenameTemplate: path.relative(bundleOutputDir, "[resourcePath]") // Point sourcemap entries to the original file locations on disk
                })
            ]
            : [
                // Plugins that apply in production builds only
                new MiniCssExtractPlugin({
                    filename: "[name].css"
                })
            ]),
        optimization: {
            minimizer: isDevBuild
                ? []
                : [
                    // we specify a custom TerserPlugin here to get source maps in production
                    new TerserPlugin({ sourceMap: true }) // https://github.com/webpack-contrib/terser-webpack-plugin
                ]
        }
    }];
};
