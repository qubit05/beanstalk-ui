'use strict';

var buiApp = angular.module('buiApp', ['ui.bootstrap', 'ngGrid', 'angularCharts']);
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

    $scope.chart = {
        chartType: 'line',
        config: {
            labels: false,
            title : "Watching",
            legend : {
                display: true,
                position:'right'
            },
            click : function() {},
            mouseover : function() {},
            mouseout : function() {},
            innerRadius: 0,
            lineLegend: 'lineEnd'
        },
        data: {
            series: [],
            data : []
        }
    };

    var headersSet = false,
        lastStats = [],
        maxLength = 1000,
        refreshData = function() {
            buiService.getAllStats().then(function(stats) {
                $scope.stats = stats;
                pushToGraph(stats)
            });
        },
        pushToGraph = function(latestStats) {
            var newEntry = {
                x: new Date,
                y: []
            };
            for (var index in latestStats) {
                if (!headersSet) {
                    // populate series headers
                    $scope.chart.data.series.push(latestStats[index].name);
                }
                newEntry.y.push(latestStats[index].current_watching);
            }
            if (!headersSet) {
                console.log($scope.chart.data.series);
                console.log(newEntry);
            }
            headersSet = true;
            $scope.chart.data.data.unshift(newEntry);
            if ($scope.chart.data.data.length > maxLength) {
                $scope.chart.data.data.pop();
            }
        };

    setInterval(refreshData, 1000);
});