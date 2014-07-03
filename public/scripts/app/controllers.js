'use strict';

var buiApp = angular.module('buiApp', ['ui.bootstrap']);
buiApp.controller('IndexController', function($scope) {
    $scope.stats = [
        {
             'name': 'default',
             'current-jobs-urgent': '0',
             'current-jobs-ready': '0',
             'current-jobs-reserved': '0',
             'current-jobs-delayed': '0',
             'current-jobs-buried': '0',
             'total-jobs': '0',
             'current-using': '0',
             'current-watching': '1',
             'current-waiting': '0',
             'cmd-pause-tube': '0',
             'pause': '0',
             'pause-time-left': '0'
        },
        {
             'name': 'BackgroundCommand',
             'current-jobs-urgent': '0',
             'current-jobs-ready': '0',
             'current-jobs-reserved': '0',
             'current-jobs-delayed': '0',
             'current-jobs-buried': '13',
             'total-jobs': '16',
             'current-using': '0',
             'current-watching': '1',
             'current-waiting': '0',
             'cmd-pause-tube': '0',
             'pause': '0',
             'pause-time-left': '0'
        }
    ];
});