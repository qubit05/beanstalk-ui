<?php
namespace Bui;

class BuiService
{
    /**
     * @var \Pheanstalk\Pheanstalk
     */
    protected $server;

    /**
     * Constructor
     *
     * @param \Pheanstalk\Pheanstalk $server
     * @return void
     */
    public function __construct(\Pheanstalk\Pheanstalk $server)
    {
        $this->server = $server;
    }

    /**
     * Get all statistics for all tubes.
     *
     * @return array
     */
    public function getAllStats()
    {
        $allStats = array();
        $tubes    = $this->server->listTubes();
        foreach ($tubes as $tubeName) {
            $tubeStats = $this->server->statsTube($tubeName);
            /* @var $tubeStats \Pheanstalk\Response\ArrayResponse */
            $allStats[] = $tubeStats;
        }
        return $allStats;
    }

    /**
     *
     * @param string $tubeName
     * @return array
     */
    public function getTubeStats($tubeName)
    {
        return (array)$this->server->statsTube($tubeName);
    }
}
