const { validationResult } = require('express-validator');

const validator = (req, validations = []) => {

  // 👉 CASE 1: Route-based (no validations passed)
  if (!validations || validations.length === 0) {
    const result = validationResult(req);

    if (result.isEmpty()) return {};

    const messages = {};
    result.array({ onlyFirstError: true }).forEach(error => {
      messages[error.path] = error.msg;
    });

    return messages;
  }

  // 👉 CASE 2: Multer/controller-based (validations passed)
  // return a promise (but controller must await in this case)
  return (async () => {

    for (const validation of validations) {
      await validation.run(req);
    }

    const result = validationResult(req);

    if (result.isEmpty()) return {};

    const messages = {};
    result.array({ onlyFirstError: true }).forEach(error => {
      messages[error.path] = error.msg;
    });

    return messages;

  })();
};

module.exports = { validator };