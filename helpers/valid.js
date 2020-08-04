const valid = (schema, req) => (
  Promise.resolve(schema.validate(req))
    .then(({ error }) => ((error === undefined) ? '' : Promise.reject(error)))
);

module.exports = valid;
