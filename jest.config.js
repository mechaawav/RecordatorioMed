module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|unimodules|unimodules-.*|sentry-expo|native-base|react-native-svg)"
  ],
  testEnvironment: "node",
  collectCoverageFrom: [
    "**/*.{js,jsx}",
    "!**/__tests__/**",
    "!**/node_modules/**",
    "!**/.expo/**",
  ],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/.expo/",
  ],
};