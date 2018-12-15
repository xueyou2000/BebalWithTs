import * as path from 'path';
import * as Webpack from 'webpack';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as CopyWebpackPlugin from 'copy-webpack-plugin';
import * as CleanWebpackPlugin from 'clean-webpack-plugin';
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';
import * as ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import * as FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin';
import * as OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

import { BasicConfiguration, ConfigurationFactory, WebpackBuildEnvironmentEnum, IEnvironmentConfiguration } from './Properties';

export default (nodeEnv: { env: WebpackBuildEnvironmentEnum }) => {

    if (!nodeEnv) { throw new Error('Must specify param env'); }

    const devMode = nodeEnv.env === WebpackBuildEnvironmentEnum.prod;
    const config = ConfigurationFactory(nodeEnv.env);

    const webpackConfig: Webpack.Configuration = {
        entry: './src/main.ts',
        output: {
            path: BasicConfiguration.output,
            filename: config.filename,
            publicPath: config.assetsPublicPath
        },
        devtool: config.devtool,
        mode: devMode ? 'development' : 'production',
        resolve: {
            extensions: ['.js', '.ts'],
            alias: { '@': path.join(__dirname, '../src') },
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    include: [/src/],
                    loader: 'babel-loader'
                },
                {
                    test: /\.ts$/,
                    include: [/src/],
                    use: [
                        'babel-loader',
                        {
                            loader: 'ts-loader',
                            options: {
                                transpileOnly: true,
                                experimentalWatchApi: true,
                            },
                        }
                    ]
                },
                {
                    test: /\.css$/,
                    loaders: devMode
                        ? ["style-loader", "css-loader"]
                        : [MiniCssExtractPlugin.loader, 'css-loader']
                },
                {
                    test: /\.scss$/,
                    include: [/src/],
                    loaders: devMode
                        ? ['style-loader', 'css-loader', 'sass-loader']
                        : [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
                },
                {
                    test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: 'images/[name].[hash:7].[ext]'
                    }
                },
                {
                    test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: 'media/[name].[hash:7].[ext]'
                    }
                },
                {
                    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: 'fonts/[name].[hash:7].[ext]'
                    }
                }
            ],
        },
        optimization: {
            removeEmptyChunks: true,
            removeAvailableModules: false,
            minimize: nodeEnv.env === WebpackBuildEnvironmentEnum.prod,
        },
        plugins: GetPlugins(devMode, config),
    };

    return webpackConfig;
};

/**
 * 获取Webpack插件
 * @param devMode 是否开发模式
 * @param config 配置
 */
function GetPlugins(devMode: boolean, config: IEnvironmentConfiguration) {
    let plugins = [WebpackVariablePlugin(config)];

    plugins = plugins.concat(
        new ForkTsCheckerWebpackPlugin(),
        new CopyWebpackPlugin([{ from: path.resolve(__dirname, '../static/**/*'), to: path.resolve(__dirname, BasicConfiguration.output) }]),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            inject: true,
            title: 'babel7 + ts模板',
            assetsPublicPath: config.assetsPublicPath,
        }),
    );

    if (devMode) {
        plugins = plugins.concat(
            new Webpack.HotModuleReplacementPlugin(),
            new FriendlyErrorsWebpackPlugin(),
        );
    } else {
        plugins = plugins.concat(
            new CleanWebpackPlugin(BasicConfiguration.output, { root: path.resolve(__dirname, '../') }),
            new MiniCssExtractPlugin({ filename: 'css/[name].css' }),
            new OptimizeCSSAssetsPlugin(),
            new Webpack.optimize.ModuleConcatenationPlugin(),
            new BundleAnalyzerPlugin(),
        );
    }

    return plugins;
}

/**
 * 创建webpack变量插件
 * @param {*} generic 
 * @param {*} config 
 */
function WebpackVariablePlugin(config: IEnvironmentConfiguration) {
    const variable: any = {};
    for (let variableName in BasicConfiguration.variable) {
        variable[`process.env.${variableName}`] = JSON.stringify(BasicConfiguration.variable[variableName]);
    }
    for (let variableName in config.variable) {
        variable[`process.env.${variableName}`] = JSON.stringify(config.variable[variableName]);
    }
    return new Webpack.DefinePlugin(variable);
}