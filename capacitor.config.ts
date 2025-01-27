import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aydo.app',
  appName: 'AYDO',
  webDir: 'www',
  cordova: {
    preferences: {
      OverrideUserAgent: "Mozilla/5.0 Google"
    }
  },
  "server": {
    "cleartext": true
  }
  // server: {
  //   url: 'http://localhost:8100',
  //   cleartext: true,
  //   androidScheme: 'http',
  //   allowNavigation: []
  // }
};

export default config;
