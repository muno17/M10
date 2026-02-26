<?php
session_start();

// check if user is logged in
echo json_encode(isset($_SESSION['logged_in']) && $_SESSION['logged_in']);
?>