'use strict';

var buiApp = angular.module('buiApp', ['ui.bootstrap', 'ngGrid', 'ngRoute']);

buiApp.directive('chart', function() {
    return {
        restrict: 'E',
        link: function(scope, elem, attrs) {

            var chart;

            scope.$watch(attrs.ngModel, function(v) {

                var data = [
                    {
                        data: v,
                        color: '#62aeef',
                        lines: {
                            lineWidth: 2,
                            fill: true,
                            fillColor: '#f3faff'
                        }
                    }
                ];

                if (!chart) {
                    var opts = {
                        grid: {
                            aboveData: true,
                            color: '#3f3f3f',
                            backgroundColor: '#fff',
                            borderWidth: 1,
                            borderColor: '#D4D4D4'
                        },
                        series: {
                            shadowSize: 0 // Drawing is faster without shadows
                        },
                        xaxis: {
                            show: false
                        },
                        yaxis: {
                            tickDecimals: 0,
                            min: 0
                        }
                    };

                    chart = $.plot(elem, data, opts);
                } else {
                    chart.setData(data);
                    chart.setupGrid();  // only need because the grid and axis is changing
                    chart.draw();
                }
            }, true); // deep watch to see changes inside the object
        }
    };
});

buiApp.factory('buiService', function($http) {
    return {
        getAllStats: function() {
            return $http.get('/jobstats')
                .then(function(result) {
                    return result.data
                });
        }
    }
});

buiApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/tube-stats/:tubeName', {
            templateUrl: 'scripts/app/partials/tube-stats.html',
            controller: 'TubeStatsController'
        })
        .when('/summary', {
            templateUrl: 'scripts/app/partials/summary.html',
            controller: 'SummaryController'
        })
        .otherwise({
            redirectTo: '/summary'
        });
}]);

buiApp.controller('SummaryController', function($scope, buiService) {
    $scope.stats = [];

    $scope.gridOptions = {
        data: 'stats',
        excludeProperties: ['$$hashKey'],
        columnDefs: [{
            field: 'name',
            displayName: 'Name',
            pinnable: true,
            cellTemplate: '<a href="#/tube-stats/{{row.getProperty(col.field)}}">{{row.getProperty(col.field)}}</a>'
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

    $scope.chartTotalJobs = [];

    var lastTotalJobs = 0,
        maxLength = 60,
        refreshData = function() {
            buiService.getAllStats().then(function(stats) {
                $scope.stats = stats;

                var totalJobs = 0,
                    diff = 0;

                stats.forEach(function(tubeStats) {
                    totalJobs += parseInt(tubeStats.total_jobs, 10);
                });

                if (lastTotalJobs > 0) {
                    diff = totalJobs - lastTotalJobs;
                    $scope.chartTotalJobs.push([new Date, diff]);
                }
                if ($scope.chartTotalJobs.length > maxLength) {
                    $scope.chartTotalJobs.shift();
                }
                lastTotalJobs = totalJobs;
            });
        };

    refreshData();
    var intervalId = setInterval(refreshData, 1000);
    $scope.$on("$destroy", function(){
        clearInterval(intervalId);
    });
});

buiApp.controller('TubeStatsController', function($scope, $routeParams) {
    // nowt to do just yet
    $scope.statshere = $routeParams.tubeName;
});