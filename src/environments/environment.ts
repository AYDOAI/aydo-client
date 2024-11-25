export const environment = {
  production: true,
  main_url: 'https://app.aydo.ai',
  index_url: '/stream',
  log: {
    backend: {
      request: {
        register: true
      },
      response: {
        register: true
      }
    }
  },
  recaptcha: {
    enabled: false,
    sitekey: ''
  }
};
