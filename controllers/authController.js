const User = require('../models/user');
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { body, validationResult } = require("express-validator");

exports.signup_get = (req, res, next) => {
    res.render('signup', {title: 'Sign Up'})
};

exports.signup_post = [
    
];