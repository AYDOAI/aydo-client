export const environment = {
  production: true,
  main_url: 'https://cloud.aydo.ai',
  platform: (window as any)['__env']?.platform || 'web',
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
    enabled: true,
    sitekey: '6Lcbk8wqAAAAAFDW62c0DKFtcGfC1EUfmoGgKqUS',
  },
  onesignal: {
    appId: '',
  },
};
