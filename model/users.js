let mongodb = require('mongodb');
let client = mongodb.MongoClient;

class User {
    constructor(name, password, id, phone, mail) {
        this.name = name;
        this.password = password;
        this.id = id;
        this.phone = phone;
        this.mail = mail;
    }
}

const host = 'www.megrez-says-hi.cn';
const port = 27017;
const dbName = 'signin';
const username = 'root';
const password = 'toor';

const userList = new class {
    connect() {
        let that = this;
        return new Promise(function (resolve, reject) {
            client
                .connect(`mongodb://${username}:${password}@${host}:${port}/${dbName}?authSource=admin`)
                .then(function (db) {
                    that.db = db;
                    that.users = db.collection('users');
                    resolve(db);
                })
                .catch(reject);
        });
    }

    addUser(name, password, id, phone, mail) {
        let that = this;
        return new Promise(function (resolve, reject) {
            let user = new User(name, password, id, phone, mail);
            that.users
                .updateOne(user, user, {upsert: true})
                .then(function (result) {
                    resolve(result.result.n === 1);
                })
                .catch(reject);
        });
    }

    checkExist(param) {
        let that = this;
        return new Promise(function (resolve, reject) {
            that.users
                .find(param)
                .count()
                .then(count => resolve(count > 0))
                .catch(reject);
        });
    }

    getUser(param) {
        let that = this;
        return new Promise(function (resolve, reject) {
            that.users
                .findOne(param)
                .then(resolve)
                .catch(resolve);
        });
    }
};

module.exports = userList;
