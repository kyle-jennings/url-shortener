module.exports = (statusCode, message) => {
  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    statusCode: statusCode,
    body: { message },
  }
}