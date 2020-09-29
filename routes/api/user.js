const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const config = require('config');
const  Protect = require('../../middleware/auth')

// @route    GET api/users
// @desc     Authenticate user and get token
// @accecc   Public


router.get('/me',Protect, (req,res)=> {
 console.log(req.user);

 res.json(req.user);
})

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
