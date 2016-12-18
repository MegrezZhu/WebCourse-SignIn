'use strict';

let users = require('../model/users');

const autoLogin = function (req, res, next) {
    if (!!req.session.name) {
        users.getUser({name: req.session.name})
             .then(user => {
                 res.locals.user = user;
                 next();
             });
    } else {
        res.locals.user = null;
        next();
    }
};

module.exports = autoLogin;