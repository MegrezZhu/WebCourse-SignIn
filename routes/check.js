'use strict';

let express = require('express');
let checker = require('../model/check');
let userList = require('../model/users');

let router = express.Router();

router
    .post('/:argName', function (req, res) {
        let argName = req.params.argName,
            arg = req.body[argName];
        // console.log(argName, arg);
        if (!checker.formatCheck(argName, arg)) res.end('error');
        else {
            // console.log('checking');
            checker.existCheck(argName, arg)
                .then(result => res.end(!result ? 'ok' : 'error'));
        }
    });

module.exports = router;