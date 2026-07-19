const express = require('express');
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  patchTaskComplete,
  deleteTask,
} = require('../controllers/taskController');
const { validateTask, handleValidationErrors } = require('../validators/validators');

const router = express.Router();

router.route('/')
  .post(validateTask, handleValidationErrors, createTask)
  .get(getTasks);

router.route('/:id')
  .get(getTaskById)
  .put(validateTask, handleValidationErrors, updateTask)
  .delete(deleteTask);

router.patch('/:id/complete', patchTaskComplete);

module.exports = router;
