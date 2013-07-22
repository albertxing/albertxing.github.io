<?php

$ip = $_SERVER['REMOTE_ADDR'];
$list = file_get_contents('../ip');

if (gettype(strpos($list, $ip)) !== "integer") {
	file_put_contents('../ip', $list . PHP_EOL . $ip);
}

?>