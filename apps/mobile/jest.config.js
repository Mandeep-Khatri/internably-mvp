module.exports = {
  preset: 'react-native',
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|expo(nent)?|@expo(nent)?/.*|expo-router)/)'
  ]
};
