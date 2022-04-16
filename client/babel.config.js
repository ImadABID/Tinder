module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins:
    [
      'module-resolver',
      ["react-native-platform-specific-extensions", {
        "extensions": ["css", "scss", "sass"],
      }],
      'react-native-reanimated/plugin'
    ]

  };
};
