const Response = require('./response');
const validation = require('./validation');
const valid = require('./valid');

module.exports = {
  response: new Response(),
  validation,
  valid
};
