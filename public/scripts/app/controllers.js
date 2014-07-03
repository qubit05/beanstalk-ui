'use strict';

var buiApp = angular.module('buiApp', ['ui.bootstrap', 'ngGrid']);
buiApp.controller('IndexController', function($scope) {
    $scope.stats = [{
        name: 'default',
        current_jobs_urgent: 0,
        current_jobs_ready: 0,
        current_jobs_reserved: 0,
        current_jobs_delayed: 0,
        current_jobs_buried: 0,
        total_jobs: 0,
        current_using: 0,
        current_watching: 1,
        current_waiting: 0,
        cmd_pause_tube: 0,
        pause: 0,
        pause_time_left: 0
    }, {
        name: 'BackgroundCommand',
        current_jobs_urgent: 0,
        current_jobs_ready: 0,
        current_jobs_reserved: 0,
        current_jobs_delayed: 0,
        current_jobs_buried: 13,
        total_jobs: 16,
        current_using: 0,
        current_watching: 1,
        current_waiting: 0,
        cmd_pause_tube: 0,
        pause: 0,
        pause_time_left: 0
    }];
    $scope.gridOptions = { data: 'stats' };
});