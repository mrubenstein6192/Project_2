module.exports = promise => promise
  .then(response => [null, response])
  .catch(err => [err, null]);
