const express = require('express');
const auth = require('../../middleware/auth');
const router = express.Router();
const User = require('../../models/User');
const bcrypt= require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
const {check , validationResult} = require('express-validator')

// @route    GET api/auth
// @desc     Get currently Logined in user
// @accecc   Public
router.get('/', auth, async (req, res) => {
  try {
    console.log(req.user.id);
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('user not found');
  }
});


// @route    GET api/auth
// @desc     Authenticate and get token
// @accecc   Public
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Password is required'
    ).exists(),
  ],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ errors: error.array() });
    }
    const { email, password } = req.body;

    try {
      //See if user exist
      let user = await User.findOne({ email }); //Get users gravators

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }


      const isMatch = await bcrypt.compare(password,user.password)

      if(!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };
      //Return jsonwebtoken

      jwt.sign(
        payload,
        config.get('JwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send('server error');
    }
  }
);

module.exports = router;
