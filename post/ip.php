<?php

$ip = $_SERVER['REMOTE_ADDR'];
$ip = substr($ip, 0, strrchr($ip, '.'));

$list = file_get_contents('../ip');

if (gettype(strpos($list, $ip)) !== "integer") {
	file_put_contents('../ip', $list . PHP_EOL . $ip);
}

?>