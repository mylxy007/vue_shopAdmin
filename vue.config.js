module.exports = {
    pages: {
        index: {
            // page 的入口
            entry: 'src/main.js',
        },
    },
    lintOnSave: false,
    devServer: {
        overlay: {
            warnings: true,
            errors: true
        }
    }
}