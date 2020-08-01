const valid = (schema, req) => (
  Promise.resolve(schema.validate(req.body))
    .then(({ error }) => (error === undefined) ? '' : Promise.reject(error))
);

module.exports = valid;
