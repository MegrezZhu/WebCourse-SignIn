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

const host = 'www.megres-says-hi.cn';
const port = 27017;
const dbName = 'users';

let donePromise;

const userList = new class {
    connect() {
        let that = this;
        return new Promise(function (resolve, reject) {
            client
                .connect(`mongodb://${host}:${port}/${dbName}`)
                .then(function (db) {
                    that.db = db;
                    resolve(db);
                })
                .catch(reject);
        });
    }

    addUser(name, password, id, phone, mail) {
        let that = this;
        return new Promise(function (resolve, reject) {
            let user = new User(name, password, id, phone, mail);
        });
    }

    checkUserExist(name) {

    }
};

module.exports = {
    User,
    userList,
    donePromise
};