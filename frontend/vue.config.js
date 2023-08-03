const { defineConfig } = require('@vue/cli-service');
const CompressionPlugin = require('compression-webpack-plugin');
const path = require('path');
module.exports = defineConfig({
    transpileDependencies: true,
    chainWebpack: (config) => {
        const types = ['vue-modules', 'vue', 'normal-modules', 'normal'];
        types.forEach((type) => addStyleResource(config.module.rule('stylus').oneOf(type)));
        config.plugin('CompressionPlugin').use(CompressionPlugin);
    },
    pluginOptions: {
        'style-resources-loader': {
            preProcessor: 'sass',
            patterns: [path.resolve(__dirname, '@/assets/style/mixin.scss')],
        },
    },
    devServer: {
        host: '0.0.0.0',
        port: '8080',
        proxy: {
            '/api': {
                historyApiFallback: true,
                target: 'https://dev.thybanker.com',
                ws: false,
                changeOrigin: true,
            },
        },
        open: true,
    },
});

function addStyleResource(rule) {
    rule
        .use('style-resource')
        .loader('style-resources-loader')
        .options({
            patterns: [path.resolve(__dirname, '@/assets/style/constant.scss'), path.resolve(__dirname, '@/assets/style/mixin.scss')],
        });
}