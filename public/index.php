<?php
require_once dirname(__DIR__) . '/src/bootstrap.php';

$config = require APP_ROOT . '/config.php';

$app = new Slim\Slim($config);
$app->get('/', function() use ($app) {
    echo "<html><body><p>done like a kipper!</p></body></html>";
});