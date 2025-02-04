export const environment = {
  production: false,
  main_url: 'https://cloud.test.aydo.ai',
  index_url: '/streams',
  log: {
    backend: {
      request: {
        register: true,
      },
      response: {
        register: true,
      },
    },
  },
  recaptcha: {
    enabled: true,
    sitekey: '6LdJSMwqAAAAAPgh9fGCUIWxh_rQIElXVrXlX1Df',
  },
};
