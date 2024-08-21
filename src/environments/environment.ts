export const environment = {
  production: true,
  main_url: 'http://localhost:3000',
  // main_url: 'https://app.aydo.ai',
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
};
