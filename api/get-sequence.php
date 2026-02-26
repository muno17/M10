<?php
###### gets content for a selected sequence
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
$seq_id = $_POST['id'];

###*********### **** connect to db and get requested sequence **** ###*********### 
try {
 # get all of the user's sequences in alphabetical order
        $getquery = $db->prepare("SELECT id, content FROM sequences 
                                WHERE user_id = ? AND id = ?
                                LIMIT 1");
        $getquery->execute(array($user_id, $seq_id));

        $sequence = $getquery->fetch(PDO::FETCH_ASSOC);

        header('Content-Type: application/json');
        echo json_encode($sequence);
} catch(PDOException $ex) {
    # redirect with error
    header("HTTP/1.1 500 Internal Server Error");
    echo json_encode(["error" => $ex->getMessage()]);
    exit;
}
?>