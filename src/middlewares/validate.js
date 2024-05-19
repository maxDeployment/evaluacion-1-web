export function validate(schema) {
    return (req, res, next) => {
      schema.validate(req.body)
        .then(() => next())
        .catch(err => res.status(400).send(err.errors));
    };
};
