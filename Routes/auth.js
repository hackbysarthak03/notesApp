const express = require('express');
const router = express.Router();
const User = require('../Database/Models/User');
const {body, validationResult} = require('express-validator')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const getUserData = require('../Middleware/getUserData')


// Creating a New User in Notebook Application

router.post('/signup',
    // Acting a middleware to check the Errors
[
    body('email', 'Enter a Valid Email Address').isEmail(),
    body('name', 'Enter Valid Name with min 3 characters').isLength({min:3}),
    body('password', 'Enter a Valid Passwor with min 6 characters').isLength({min:6})
], async (req, res)=>{

    let success = true;

    // If Error happens
    const error = validationResult(req);
    if(!error.isEmpty()){
        success = false
        return res.status(400).json({success});
    }

    // Trying this
    try{
    
    const salt = await bcrypt.genSalt(10);
    const pass = await bcrypt.hash(req.body.password, salt);
    const user = await User.create({
        name:req.body.name,
        email:req.body.email,
        password:pass
    });

    // Saving the User
    await user.save();
    success = true
    res.send({success})
    

    }catch(err){
        success = false
        res.send({success})
    }
})


// Signing In a Registered User

router.post('/signin',[
    body('email').isEmail(),
    body('password').isLength({min:6})
],async (req, res) => {
    let success = true
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({error:error.array()});
    }

    try{

    const {email, password} = req.body;
    const user = await User.findOne({email:email});
    if(!user){
        success=false
        return res.status(400).json({success, error:'Invalid Credentials'});
    }

    const pass = bcrypt.compare(password, user.password);
    if(!pass){
        success=false
        return res.status(400).json({success, error:'Invalid Credentials'});
    }

    const SECRET_KEY = 'heyiamlearningmerndevelopementusingcodewitharry';
    const data = {
        user :{
            id:user.id
        }
    }
    const authToken = await jwt.sign(data, SECRET_KEY);
    res.json({success, authToken});

}catch(err){
    console.log('Internal Server Error');
}
})


// Getting the User details which is logged in

router.post('/getuser', getUserData, async (req, res) => {
    const user = await User.findOne({_id:req.user.id}).select('-password');
    res.json(user);
})



module.exports = router;