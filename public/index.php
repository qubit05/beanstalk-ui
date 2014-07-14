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
$app->get('/summary', function() use ($app) {
    $retries = 3;
    while ($retries > 0) {
        try {
            $service = $app->container->buiService;
            /* @var $service \Bui\BuiService */
        } catch (\Pheanstalk\Exception\ConnectionException $e) {
            if ($retries == 0) {
                throw $e;
            }
        }
        $retries--;
    }

    $response = $app->response();
    $response->header('Content-Type', 'application/json');
    $response->status(200);
    $response->setBody(json_encode(make_json_safe_keys($service->getAllStats())));
});
$app->get('/tube-stats/:name', function($name) use ($app) {
    $retries = 3;
    while ($retries > 0) {
        try {
            $service = $app->container->buiService;
            /* @var $service \Bui\BuiService */
        } catch (\Pheanstalk\Exception\ConnectionException $e) {
            if ($retries == 0) {
                throw $e;
            }
        }
        $retries--;
    }

    $response = $app->response();
    $response->header('Content-Type', 'application/json');
    $response->status(200);
    $response->setBody(json_encode(make_json_safe_keys($service->getTubeStats($name))));
});
$app->get('/', function() use ($app) {
    $app->render('layout.phtml');
});
$app->run();