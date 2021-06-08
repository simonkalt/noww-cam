module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    node: {
      fs: empty,
      net: empty,
      tls: empty
    }
  };
};
