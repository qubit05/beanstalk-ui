'use strict';

var buiApp = angular.module('buiApp', ['ui.bootstrap', 'ngGrid']);
buiApp
.factory('buiService', function($http) {
    return {
        getAllStats: function() {
            return $http.get('/jobstats')
                .then(function(result) {
                    return result.data
                });
        }
    }
})
.controller('IndexController', function($scope, buiService) {
    $scope.stats = [];
    var refreshData = function() {
        buiService.getAllStats().then(function(stats) {
            $scope.stats = stats;
            setTimeout(refreshData, 1000);
        });
    };
    setTimeout(refreshData, 1000)

    $scope.gridOptions = {
        data: 'stats',
        excludeProperties: ['$$hashKey'],
        columnDefs: [{
            field: 'name',
            displayName: 'Name',
            pinnable: true
        },{
            field: 'total_jobs',
            displayName: 'Total'
        },{
            field: 'current_using',
            displayName: 'Using'
        },{
            field: 'current_waiting',
            displayName: 'Waiting'
        },{
            field: 'current_watching',
            displayName: 'Watching'
        },{
            field: 'current_jobs_buried',
            displayName: 'Jobs Buried'
        },{
            field: 'current_jobs_delayed',
            displayName: 'Jobs Delayed'
        },{
            field: 'current_jobs_ready',
            displayName: 'Jobs Ready'
        },{
            field: 'current_jobs_reserved',
            displayName: 'Job Reserved'
        },{
            field: 'current_jobs_urgent',
            displayName: 'Jobs Urgent'
        },{
            field: 'cmd_pause_tube',
            displayName: 'Pause?',
            visible: false
        },{
            field: 'pause',
            displayName: 'Paused',
            visible: false
        },{
            field: 'pause_time_left',
            displayName: 'Pause Time Left',
            visible: false
        }]
    };
});