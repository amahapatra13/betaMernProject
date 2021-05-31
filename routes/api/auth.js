const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')
const User = require('../../models/Users')
const config = require('config')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { check,validationResult } = require('express-validator');

//@route GET api/auth
//@desc TEST route
//access (public)
router.get('/', auth ,async (req,res) => {
    try{
        const user = await User.findById(req.user.id);
        res.json(user);
    }catch(err){
        console.log(err.message)
        res.status(500).send('Server error');
    }
});

router.post('/', [
    check('email','Enter a valid email').isEmail(),
    check('password','Please is required').exists()
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
        if (!user) {
          return res.status(400).json({ errors : [{ msg : "Invalid credentials"}] });
        }
        console.log(user)
        
        const ismatch = await bcrypt.compare(password, user.password);

        if(!ismatch){
            return res
                .status(400)
                .json({ errors : [{ msg : "Invalid credentials"}] });
        }


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