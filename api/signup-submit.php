<?php
###### signup an account, perform validation
session_start();
require_once "db.php";

if (isset($_POST["username"]) && isset($_POST["password"])) {
    $username = $_POST["username"];
    $pw = $_POST["password"];
} else {
    $error = "username";
    $url = "/sqnc/signup.php?error=" . urlencode($error);
    header("Location: /sqnc/signup.php?error=$error");
    exit;
}

########********* connect to db and query  *********########
try {
    # query for the user
    $selectquery = $db->prepare("SELECT id FROM users
                                WHERE username = ?");
    $selectquery->execute(array($username));

    ########********* send back error if user already exists *********########
    if ($selectquery->fetch()) {
        # Username exists, reload Sign Up screen with error message
        $error = "username";
        $url = "/sqnc/signup.php?error=" . urlencode($error);
        header("Location: /sqnc/signup.php?error=$error");
        exit;
    } else {
        # hash the pw for security
        $hpw = password_hash($pw, PASSWORD_DEFAULT);
        ########********* insert user info to db *********########
        $insertquery = "INSERT INTO users (username, password) VALUES (?, ?)";
        $insert = $db->prepare($insertquery);

        if ($insert->execute([$username, $hpw])) {
            # get the user's id
            $selectquery->execute(array($username));
            $user_id = $selectquery->fetch();

            #********* log user in, user id is their identifier *********#
            $_SESSION['user_id'] = $user_id['id'];
            $_SESSION['logged_in'] = true;

            // redirect 
            header("Location: /sqnc/sqnc.php");
        }
    }

} catch(PDOException $ex) {
    # redirect with error
    die("Database error: " . $ex->getMessage());
    $error = "username";
    $url = "/sqnc/signup.php?error=" . urlencode($error);
    header("Location: /sqnc/signup.php?error=$error");
    exit;
}
?>