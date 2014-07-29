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
$app->container->httpClient = function() {
    return new \Guzzle\Http\Client();
};
$app->container->singleton('githubApi', function() use ($app) {
    $client = $app->container->httpClient;
    $client->setBaseUrl($app->config('version.base_url'));

    $cache = new \Guzzle\Plugin\Cache\CachePlugin(array(
        'storage' => new \Guzzle\Plugin\Cache\DefaultCacheStorage(
            new \Guzzle\Cache\DoctrineCacheAdapter(
                new Doctrine\Common\Cache\FilesystemCache($app->config('storage.cache.http'))
            )
        )
    ));

    $client->addSubscriber($cache);
    return $client;
});
$app->container->singleton('beanstalk', function () use ($app) {
    $host = $app->config('beanstalk.host');
    $port = $app->config('beanstalk.port');
    return new \Pheanstalk\Pheanstalk($host, $port);
});
$app->container->singleton('buiService', function () use ($app) {
    return new \Bui\BuiService($app->container->beanstalk);
});

// routing
$app->get('/server', function() use ($app) {
    $retries = 3;
    while ($retries > 0) {
        try {
            $server = $app->container->beanstalk;
            /* @var $server \Pheanstalk\Pheanstalk */
        } catch (\Pheanstalk\Exception\ConnectionException $e) {
            if ($retries == 0) {
                throw $e;
            }
        }
        $retries--;
    }

    $app->response->header('Content-Type', 'application/json');
    $app->response->setBody(json_encode(make_json_safe_keys((array)$server->stats())));
});
$app->get('/server/versions', function() use ($app) {
    $client = $app->container->httpClient;
    /* @var $client \Guzzle\Http\Client */
    $client->setBaseUrl($app->config('versions.base_url'));
    $apiResponse = $client->get('repos/kr/beanstalkd/tags')->send();

    $app->response->header('Content-Type', 'application/json');
    $app->response()->setBody(json_encode($apiResponse->json()));
});
$app->get('/tube', function() use ($app) {
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

    $app->response->header('Content-Type', 'application/json');
    $app->response->setBody(json_encode(make_json_safe_keys($service->getAllStats())));
});
$app->get('/tube/:name', function($name) use ($app) {
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

    $app->response->header('Content-Type', 'application/json');
    $app->response->setBody(json_encode(make_json_safe_keys($service->getTubeStats($name))));
});
$app->put('/tube/:name(/:quantity)', function($name, $quantity = 1) {
    // kick a number of jobs on tube
})->conditions(array('quantity' => '\d+'));
$app->get('/job/:id', function() use ($app) {
    // peek at a job
})->conditions(array('id' => '\d+'));
$app->post('/job', function() use ($app) {
    // add a new job
});
$app->delete('/job/:id', function() use ($app) {
    // delete a job
})->conditions(array('id' => '\d+'));
$app->get('/', function() use ($app) {
    $app->render('index.phtml');
});

// finally run!
$app->run();