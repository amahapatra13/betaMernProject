const express = require('express');
const router = express.Router();

//@route GET api/auth
//@desc TEST route
//access (public)
router.get('/', (req,res) => {
    console.log(req.body);
    res.send("auth route");
});

module.exports = router;