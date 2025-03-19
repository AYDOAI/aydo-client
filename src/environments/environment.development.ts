export const environment = {
  production: false,
  main_url: 'http://192.168.88.113:3001',
  index_url: '/dashboard',
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
