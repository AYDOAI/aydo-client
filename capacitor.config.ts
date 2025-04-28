import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ai.aydo.app',
  appName: 'AYDO',
  webDir: 'www',
  cordova: {
    preferences: {
      OverrideUserAgent: 'Mozilla/5.0 Google',
    },
  },
  server: {
    hostname: 'app.aydo.ai',
    androidScheme: 'https',
    iosScheme: 'https',
    cleartext: true,
  },
  android: {
    includePlugins: [
      '@capacitor-mlkit/barcode-scanning',
      '@capacitor-community/apple-sign-in',
      '@capacitor/app',
      '@capacitor/clipboard',
      '@capacitor/network',
      '@capacitor/status-bar',
      '@capgo/capacitor-navigation-bar',
      'cordova-plugin-inappbrowser',
      '@capacitor/geolocation',
      '@capacitor/camera',
    ],
  },
  // server: {
  //   url: 'http://localhost:8100',
  //   cleartext: true,
  //   androidScheme: 'http',
  //   allowNavigation: []
  // }
};

export default config;
