const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/User')


 async function Protect(req, res, next) {
  // Get token from the header
  const token = req.header('x-auth-token');
  // check of no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, config.get('JwtSecret'));
    req.user =  await User.findById(decoded.user.id)
    next();
  } catch (e) {

    console.log(e);
    /* hande error */
    res.status(401).json({msg: 'Token is not found'});
  }
};

module.exports = Protect;