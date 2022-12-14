module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins:
    [
      'react-native-reanimated/plugin',
      ["react-native-platform-specific-extensions", {
        "extensions": ["css", "scss", "sass"],
      }]
    ]

  };
};
