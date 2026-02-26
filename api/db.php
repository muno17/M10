<?php
# initiate db - have this on top of all api calls

$host = "localhost";
$dbn = "sqnc_db";
$user = "root";
$pass = "";

try {
    $db = new PDO("mysql:host=$host;dbname=$dbn", $user, $pass);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $ex) {
    header("HTTP/1.1 500 Internal Server Error");
    echo json_encode(["error" => "Database connection failed"]);
    exit;
}
?>