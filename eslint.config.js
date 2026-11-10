const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

// The one architectural rule (spec §4): /core is pure TypeScript that could run
// in Node unchanged. It must never reach into React Native, Expo, or the app's
// platform layers (/net, /storage, /state, /ui). If a /core file needs a
// platform value, pass it in as an argument instead.
const CORE_FORBIDDEN = [
  { name: 'react-native', message: '/core must stay pure — no react-native.' },
  {
    group: [
      'react-native-*',
      'expo',
      'expo-*',
      '@/net',
      '@/net/*',
      '@/storage',
      '@/storage/*',
      '@/state',
      '@/state/*',
      '@/ui',
      '@/ui/*',
    ],
    message:
      '/core must stay pure — no platform imports. Pass platform values in as arguments.',
  },
];

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*', '.expo/*', 'node_modules/*'],
  },
  {
    files: ['src/core/**/*.ts'],
    rules: {
      'no-restricted-imports': ['error', { paths: [CORE_FORBIDDEN[0]], patterns: [CORE_FORBIDDEN[1]] }],
    },
  },
]);
