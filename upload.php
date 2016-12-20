<?php

$uploaddir = 'image/';
$uploadfile = $uploaddir . basename($_FILES['file']['name']);


if (move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile)) {
    echo '{"file": "'.$uploadfile.'"}';
} else {
    header("HTTP/1.1 404 Not Found");
    echo "Возможная атака с помощью файловой загрузки!\n";
}

