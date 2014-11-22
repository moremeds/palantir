/*global console: false, angular: false*/
var UsuariosCtrl = angular.module("app")
    .controller("UserControl", ["$scope", "socketioconnector", "$filter", function ($scope, connector, $filter) {
        "use strict";

        $scope.user = {};
        $scope.data = [];

        $scope.load = function () {
            console.log("Loading results...");
            connector.sendMessage("user/find", {});
        };

        $scope.reset = function () {

            console.log("resetting form");
            $scope.user = angular.copy($scope.user);
        };

        $scope.save = function (user) {
            $scope.user = angular.copy(user);
            connector.sendMessage("user/add", user);
        };

        $scope.remove = function (record, rowIndex, colIndex) {
            console.log("delete record " + JSON.stringify(record) +
            " in rowIndex: " + rowIndex + ". The index of the column with the action is " + colIndex);
            connector.sendMessage("user/remove", record._id);
        };

        $scope.deleteUser = function (user) {

            console.log("trying to delete user");

            connector.sendMessage("user/remove", user._id);
        };

        $scope.loadData = function (usuarios) {
            $scope.data = usuarios;
            $scope.$apply();
        };

        $scope.addUser = function (usuario) {
            $scope.$apply(function () {
                $scope.data.push(usuario);
            });
        };


        $scope.updateUser = function (updated, user) {

            console.log("update users......");

            var data = {updated: updated, id: user._id};

            connector.sendMessage("user/update", data);
        };

        $scope.update = function () {

            $scope.load();


        };


        $scope.removeUserById = function (id) {
            angular.forEach(
                $filter("filter")(
                    $scope.data,
                    {"_id": id}
                ),
                function (usuario) {
                    $scope.$apply(function () {
                        $scope.data.splice($scope.data.indexOf(usuario), 1);
                    });
                }
            );
        };

        connector.on("connectionopen", function () {

            $scope.load();

            connector.on("user/find", function (user) {
                console.log("Find Users...");
                $scope.loadData(user);
            });

            connector.on("user/add", function (user) {
                $scope.addUser(user);
            });

            connector.on("user/remove", function (id) {
                $scope.removeUserById(id);
            });

            connector.on("user/update", function (data) {

                console.log("connection on updating ");
                $scope.update();

            });
        });
    }]);