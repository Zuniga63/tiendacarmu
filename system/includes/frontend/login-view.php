<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistema de Carmú</title>

    <!-- SE CARGAN LAS FUENTES DE LOS ICONOS -->
    <link rel="stylesheet" href=<?= "../font/style.css?v=" . VERSION ?> />

    <!-- SE CARGAN LOS ESTILOS GENERALES -->
    <link rel="stylesheet" href=<?= "../css/normalize.css?v=" . VERSION ?> />
    <link rel="stylesheet" href=<?= "../css/main.css" . VERSION ?> />

</head>

<body class="login-body">
    <div class="login-card">
        <img src="../img/user-min.png" alt="Tipo barbudo con lentes" class="login-card__avatar">
        <img src="../img/logo.png" alt="Logo de la tienda" class="login-card__brand">
        <form action="<?php echo htmlspecialchars($_SERVER['PHP_SELF']) ?>" method="POST" class="login-card__form">
            <div class="login-card__input">
                <i class="login-card__input__prepend icon-user"></i>
                <input type="text" name="username" id="username" placeholder="Nombre de Usuario" class="login-card__input__body">
            </div>

            <div class="login-card__input">
                <i class="login-card__input__prepend icon-password"></i>
                <input type="password" name="password" id="password" placeholder="Contraseña" class="login-card__input__body">
            </div>

            <?php
            if ($error) {
                echo '<div class="login-card__alert alert--danger">';
                echo "<span>$error</span>";
                echo '</div>';
            }
            ?>

            <input type="submit" value="Ingresar" class="btn btn--disabled" disabled>
        </form>

        <script src=<?= "./js/login.js?v=" . VERSION ?>></script>
</body>

</html>