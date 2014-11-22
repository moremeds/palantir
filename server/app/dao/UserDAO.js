var MongoConnector = require('./../data/MongoConnector').MongoConnector,
    Q = require('q'),
    mongo = require('mongodb'),
    BSON = mongo.BSONPure;

exports.UserDAO = function () {
    "use strict";

    var find, addUser, doAddUser, doFind, removeUserById, doRemoveUserById, doUpdateUser, updateUser;

    doAddUser = function (client, data) {
        var d = Q.defer();


        client.collection('user').insert(data, {multi: true}, function (error) {
            if (error) {
                d.reject(error);
            } else {
                client.close();
                d.resolve(data);
            }
        });

        return d.promise;
    };

    doUpdateUser = function (client, data) {
        var d = Q.defer();

        var objectId = new BSON.ObjectID(data.id);


        client.collection('user').update({"_id": objectId}, {$set: data.updated}, {multi: false, upsert: false},
            function (error, result) {
                if (error) {
                    d.reject(error);
                } else {
                    client.close();
                    d.resolve(data.id);
                }
            });

        return d.promise;
    };

    updateUser = function (data) {
        var d = Q.defer();

        MongoConnector.getConnection().then(function (client) {
            return doUpdateUser(client, data);
        }).then(function (savedData) {
            console.log("saved data in update" + savedData);
            d.resolve(savedData);
        });

        return d.promise;
    };

    addUser = function (data) {
        var d = Q.defer();

        MongoConnector.getConnection()
            .then(function (client) {

                return doAddUser(client, data);
            })
            .then(function (savedData) {
                d.resolve(savedData);
            });

        return d.promise;
    };

    doRemoveUserById = function (client, id) {
        var d, objectId;

        d = Q.defer();
        objectId = new BSON.ObjectID(id);
        client.collection('user').remove({"_id": objectId}, function (error) {
            if (error) {
                d.reject(error);
            } else {
                client.close();
                d.resolve(id);
            }
        });

        return d.promise;
    };

    removeUserById = function (id) {
        var d = Q.defer();

        MongoConnector.getConnection()
            .then(function (client) {
                //importante devolver la función que contiene la promesa
                return doRemoveUserById(client, id);
            })
            .then(function (savedData) {

                d.resolve(savedData);
            });

        return d.promise;
    };

    doFind = function (client) {
        var d = Q.defer(), user, stream;
        user = [];

        stream = client.collection('user').find(

        ).stream();

        stream.on('data', function (item) {
            user.push(item);
        });
        stream.on('end', function () {
            client.close();
            d.resolve(user);
        });

        return d.promise;
    };

    find = function () {
        var d = Q.defer();
        MongoConnector.getConnection()
            .then(doFind)
            .then(function (user) {
                d.resolve(user);
            });
        return d.promise;
    };

    return {
        addUser: addUser,
        find: find,
        removeUserById: removeUserById,
        updateUser: updateUser

    };
}();