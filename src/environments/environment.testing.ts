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
    sitekey: '6Lcbk8wqAAAAAFDW62c0DKFtcGfC1EUfmoGgKqUS',
  },
};
