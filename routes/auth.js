const router = require('express').Router();
const User = require('../model/User');
const { registerValidation, loginValidation } = require('../validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register',async (req,res)=>{
    ////Validate
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    ///Email check
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send('Email already exist');

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password,salt);

    ///Add new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    });
    try {
        const savedUser = await user.save();
        res.send({user: user._id});
    } catch (error) {
        res.status(400).send(error);
    }
});


////Login

router.post('/login', async (req,res) => {
    ////Validate
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    ///Email check exist
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Email is not exist');

    ///Check password
    const validPass = await bcrypt.compare(req.body.password,user.password);
    if(!validPass) return res.status(400).send('Invalid password');

    //Create and assign a token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token',token).send(token);
})

module.exports = router;