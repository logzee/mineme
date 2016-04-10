<!DOCTYPE HTML>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>MineMe</title>
    <link rel="stylesheet" href="css/uikit.min.css">
    <link rel="stylesheet" href="css/uikit.almost-flat.min.css">
    <link rel="stylesheet" href="css/font-awesome.min.css">
    <link rel="stylesheet" href="css/mineme.css">
    <link rel="icon" type="image/png" href="img/favicon.ico" />
    <script src="js/jquery.js"></script>
    <script src="js/uikit.min.js"></script>
</head>
<body class="uk-height-1-1">
    <nav class="uk-navbar uk-margin-large-bottom uk-navbar-attached">
        <div class="uk-container uk-container-center">
            <a class="uk-navbar-brand" href="index.jsp">MineMe <span class="uk-badge uk-margin-small-right">alpha</span></a>
        </div>
    </nav>
    <div class="uk-vertical-align uk-text-center uk-height-1-1">
        <div class="uk-vertical-align-middle" style="width: 250px;">
            <form class="uk-panel uk-panel-box uk-form" method="POST" action="j_security_check" id="login-form">
                <div class="uk-form-row">
                    <input class="uk-width-1-1 uk-form-large" type="text" name="j_username" placeholder="Имя пользователя">
                </div>
                <div class="uk-form-row">
                    <input class="uk-width-1-1 uk-form-large" type="password" name="j_password" placeholder="Пароль">
                </div>
                <div class="uk-form-row">
                    <a class="uk-width-1-1 uk-button uk-button-primary uk-button-large" type="submit" onclick="document.getElementById('login-form').submit()">Войти</a>
                </div>
            </form>
        </div>
    </div>
</body>
</html>