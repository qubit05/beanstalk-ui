<?php
require_once dirname(__DIR__) . '/src/bootstrap.php';

$config = require APP_ROOT . '/config.php';
$app    = new \Slim\Slim($config);

// configure mode
$app->configureMode('development', function() use ($app) {
    $app->config(array(
        'log.enabled' => true,
        'debug'       => true,
    ));
});
$app->configureMode('production', function() use ($app) {
    $app->config(array(
        'log.enabled' => true,
        'debug'       => false,
    ));
});

// dependency container
$app->container->singleton('beanstalk', function () use ($app) {
    $host = $app->config('beanstalk.host');
    $port = $app->config('beanstalk.port');
    return new \Pheanstalk\Pheanstalk($host, $port);
});
$app->container->singleton('buiService', function () use ($app) {
    return new \Bui\BuiService($app->container->beanstalk);
});

// routing
$app->get('/jobstats', function() use ($app) {
    $service = $app->container->buiService;
    /* @var $service \Bui\BuiService */
    $response = $app->response();
    $response->header('Content-Type', 'application/json');
    $response->status(200);
    $response->setBody(json_encode(make_json_safe_keys($service->getAllStats())));
});
$app->get('/', function() use ($app) {
    $service = $app->container->buiService;
    /* @var $service \Bui\BuiService */
    $app->render('layout.phtml', array('stats' => $service->getAllStats()));
});
$app->run();