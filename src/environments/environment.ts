export const environment = {
  production: true,
  main_url: 'https://cloud.aydo.ai',
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
    enabled: false,
    sitekey: '6LdtzYYqAAAAANtcIGe3hHHksnciNfFxHVKX7Y0r'
  }
};
