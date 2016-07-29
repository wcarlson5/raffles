'use strict';

angular.module('rafflesApp.services.socket', [])
  .service('Socket', function ($rootScope) {
    var SocketService = this;
    var socket = io.connect();

    SocketService.on = function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    };

    SocketService.emit = function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    };
  });
