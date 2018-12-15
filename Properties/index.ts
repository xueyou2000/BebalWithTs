import * as path from 'path';
import * as Webpack from 'webpack';
import * as Package from '../package.json';
import devFactory from './dev';
import prodFactory from './prod';

// 编译输出路径
const output = path.join(__dirname, '../dist');

/**
 * 编译环境枚举
 */
export enum WebpackBuildEnvironmentEnum {
    /**
     * 开发环境
     */
    dev = 'dev',
    /**
     * 生产环境
     */
    prod = 'prod',
}

/**
 * 环境配置
 * @description	不同环境不同配置
 */
export interface IEnvironmentConfiguration {
    /**
     * 资源路径前缀
     */
    assetsPublicPath: string;
    /**
     * 输出文件名
     */
    filename: string;
    /**
     * 输出chunk名
     */
    chunkFilename: string;
    /**
     * 生成map方式
     */
    devtool: Webpack.Options.Devtool;
    /**
     * 开发服务器配置
     */
    devServer: any;
    /**
     * 运行变量
     */
    variable: { [key: string]: string };
}

/**
 * 基本配置接口
 */
export interface IBasicConfiguration {
    /**
     * 输出路径
     */
    output: string;
    /**
     * 通用运行变量
     */
    variable: { [key: string]: string };
}

/**
 * 配置工厂函数
 */
export type ConfigurationFactoryType = (config: IBasicConfiguration) => IEnvironmentConfiguration;

/**
 * 基础配置
 */
export const BasicConfiguration: IBasicConfiguration = {
    /**
     * 输出路径
     */
    output,
    /**
     * 通用运行变量
     */
    variable: {
        Version: Package.version,
    },
};

/**
 * 创建编译配置
 * @param env 编译环境
 */
export function ConfigurationFactory(env: WebpackBuildEnvironmentEnum): IEnvironmentConfiguration {

    if (!env) { throw new Error(`undefind params env`); }

    switch (env) {
        case WebpackBuildEnvironmentEnum.dev:
            return devFactory(BasicConfiguration);
        case WebpackBuildEnvironmentEnum.prod:
            return prodFactory(BasicConfiguration);
        default:
            throw new Error('invalid env params, must be WebpackBuildEnvironmentEnum Type');
    }

}