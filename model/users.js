'use strict';

let mongodb = require('mongodb');
let secure = require('./secure');
let client = mongodb.MongoClient;

class User {
    constructor(name, password, id, phone, mail) {
        this.name = name;
        this.id = id;
        this.phone = phone;
        this.mail = mail;
        this.session = secure.encrypt(`${name}:${password}`);
        this.password = secure.encryptMD5(password).result;
    }
}

const host = 'www.megrez-says-hi.cn';
const port = 27017;
const dbName = 'signin';
const username = 'root';
const pw = 'toor';

const userList = new class {
    constructor() {
        this.db = null;
        this.users = null;
    }

    connect() {
        let that = this;
        return client
            .connect(`mongodb://${username}:${pw}@${host}:${port}/${dbName}?authSource=admin`)
            .then(function (db) {
                that.db = db;
                that.users = db.collection('users');
            });
    }

    checkExist(user) {
        // console.log('checkExist' + user);
        let param = {
            $or: [{name: user.name}, {id: user.id}, {phone: user.phone}, {mail: user.mail}]
        };
        return this.users
                   .find(param)
                   .count()
                   .then(count => count > 0);
    }

    regist(data) {
        let that = this;
        let {name, password, id, phone, mail} = data;
        let user = new User(name, password, id, phone, mail);
        return that.checkExist(user)
                   .then(function (result) {
                       if (result)
                           return Promise.reject(new Error('user exist!'));
                       else
                           return that.users
                                      .insertOne(user)
                                      .then(() => user.session.data);
                   });
    }

    autoLogin(name, session) {
        return this.getUser({name})
                   .then(function (user) {
                       if (user => user.session.data === session)
                           return user;
                       else
                           return null;
                   });
    }

    login(name, password) {
        let _password = secure.encryptMD5(password).result;
        // console.log(name, password, _password);
        return this.getUser({name: name, password: _password});
    }

    find(param) {
        let that = this;
        return that.users
                   .find(param)
                   .count()
                   .then(count => count > 0)
    }

    getUser(param) {
        return this.users
                   .find(param)
                   .limit(1)
                   .toArray()
                   .then(arr => arr.length ? arr[0] : null);
    }
};

module.exports = userList;
