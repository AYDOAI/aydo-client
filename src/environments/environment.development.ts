export const environment = {
  production: false,
  main_url: 'http://localhost:3000',
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
    enabled: false,
    sitekey: '6Lcbk8wqAAAAAFDW62c0DKFtcGfC1EUfmoGgKqUS',
  },
};
