'use strict';

let userList = require('./users');

let checkReg = {
    name: /^[a-zA-Z]\w{5,17}$/,
    id: /^[1-9]\d{7}$/,
    phone: /^[0-9]\d{10}$/,
    mail: /^[a-zA-Z0-9_\\-]+@(([a-zA-Z0-9_\-])+\.)+[a-zA-Z]{2,4}$/,
    password: /^[0-9A-Za-z-_]{6,12}$/
};

const formatCheck = function (argName, arg) {
    return !!arg.match(checkReg[argName]);
};

const existCheck = function (argName, arg) {
    let param = {};
    param[argName] = arg;
    return userList.find(param);
};

const allCheck = function (user) {
    if (['name', 'id', 'mail', 'phone'].every(argName => !!user[argName].match(checkReg[argName]))) {
        return userList.checkExist(user)
                       .then(result => !result);
    } else {
        return Promise.resolve(new Error('invalid!'));
    }
};

module.exports = {
    formatCheck,
    existCheck,
    allCheck
};