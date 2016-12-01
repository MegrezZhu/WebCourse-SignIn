'use strict';

let express = require('express');
let router = express.Router();

router
    .get('/', function (req, res, next) {
        res.clearCookie('name')
           .clearCookie('session')
           .redirect('/');
    });

module.exports = router;