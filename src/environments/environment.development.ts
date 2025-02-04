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
    enabled: true,
    sitekey: '6LcYVcwqAAAAANDTqslUO6p56x0GFwpShumh77kM',
  },
};
