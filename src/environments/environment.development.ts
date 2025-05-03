export const environment = {
  production: false,
  main_url: 'http://127.0.0.1:3001',
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
    enabled: false,
    sitekey: '6LeHSv4qAAAAAKEmgiX4l80dM0F7QirDAJr83ZDu',
  },
  onesignal: {
    appId: '',
  },
};
