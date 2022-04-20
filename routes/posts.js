const express = require('express');
const { homeGet, createPostGet, createPostPost, deletePostPost } = require('../controllers/postsController.js');
const router = express.Router();

/* GET req to READ Posts home page */
router.get('/', homeGet);
router.get('/create-post', createPostGet);
router.post('/create-post', createPostPost);
router.post('/delete/:id', deletePostPost);

module.exports = router;