'use strict';

let users = require('../model/users');

const autoLogin = function (req, res, next) {
    if (req.cookies && req.cookies.name && req.cookies.session) {
        users.autoLogin(req.cookies.name, req.cookies.session)
             .then(user => {
                 res.locals.user = user;
                 next();
             });
    } else {
        res.clearCookie('name')
           .clearCookie('session');
        res.locals.user = null;
        next();
    }
};

module.exports = autoLogin;