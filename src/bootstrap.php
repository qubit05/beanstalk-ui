<?php
if (!defined('APP_ROOT')) {
    define('APP_ROOT', dirname(__DIR__));
}

set_include_path(
    '.' . PATH_SEPARATOR .
    __DIR__ . PATH_SEPARATOR .
    get_include_path()
);

date_default_timezone_set('Europe/London');
setlocale(LC_ALL, 'en_GB.UTF8');

require_once APP_ROOT . '/src/functions.php';
$loader = require_once APP_ROOT . '/vendor/autoload.php';
$loader->setUseIncludePath(true);