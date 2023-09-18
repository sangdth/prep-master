module.exports = function Config(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
