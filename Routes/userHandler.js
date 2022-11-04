const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const userSchema = require('../Schemas/userSchema');
const UserModel = new mongoose.model('User', userSchema);

//signup
router.post('/signup', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new UserModel({
            name: req.body.name,
            username: req.body.username,
            password: hashedPassword
        });
        await newUser.save();
        res.status(200).json({ message: "Signup was successful" })

    } catch (error) {
        res.status(500).json({ message: "Signup was not successful" })
    }
})

//login
router.post('/login', async (req, res) => {
    try {
        const user = await UserModel.find({ username: req.body.username });
        if (user && user.length > 0) {
            const isValidPassword = await bcrypt.compare(req.body.password, user[0].password);
            if (isValidPassword) {
                const token = jwt.sign({
                    username: user[0].username,
                    userId: user[0]._id
                }, process.env.JWT_SECRET, { expiresIn: '1h' })
                res.status(200).json({
                    "access_token": token,
                    "message": "Login successful"
                })
            } else {
                res.status(401).json({ "Error": "Authentication Failed" })
            }
        } else {
            res.status(401).json({ "Error": "Authentication Failed" })
        }
    } catch (error) {
        res.status(401).json({ "Error": "Authentication Failed" })
    }
})

module.exports = router;