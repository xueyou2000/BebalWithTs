import { IEnvironmentConfiguration, IBasicConfiguration, ConfigurationFactoryType } from './index';

const factory: ConfigurationFactoryType = (config: IBasicConfiguration) => {

    const configuration: IEnvironmentConfiguration = {
        assetsPublicPath: `/`,
        filename: 'js/[name].js',
        chunkFilename: 'js/[name].js',
        devtool: 'eval-source-map',
        devServer: {
            port: 8180,
            hot: true,
            inline: true,
            open: true,
            quiet: true,
            contentBase: config.output,
        },
        variable: {
            NODE_ENV: 'development',
        },
    };

    return configuration;
};

export default factory;