import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aydo.app',
  appName: 'client',
  webDir: 'www',
  cordova: {
    preferences: {
      OverrideUserAgent: "Mozilla/5.0 Google"
    }
  },
};

export default config;
