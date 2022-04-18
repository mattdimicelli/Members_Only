const express = require('express');
const { homeGet, createPostGet, createPostPost } = require('../controllers/postsController.js');
const router = express.Router();

/* GET req to READ Posts home page */
router.get('/', homeGet);
router.get('/create-post', createPostGet);
router.post('/create-post', createPostPost);

module.exports = router;