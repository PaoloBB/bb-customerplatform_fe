const environment = {
  development: {
    apiProtocol: 'http',
    isProduction: false,
    assetsPath: `http://${process.env.HOST || 'localhost'}:${+process.env.PORT + 1 || 3001}/dist/`
  },
  production: {
    apiProtocol: 'https',
    isProduction: true,
    assetsPath: '/dist/'
  }
}[process.env.NODE_ENV || 'development'];

module.exports = Object.assign(
  {
    host: process.env.HOST || 'localhost',
    port: process.env.PORT,
    apiHost: process.env.APIHOST || 'localhost',
    apiPort: process.env.APIPORT,
    app: {
      title: 'BrandBastion Customer Platform',
      description: '',
      head: {
        meta: [
          { name: 'description', content: 'Entry point for all BrandBastion services' },
          { charset: 'utf-8' },
          { property: 'og:site_name', content: 'BrandBastion Customer Platform' },
          { property: 'og:image', content: '' },
          { property: 'og:locale', content: 'en_US' },
          { property: 'og:title', content: 'BrandBastion Customer Platform' },
          { property: 'og:description', content: 'Entry point for all BrandBastion services' },
          { property: 'og:image:width', content: '200' },
          { property: 'og:image:height', content: '200' }
        ]
      }
    }
  },
  environment
);
