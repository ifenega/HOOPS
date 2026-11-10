import type { ExpoConfig, ConfigContext } from 'expo/config';

import APP from './app.identity.json';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: APP.displayName,
  slug: APP.slug,
  scheme: APP.scheme,
  version: '0.1.0',
  orientation: 'default',
  userInterfaceStyle: 'dark',
  ios: {
    bundleIdentifier: APP.bundleId,
    supportsTablet: true,
  },
  android: {
    package: APP.bundleId,
  },
  plugins: [
    'expo-router',
    [
      'expo-font',
      {
        fonts: [
          './assets/fonts/DSEG7Classic-Bold.ttf',
          './assets/fonts/DSEG7ClassicMini-Bold.ttf',
        ],
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
});
