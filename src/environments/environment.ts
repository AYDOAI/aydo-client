export const environment = {
  production: true,
  // main_url: 'https://app.aydo.ai',
  main_url: 'http://localhost:3000',
  index_url: '/streams',
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
    enabled: true,
    sitekey: '6LdtzYYqAAAAANtcIGe3hHHksnciNfFxHVKX7Y0r'
  }
};
