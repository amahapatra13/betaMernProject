const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')

//@route GET api/auth
//@desc TEST route
//access (public)
router.get('/', auth ,(req,res) => {
    console.log(req.body);
    res.send("auth route");
});

module.exports = router;