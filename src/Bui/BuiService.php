<?php
namespace Bui;

class BuiService
{
    /**
     * @var \Pheanstalk\Pheanstalk
     */
    protected $server;

    public function __construct(\Pheanstalk\Pheanstalk $server)
    {
        $this->server = $server;
    }

    public function getAllStats()
    {
        $allStats = array();
        $tubes = $this->server->listTubes();
        foreach ($tubes as $tubeName) {
            $tubeStats = $this->server->statsTube($tubeName);
            /* @var $tubeStats \Pheanstalk\Response\ArrayResponse */
            $allStats[$tubeStats['name']] = $tubeStats;
        }
        return $allStats;
    }
}
