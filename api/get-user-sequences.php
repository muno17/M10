<?php
###### gets all of the user's sequences
session_start();
require_once "db.php";

# If user is not logged in don't do anything
if (!isset($_SESSION['logged_in'])) {
    header("HTTP/1.1 401 Unauthorized");
    header('Content-Type: application/json');
    echo json_encode(["error" => "Not logged in"]);
    exit;
}

$user_id = $_SESSION['user_id'];

###*********### **** connect to db and get user's sequences**** ###*********### 
try {
    # get all of the user's sequences in alphabetical order
    $getquery = $db->prepare("SELECT id, name FROM sequences 
                            WHERE user_id = ? 
                            ORDER BY name");
    $getquery->execute(array($user_id));

    $sequences = $getquery->fetchAll(PDO::FETCH_ASSOC);

    header('Content-Type: application/json');
    echo json_encode($sequences);
} catch(PDOException $ex) {
    # redirect with error
    header("HTTP/1.1 500 Internal Server Error");
    echo json_encode(["error" => $ex->getMessage()]);
    exit;
}
?>