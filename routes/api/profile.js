const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')
const { check,validationResult } = require('express-validator');

const Profile = require('../../models/Profile')
const User = require('../../models/Users')

//@route GET api/profile/me
//@desc get current users profile
//access (private)
router.get('/me', auth ,async (req,res) => {
    try{
        const profile = await Profile.findOne({ user : req.user.id}).populate('user', ['name' , 'avatar']);

        if(!profile){
            return res.status(400).json({ msg : 'There is no profle under this name'});
        }
    }catch(err){
        console.log(err.message);
        res.status(500).send('server error')
    }
});

//@route POST api/profile
//@desc Create or update user profile
//access (private)
router.post('/' , [auth, [
    check('status' , 'Status is required').not().isEmpty(),
    check('skills' , 'Skills is required').not().isEmpty()
]] , async(req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()})
    }

    const {
        company,
        website,
        location,
        status,
        skills,
        bio,
        githubusername,
        youtube,
        twitter,
        facebook,
        linkedin,
        instagram       
    } = req.body

    //Build profile object
    const profileFields = {}
    profileFields.user = req.user.id;
    if(company) profileFields.company = company
    if(website) profileFields.website = website
    if(location) profileFields.location = location
    if(status) profileFields.status = status
    if(bio) profileFields.bio = bio
    if(githubusername) profileFields.githubusername = githubusername
    if(skills) {
        profileFields.skills = skills.split(',').map(skill => skill.trim());
    }
    //Build social object 
    profileFields.social = {}
    if(twitter) profileFields.social.twitter = twitter;
    if(youtube) profileFields.social.youtube = youtube;
    if(facebook) profileFields.social.facebook = facebook;
    if(linkedin) profileFields.social.linkedin = linkedin;
    if(instagram) profileFields.social.instagram = instagram;

    try{

        let profile = await Profile.findOne({ user : req.user.id});
        if(profile){
            //Update
            profile = await Profile.findOneAndUpdate (
                { user : req.user.id }, 
                { $set : profileFields },
                { new : true }
            )
            return res.json(profile)
        }

        //Create
        profile = new Profile(profileFields);

        await profile.save();
        return res.json(profile);
    } catch(err){
        console.log(err.message);
        res.status(500).send('Server Error')
    }
    res.send('Hello')
})


//@route GET api/profile
//@desc get the profiles
//access (private)

router.get('/', async (req,res) => {
    try {

        const profiles = await Profile.find().populate('user', ['name','avatar'])
        res.json(profiles)
        
    } catch (err) {
        console.log(err.message)
        res.status(500).send('server error')
    }
})

//@route GET api/profile/user/:user_id
//@desc get the profile by id
//access public

router.get('/user/:user_id', async (req,res) => {
    try {

        const profile = await Profile.findOne({ user : req.params.user_id}).populate('user', ['name','avatar'])
        if(!profile){
            return res.status(400).json({ msg: 'There is no profile for this id'})
        }
        res.json(profile)
        
    } catch (err) {
        console.log(err.message)
        if(err.kind == 'ObjectId'){
            return res.status(400).json({ msg: 'There is no profile for this id'})
        }
        res.status(500).send('server error')
    }
})

module.exports = router;