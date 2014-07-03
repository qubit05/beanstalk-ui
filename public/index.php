<?php
require_once dirname(__DIR__) . '/src/bootstrap.php';

$config = require APP_ROOT . '/config.php';
$app    = new Slim\Slim($config);

// dependency container
$app->container->singleton('beanstalk', function () use ($app) {
//    error_log('singleton'.  var_export(func_get_args(),true));
    $host = $app->config('server.host');
    $port = $app->config('server.port');
    return new \Pheanstalk\Pheanstalk($host, $port);
});
$app->container->singleton('buiService', function () use ($app) {
    return new \Bui\BuiService($app->container->beanstalk);
});

// routing
$app->get('/', function() use ($app) {
    $service = $app->container->buiService;
    /* @var $service \Bui\BuiService */
    $app->render('layout.phtml', array('stats' => $service->getAllStats()));
});
$app->run();