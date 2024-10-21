// vue.config.js
module.exports = {
    pwa: {
        name: 'WareMana',
        themeColor: '#42b883',
        msTileColor: '#42b883',
        manifestOptions: {
            short_name: 'Wama',
            start_url: '.',
            display: 'standalone',
            background_color: '#ffffff'
        },
        workboxOptions: {
            skipWaiting: true,
            clientsClaim: true,
        }
    }
}
