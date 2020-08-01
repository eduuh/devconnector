const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

const User = require('../../models/User');

// @route    GET api/user
// @desc     Test route
// @accecc   Public
router.get('/', (req, res) => {
  res.send('user route');
});

router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more character'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ errors: error.array() });
    }
    const { name, email, password } = req.body;

    try {
      //See if user exist
      let user = await User.findOne({ email }); //Get users gravators

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exist' }] });
      }

      const avator = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mn',
      });

      user = new User({
        name,
        email,
        avator,
        password,
      });
      //Encrpt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      //Return jsonwebtoken
      //console.log(req.body);
      res.json('user registered');
    } catch (err) {
      console.log(err.message);
      res.status(500).send('server error');
    }
  }
);

module.exports = router;
