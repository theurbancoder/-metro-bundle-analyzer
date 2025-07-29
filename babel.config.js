module.exports = function (api) {
  api.cache(true);

  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "./log-file-plugin.js", // path to your plugin
    ],
  };
};
