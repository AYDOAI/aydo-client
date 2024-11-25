export const environment = {
    production: false,
    main_url: 'http://192.168.1.14:3000',
    index_url: '/stream',
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
        enabled: true,
        sitekey: '6LdtzYYqAAAAANtcIGe3hHHksnciNfFxHVKX7Y0r'
    }
};
