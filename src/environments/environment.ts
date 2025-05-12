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
    appId: '074e5d5a-7a8c-4c02-8945-d81e5a6c82d5',
  },
};
