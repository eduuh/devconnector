const express = require('express');
const auth = require('../../middleware/auth');
const Profile = require('../../models/profile');
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');

const router = express.Router();

// @route    GET api/profile/me
// @desc     Get Current users profile
// @access   Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ('name', 'avator')
    );

    if (!profile) {
      return res
        .status(400)
        .json({ msg: 'There is no profiles for this user' });
    }

    res.json(profile);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server error');
  }
});

// @route    Create api/profile/me
// @desc     Create a Profile
// @access   Private

router.post('/me', [
  auth,
  [
    check('status', 'Status is required').not().isEmpty(),
    check('skills', 'Skills is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    const profilefields = {};
    profilefields.user = req.user.id;
    if (company) profilefields.company = company;
    if (website) profilefields.website = website;
    if (location) profilefields.location = location;
    if (bio) profilefields.bio = bio;
    if (status) profilefields.status = status;
    if (githubusername) profilefields.githubusername = githubusername;
    if (skills) {
      profilefields.skills = skills.split(',').map((skill) => skill.trim());
    }
    profilefields.social = {};
    if (youtube) profilefields.social.youtube = youtube;
    if (twitter) profilefields.social.twitter = twitter;
    if (facebook) profilefields.social.facebook = facebook;
    if (instagram) profilefields.social.instagram = instagram;
    if (linkedin) profilefields.social.linkedin = linkedin;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        // udate
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profilefields },
          {
            new: true,
            useFindAndModify: false,
          }
        );

        return res.json(profile);
      }

      // create
      profile = new Profile(profilefields);

      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.statu(500).send('Server Error');
    }
    res.send('hello');
  },
]);

module.exports = router;
