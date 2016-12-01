'use strict';

let express = require('express');
let router = express.Router();

let users = require('../model/users');

/* GET home page. */
router
    .use(function (req, res, next) {
        if (req.cookies.error === 'true') {
            res.locals.error = true;
        }
        res.clearCookie('error');
        next();
    })
    .get('/', function (req, res, next) {
        if (!!res.locals.user) {
            if (!!req.query.username) {
                if (res.locals.user.name !== req.query.username) {
                    res.cookie('error', 'true');
                    res.redirect(`/?username=${res.locals.user.name}`);
                } else
                    res.render('detail');
            } else
                res.redirect(`/?username=${res.locals.user.name}`);
        } else {
            if (!!req.query.username)
                res.redirect('/');
            else
                res.render('index');
        }
    });

module.exports = router;

function hasCookie(req) {
    return req.cookies && req.cookies.name && req.cookies.session;
}