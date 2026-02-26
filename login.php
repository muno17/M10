<!DOCTYPE html>
<html lang="en">
    <head>
        <title>smpld</title>
        <meta charset="utf-8" />
        <link href="style/login.css" type="text/css" rel="stylesheet" />
    </head>
<!-- Check if an error has been passed via GET (if wrong login info used) -->
<?php
$error = false;
$logerror = false;
if(isset($_GET['error'])) {
    $error = $_GET['error'];
}

if(isset($_GET['logerror'])) {
    $logerror = $_GET['logerror'];
}
?>
<body id="home">
    <div id="heading-house">
        <a href="sqnc.php" id="home-heading">sqnc</a>
        <h2>Virtual Drum Machine</h2>
    </div>
    <div id="main">
        <div id="login-page">
            <form method="post">
                <fieldset class="login-fieldset">
                    <h1>Log In</h1>
                    <div class="form-group">
                        <label for="username"><strong>Username:</strong></label>
                        <input type="text" id="username" name="username">
                    </div>
                    <div class="form-group">
                        <label for="password"><strong>Password:</strong></label>
                        <input type="password" id="password" name="password">
                    </div>
                    <br>
                    <button type="submit" formaction="api/login-submit.php">Log In</button>
                    <?php
                    # Add a warning message with the error found
                    if ($logerror) {
                        ?>
                        <div class="error">Please enter account information</div>
                        <?php
                    } elseif ($error) {
                        ?>
                        <div class="error">Invalid <?= $error ?>, please try again</div>
                        <?php
                    } else {
                        ?>
                        <br>
                        <?php
                    }
                    ?>
                    <br>
                    <br>
                    Don't have an account?
                    <button type="submit" formaction="signup.php">Sign Up</button>
                </fieldset>
            </form>
        </div>
    </div>
</body>
</html>
