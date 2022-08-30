const User = require('../models/user');
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { body, validationResult } = require("express-validator");

exports.signup_get = (req, res, next) => {
    res.render('signup', {title: 'Sign Up'})
};

exports.signup_post = [
    body("username")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Username must be at least 6 characters.")
        .custom((value) => {
            var query = User.find({ username: value})
            return query.exec().then(user => {
                if (user.length > 0) {
                    return Promise.reject("Username already in use.")
                }
            })
        }),
    body("password")
        .trim()
        .isLength({ min: 6 })
        .escape()
        .withMessage("Password must be at least 6 characters."),
    body("confirmPassword")
        .trim()
        .isLength({ min: 6 })
        .escape()
        .custom((value, {req}) => {
            if (value !== req.body.password) {
                throw new Error("Passwords must be the same.");
            }
            return true;
        }),
    
    async (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            errors.array().forEach(error => {
                req.flash('error', error.msg)
            })
            res.render('signup', {title: "Sign Up", messages: req.flash()})
            return
        } 

        try{
            bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
                if (err) return next(err);
                const user = new User({
                    username: req.body.username, 
                    password: hashedPassword,
                }).save((err) => (err ? next(err) : res.redirect('/')))
            })
        } catch (err) {
            next(err)
        }
    }
];