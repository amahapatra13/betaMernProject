const express = require('express');
const router = express.Router();
const { check,validationResult } = require('express-validator');
const User = require('../../models/Users');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');



//@route GET api/users
//@desc Register user
//access (public)
router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email','Enter a valid email').isEmail(),
    check('password','Please enter a password').isLength({ min : 6 })
], async (req,res) => {
    console.log(req.body);
    const err = validationResult(req);
    if(!err.isEmpty()) {
        return res.status(400).json({ errors : err.array() })
    }

    const { name, email, password} = req.body;
    try{

        //exitence of the user
        let user = await User.findOne({ email });
        if (user) {
          return res.status(400).json({ errors : [{ msg : "User already exists"}] });
        }

        //gravatar
        const avatar  = gravatar.url(email, {
            s : '200',
            r : 'pg',
            d : 'mm'
        })
        
        user  = new User({
            name,
            email,
            password,
            avatar
        });

        //password encryption

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user : {
                id : user.id,
            }
        }

        jwt.sign(
            payload, 
            config.get('jwt'),
            { expiresIn : 360000},
            (err,token) => {
                if(err) throw err;
                res.json({ token });
            } 
        )
    }catch(err){
        console.log(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;