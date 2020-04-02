const ignoreThese = ['_admin'];

module.exports = function (key) {
  return !ignoreThese.some(x => key.indexOf(x) === 0);
};
