<!DOCTYPE html>
<html lang="en">
    <head>
        <title>sqnc</title>
        <meta charset="utf-8" />
        <link href="style/login.css" type="text/css" rel="stylesheet" />
    </head>
<!-- Check if an error has been passed via GET (if wrong login info used) -->
<?php
$error = false;
if(isset($_GET['error'])) {
    $error = $_GET['error'];
}
?>
<body id="home">
    <div id="main">
        <div id="heading-house">
        <a href="sqnc.php" id="home-heading">sqnc</a>
        <h2>Virtual Drum Machine</h2>
    </div>
        <div id="login-page">
            <form action="api/signup-submit.php" method="post">
                <fieldset class="login-fieldset">
                    <h1>Sign Up</h1>
                    <div class="form-group">
                        <label for="username"><strong>Username:</strong></label>
                        <input type="text" name="username" required>
                    </div>

                    <div class="form-group">
                        <label for="password"><strong>Password:</strong></label>
                        <input type="password" name="password" required>
                    </div>
                    <br>
                    <input type="submit" value="Create Account" class="form-group button"
                    id="createAccount">
                    <?php
                    # Add a warning message with the error found
                    if ($error) {
                        ?>
                        <div class="error">Username already exists, please try again</div>
                        <?php
                    } else {
                        ?>
                        <br>
                        <?php
                    }
                    ?>
                </fieldset>
            </form>
        </div>
    </div>
</body>