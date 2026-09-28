function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.issues.map((issue) => issue.message);
      return res.status(400).json({ errors });
    }
    req.body = result.data; // cleaned, validated data
    next();
  };
}

module.exports = validate;