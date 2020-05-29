<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistema Carmú - Home</title>
</head>
<body>
<header class="header">
    <h1 class="header__title">Bienvenido <?php echo $_SESSION['first_name'] ?></h1>
    <a href="./logout.php" class="btn btn--red">Cerrar sesión</a>
  </header>
</body>
</html>