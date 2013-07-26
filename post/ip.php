<?php

$ip = $_SERVER['REMOTE_ADDR'];
$ip = substr($ip, 0, strrpos($ip, '.'));

$list = file_get_contents('../ip');

if (strpos($list, $ip) === false) {
	file_put_contents('../ip', $list . "\r\n" . $ip);
}

?>