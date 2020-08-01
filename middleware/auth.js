const expressJwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const jwtCheck = expressJwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://ladyymendez.us.auth0.com/.well-known/jwks.json'
  }),
  audience: 'shop',
  issuer: 'https://ladyymendez.us.auth0.com/',
  algorithms: ['RS256']
});

module.exports = { jwtCheck };
