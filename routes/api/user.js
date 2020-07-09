const express = require('express');

const router = express.Router();

// @route    GET api/user
// @desc     Test route
// @accecc   Public
router.get('/', (req, res) => res.send('User route'));

module.exports = router;
