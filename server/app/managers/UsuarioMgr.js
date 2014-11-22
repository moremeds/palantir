var UserDAO = require('./../dao/UserDAO').UserDAO,
    util = require('util'),
    Q = require('q'),
    BaseMgr = require('./BaseMgr');


function UserManager() {
    "use strict";
    UserManager.super_.call(this);

    this.add = function (data) {
        var d = Q.defer();
        UserDAO.addUser(data).then(function (savedData) {
            d.resolve({"user/add": savedData});
        });
        return d.promise;
    };

    this.find = function (data) {
        var d = Q.defer();
        UserDAO.find().then(function (usuarios) {
            d.resolve({"user/find": usuarios});
        });
        return d.promise;
    };

    this.remove = function (id) {
        var d = Q.defer();
        UserDAO.removeUserById(id).then(function (id) {
            d.resolve({"user/remove": id});
        });
        return d.promise;
    };

    this.update = function (data) {
        var d = Q.defer();

        UserDAO.updateUser(data).then(function (id) {

            d.resolve({"user/update": id});

        });

        return d.promise;
    };


    //contains the functions allowed and if they will do a broadcasting. All the functions declared in fn property
    //will be promises
    this.messages = {
        add: {fn: this.add, doBroadCasting: true},
        find: {fn: this.find, doBroadCasting: false},
        remove: {fn: this.remove, doBroadCasting: true},
        update: {fn: this.update, doBroadCasting: true}
    };
};

util.inherits(UserManager, BaseMgr);

module.exports = UserManager;

