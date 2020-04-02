const validUrl = require('valid-url');

module.exports = function (longUrl) {

  /**
   * leaving this in for educational purposes
   * let parsedUrl = url.parse(longUrl)
   * if (parsedUrl.protocol === null || parsedUrl.host === null) {
   */

  if (!longUrl || longUrl === '' || !validUrl.isUri(longUrl)) {
    const err = new Error({
      statusCode: 400,
      message: 'URL is required or is not valid.',
    });
    return Promise.reject(err);
  }
  return Promise.resolve(longUrl);
};
