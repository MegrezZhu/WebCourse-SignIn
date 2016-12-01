'use strict';

let express = require('express');
let router = express.Router();

let users = require('../model/users');

router
    .post('/', function (req, res) {
        // console.log(req.body);
        if (req.body.name && req.body.password) {
            users.login(req.body.name, req.body.password)
                 .then(function (user) {
                     if (!!user) {
                         res.cookie('name', user.name)
                            .cookie('session', user.session.data)
                            .end('ok');
                     } else {
                         res.end('error');
                     }
                 });
        } else
            res.end('Invalid data');
    });

module.exports = router;