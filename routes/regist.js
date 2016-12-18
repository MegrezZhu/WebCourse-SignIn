'use strict';

let express = require("express");
let router = express.Router();

let checker = require('../model/check');
let userList = require('../model/users');

router
    .get('/', function (req, res) {
        res.render('regist');
    })
    .post('/', function (req, res, next) {
        checker.allCheck(req.body)
               .then(function (result) {
                   if (result) {
                       return userList.regist(req.body);
                   } else
                       return Promise.reject(new Error('invalid data!'));
               })
               .then(function () {
                   req.session.name = req.body.name;
                   res.redirect(`/?username=${req.body.name}`);
               })
               .catch(err => next(err));
    });

module.exports = router;