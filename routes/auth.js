const { Router } = require("express");
const router = Router();
const jwt = require('jsonwebtoken');
const User = require("../models/User");
const { check, validationResult} = require("express-validator");
const bcrypt = require("bcryptjs");
const Auth = require('../middleware/auth')


router.post('/login',
[
    check("userName", "Please Enter a Valid Username")
    .not()
    .isEmpty(),
    check("password", "Please enter a valid password").isLength({
        min: 6
    })
],
async (req, res) => {

    const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

    
    const {userName, password} = req.body;

    const user = await User.find()

    if (user) {
        const accessToken = jwt.sign({userName: user.userName, role: user.role}, process.env.JWT_SECRET);
        res.status(200).json(accessToken)
    }

    res.status(400).json({message: "invalid login details"})

})


router.post('/signup', 
[
    check("userName", "Please Enter a Valid Username")
    .not()
    .isEmpty(),
    check("password", "Please enter a valid password").isLength({
        min: 6
    })
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }
    
        const {
            userName,
            password,
            role
        } = req.body;

    try 
    {
        let user = await User.findOne({
            userName
        });

        if (user) {
            return res.status(400).json({
                msg: "User Already Exists"
            });
        }

        user = new User({
            userName,
            password,
            role
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const accessToken = jwt.sign({userName: user.userName, role: user.role}, process.env.JWT_SECRET);
            res.status(201).json(accessToken)
        

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Something went wrong, we're working on it" })
    }
}

)


router.get("/me", Auth, async (req, res) => {
    try {
      // request.user is getting fetched from Middleware after token authentication
      const user = await User.findById(req.user.id);
      res.json(user);
    } catch (e) {
      res.send({ message: "Error in Fetching user" });
    }
  });


module.exports = router;