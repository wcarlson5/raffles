'use strict';

angular.module('rafflesApp.controllers.dashboard', [
  'ui.router',
  'rafflesApp.services.raffles',
  'rafflesApp.services.alerts',
  'rafflesApp.services.socket',
  'rafflesApp.directives'
])
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('dashboard', {
        url: '/raffles/:raffle/dashboard',
        controller: 'DashboardCtrl as ctrl',
        templateUrl: 'js/views/dashboard/dashboard.html'
      });
  }])
  .controller('DashboardCtrl', ['$stateParams', '$sce', 'Raffle', 'Alerts', 'Socket', function($stateParams, $sce, Raffle, Alerts, Socket) {
    var ctrl = this;

    ctrl.raffle = $stateParams.raffle;
    ctrl.count = 0;
    ctrl.details = '';

    ctrl.getCount = function() {
      Raffle.getCount(ctrl.raffle)
        .then(function(count) {
          ctrl.count = count;
        })
        .catch(function(err) {
          Alerts.addError(err);
        });
    };

    Socket.on('connect', function() {
      Socket.emit('raffle', ctrl.raffle);
    });

    Socket.on('entry', function(entry) {
      ctrl.count++;
      Alerts.addInfo('Thank you, ' + entry.email + '!');
    });

    Raffle.getDetails(ctrl.raffle)
      .then(function(html) {
        ctrl.details = $sce.trustAsHtml(html);
      })
      .catch(function(err) {
        Alerts.addError(err);
      });

    ctrl.getCount();

  }]);
