import { IEnvironmentConfiguration, IBasicConfiguration, ConfigurationFactoryType } from './index';

const factory: ConfigurationFactoryType = (config: IBasicConfiguration) => {

    const configuration: IEnvironmentConfiguration = {
        assetsPublicPath: `/`,
        filename: 'js/[name].js',
        chunkFilename: 'js/[name].js',
        devtool: false,
        devServer: {},
        variable: {
            NODE_ENV: 'production',
        },
    };

    return configuration;
};

export default factory;