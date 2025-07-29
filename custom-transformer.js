const upstreamTransformer = require("metro-react-native-babel-transformer");

module.exports.transform = function ({ src, filename, options }) {
  // This logs whenever a file is read and passed through the transformer.
  console.log("[TRANSFORMER] Loaded file:", filename);

  return upstreamTransformer.transform({ src, filename, options });
};
