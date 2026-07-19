const { check, validationResult } = require('express-validator');

const validateRegister = [
  check('name', 'Name is required').notEmpty().trim(),
  check('email', 'Please include a valid email address').isEmail().normalizeEmail(),
  check('password', 'Password must be at least 6 characters and contain a number')
    .isLength({ min: 6 })
    .matches(/\d/)
    .withMessage('Password must contain at least one number'),
  check('confirmPassword', 'Confirm password field is required').notEmpty(),
  check('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  }),
];

const validateLogin = [
  check('email', 'Please include a valid email address').isEmail().normalizeEmail(),
  check('password', 'Password is required').notEmpty(),
];

const validateTask = [
  check('title', 'Task title is required').notEmpty().trim().isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
  check('description', 'Description cannot exceed 500 characters').optional({ checkFalsy: true }).isLength({ max: 500 }).trim(),
  check('deadline', 'Deadline is required and must be a valid ISO8601 date').notEmpty().isISO8601(),
  check('priority', 'Priority must be High, Medium, or Low').optional().isIn(['High', 'Medium', 'Low']),
  check('category', 'Category must be Work, Personal, Study, Shopping, Health, or Others').optional().isIn(['Work', 'Personal', 'Study', 'Shopping', 'Health', 'Others']),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg, // Return the first error as a user-friendly message
      errors: errors.array()
    });
  }
  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateTask,
  handleValidationErrors,
};
