const express = require('express');
const router = express.Router();
const {
  getSprints,
  createSprint,
  updateSprint,
  deleteSprint
} = require('../controllers/sprintController');

router.route('/')
  .get(getSprints)
  .post(createSprint);

router.route('/:id')
  .put(updateSprint)
  .delete(deleteSprint);

module.exports = router;
