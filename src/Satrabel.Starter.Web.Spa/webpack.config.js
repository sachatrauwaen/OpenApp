/// <binding />
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
//const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const bundleOutputDir = './wwwroot/dist';


module.exports = (env) => {
    const isProdBuild = (env && env.prod) || (process.env.NODE_ENV && process.env.NODE_ENV.trim() ==='production');
    const isDevBuild = !isProdBuild;

    return [{
        stats: { modules: false },
        context: __dirname,
        resolve: { extensions: [ '.js', '.ts' ] },
        entry: {
            'home': './ClientApp/home/boot.ts',
            'demo1': './ClientApp/demo1/boot.ts'
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    include: /ClientApp/,
                    exclude: /node_modules|vue\/src/,
                    loader: 'ts-loader',
                    options: {
                        appendTsSuffixTo: [/\.vue$/]
                    }
                },               
                {
                    test: /\.vue$/,
                    include: /ClientApp/,
                    loader: 'vue-loader',
                    options: {
                        esModule: true,
                        extractCSS: !isDevBuild
                    }
                },
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/
                },
                //{
                //    test: /\.vue$/, include: /ClientApp/, exclude: /node_modules|vue\/src/, loader: 'vue-loader', options: {
                //        loaders: {
                //            ts: 'awesome-typescript-loader?silent=true'
                //        }
                //    }
                //},
                //{ test: /\.ts$/, include: /ClientApp/, use: 'awesome-typescript-loader?silent=true' },    
                {
                    test: /\.css$/,
                    use: isDevBuild ? ['style-loader', 'css-loader'] : ExtractTextPlugin.extract({ use: 'css-loader?minimize' })
                },
                { test: /\.(png|jpg|jpeg|gif|svg|ttf|eot|woff|woff2|gif)$/, use: 'url-loader?limit=25000' }
            ]
        },
        output: {
            path: path.join(__dirname, bundleOutputDir),
            filename: '[name].js',
            publicPath: 'dist/'
        },
        plugins: [
//            new CheckerPlugin(),
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify(isDevBuild ? 'development' : 'production')
                }
            }),
            new webpack.DllReferencePlugin({
                context: __dirname,
                manifest: require('./wwwroot/dist/vendor-manifest.json')
            })
        ].concat(isDevBuild ? [
            // Plugins that apply in development builds only
            new webpack.SourceMapDevToolPlugin({
                filename: '[file].map', // Remove this line if you prefer inline source maps
                moduleFilenameTemplate: path.relative(bundleOutputDir, '[resourcePath]') // Point sourcemap entries to the original file locations on disk
            })
        ] : [
            // Plugins that apply in production builds only
            new webpack.optimize.UglifyJsPlugin(),
            //new ExtractTextPlugin('site.css')
            new ExtractTextPlugin({
                filename: '[name].css'
            })
        ])
    }];
};
