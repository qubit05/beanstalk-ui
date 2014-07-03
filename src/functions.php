<?php

/**
 *
 * @param array $data
 * @return array
 */
function make_json_safe_keys(array $data)
{
    if (!isset($data[0])) {
        // assoc
        return make_json_safe_keys(array($data))[0];
    }

    $cleaned = array();
    foreach ($data as $position => $row) {
        $cleaned[$position] = array();
        foreach ($row as $column => $value) {
            $column = str_replace('-', '_', $column);
            $cleaned[$position][$column] = $value;
        }
    }
    return $cleaned;
}