const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WorkboxPlugin = require('workbox-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
// const ZipPlugin = require("zip-webpack-plugin");

const SERVER_URL = {
    PROD: "https://flime-balls.herokuapp.com",
    STAGE: "https://flime-balls.herokuapp.com",
    TEST: "https://test-flime-balls.herokuapp.com",
    DEV: "https://localhost:4004"
};

const gameOnlyMode = !process.env.NODE_ENV; // TODO: remove css preprocessors in this case

const isProd = process.env.NODE_ENV === "production";

// BASE_URL config
if (!!process.env.NODE_ENV && process.env.DEPLOY_VERSION) {

    if (process.env.DEPLOY_VERSION === "PROD") { // prod
        process.env.BASE_URL = SERVER_URL.PROD;
    } else if (process.env.DEPLOY_VERSION === "STAGE") { // stage
        process.env.BASE_URL = SERVER_URL.STAGE;
    } else if (process.env.DEPLOY_VERSION === "TEST") { // test
        process.env.BASE_URL = SERVER_URL.TEST;
    } else if (process.env.DEPLOY_VERSION === "DEV") { // dev
        process.env.BASE_URL = SERVER_URL.DEV;
    } else {
        console.warn("process.env.BASE_URL unknown");
    }
} else {
    process.env.BASE_URL = SERVER_URL.TEST;
}

const outputDir = "bin";
const copyAssets = [
    // {
    //     from: path.resolve(__dirname, "fbapp-config.json"),
    //     to: path.resolve(__dirname, outputDir) + "/",
    // },
    {
        from: path.resolve(__dirname, "assets"),
        to: path.resolve(__dirname, outputDir) + "/assets",
    }
]

// if (!isProd) {
//     // This only for local build
//     copyAssets.push({
//         from: path.resolve(__dirname, "mock", "auth.json"),
//         to: path.resolve(__dirname, outputDir),
//     });
// }

const config = {
    entry: {
        pepjs: "./node_modules/pepjs-improved/dist/pep.js",
        main: path.resolve(__dirname, 'src/index.ts'),
    },
    plugins: [
        new CleanWebpackPlugin(['dist', 'bin', 'zip']),
        new CopyWebpackPlugin(copyAssets),
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                    }
                ],
                exclude: /node_modules/
            },
            {
                test: /\.svg$/,
                loader: 'svg-sprite-loader'
            },
            {
                test: /\.(woff2?|ttf|otf|eot)$/,
                exclude: /node_modules/,
                loader: 'file-loader',
                options: {
                    name: '[path][name].[ext]'
                }
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.ts', '.tsx', '.css', '.scss', '.json'],
        modules: ['node_modules'],
        alias: {
            '@core': path.resolve(__dirname, 'src/core'),
            '@game': path.resolve(__dirname, 'src/game'),
        }
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'bin')
    },
    devServer: {
        port: 3004,
        hot: true,
        contentBase: './dist',
        stats: 'errors-only',
        publicPath: '/',
        open: 'Google Chrome',
        historyApiFallback: true,
        https: !gameOnlyMode
    }
};

module.exports = (env, argv) => {

    const mode = (process.env.WEBPACK_SERVER || argv.mode === undefined) ? "development" : argv.mode;
    const isDevMode = mode === "development";
    const BUILD_NUMBER = env && env.build ? env.build : null;

    config.plugins = config.plugins.concat([
        new HtmlWebpackPlugin({
            title: "Fire Balls 3D",
            debug_info: (() => {
                if (process.env.DEPLOY_VERSION === "PROD") {
                    return "";
                }
                return `<div id="debug-info" style="font-size: medium; position: absolute; right: 10px; z-index: 100">#${env && env.build} (${process.env.DEPLOY_VERSION})</div>`
            })(),
            template: path.join(__dirname, 'src/index.html'),
            inlineSource: ".(js|css)$", // embed all javascript and css inline
            hash: isProd,
            minify: {
                collapseWhitespace: isProd,
                collapseInlineTagWhitespace: isProd,
                removeComments: isProd,
                removeRedundantAttributes: isProd
            },
        }),
        new webpack.DefinePlugin({
            oimo: JSON.stringify(true),
            cannon: JSON.stringify(true),
            __DEV__: isDevMode,
            __GAME_ONLY_MODE__: gameOnlyMode,
            "process.env": {
                BASE_URL: JSON.stringify(process.env.BASE_URL),
                NODE_ENV: JSON.stringify(process.env.NODE_ENV),
                DEPLOY_VERSION: JSON.stringify(process.env.DEPLOY_VERSION),
                CLOUDINARY_CLOUD_NAME: JSON.stringify("diccodw38"),
                CLOUDINARY_UPLOAD_PRESET: JSON.stringify("hnla9egp"),
                VERSION: JSON.stringify(require('./package.json').version),
                SENTRY_DSN: JSON.stringify("https://59c56c6e0fac459a8f79feac86245c8c@sentry.io/1396551")
            },
            __BUILD_NUMBER__: JSON.stringify(BUILD_NUMBER),

        })
    ]);

    config.externals = {
        FBInstant: 'FBInstant',
        oimo: 'oimo',
        cannon: 'cannon',
    };

    if (isDevMode) {
        config.entry.fpsmeter = "./node_modules/fpsmeter";
        config.devtool = 'source-map';
        config.plugins = config.plugins.concat([
            new webpack.NoEmitOnErrorsPlugin(),
        ]);

        if (process.env.WEBPACK_SERVER) {
            config.entry[config.entry.length] = 'webpack/hot/dev-server';
            config.plugins = config.plugins.concat([
                new webpack.HotModuleReplacementPlugin(),
            ]);
        }
    } else {
        config.plugins = config.plugins.concat([
            new WorkboxPlugin.GenerateSW({
                clientsClaim: true,
                skipWaiting: true
            })
        ])
    }

    if (process.env.WEBPACK_SERVER) {
        config.module.rules[config.module.rules.length] = {
            test: /\.(sa|sc)ss$/,
            use: [{
                loader: 'style-loader'
            }, {
                loader: 'css-loader', options: {sourceMap: true}
            }, {
                loader: 'resolve-url-loader'
            }, {
                loader: 'sass-loader', options: {sourceMap: true}
            }]
        }
    } else {
        // config.plugins = config.plugins.concat([
        //     new MiniCssExtractPlugin({
        //         filename: '[name].css',
        //         chunkFilename: '[id].css',
        //     })
        // ]);
        // config.module.rules[config.module.rules.length] = {
        //     test: /\.(scss|sass)$/i,
        //     use: [
        //         MiniCssExtractPlugin.loader,
        //         {loader: 'css-loader'},
        //         {loader: 'resolve-url-loader'},
        //         {loader: 'sass-loader', options: {sourceMap: true, sourceMapContents: false}}
        //     ]
        // }
    }


    if (isProd) {
        config.plugins = config.plugins.concat([
            new webpack.optimize.ModuleConcatenationPlugin(),
            new webpack.optimize.OccurrenceOrderPlugin(),
            new UglifyJSPlugin({
                sourceMap: true,
                extractComments: true,
            }),
            // new MiniCssExtractPlugin({
            //     filename: '[hash].css',
            //     chunkFilename: '[id].[hash].css'
            // })
        ])
    }

    // if (process.env.DEPLOY_VERSION) {
    //     config.plugins.push(
    //         new ZipPlugin({
    //             filename: process.env.DEPLOY_VERSION.toLowerCase() + ".zip",
    //             path: path.join(__dirname, "zip"),
    //         })
    //     );
    // }


    return config
};
