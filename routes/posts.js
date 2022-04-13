const express = require('express');
const { homeGet } = require('../controllers/postsController.js');
const router = express.Router();

/* GET req to READ Posts home page */
router.get('/', homeGet);

module.exports = router;