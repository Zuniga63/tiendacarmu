<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Sistema de clientes</title>
    <!-- SE CARGAN LAS FUENTES DE LOS ICONOS -->
    <link rel="stylesheet" href="../font/style.css" />

    <!-- SE CARGAN LOS ESTILOS GENERALES -->
    <link rel="stylesheet" href="../css/normalize.css" />
    <link rel="stylesheet" href="../css/main.css" />
  </head>
  <body class="customer-body">
    <header class="header">
      <nav class="main-navbar" id="mainNavbar">
        <a href="home.php" class="main-navbar__brand">
          <img
            src="../img/logo.png"
            alt="Logo de Carmú"
            class="main-navbar__img"
          />
        </a>

        <button class="main-navbar__toggler" id="navbar-toggler">
          <i class="icon-bars"></i>
        </button>

        <div class="main-navbar__nav" id="navbar-collapse">
          <ul class="main-navbar__list">
            <li class="main-navbar__item">
              <a href="./home.php" class="main-navbar__link">
                <i class="main-navbar__link__prepend icon-home"></i>
                <span class="main-navbar__link__body">Principal</span>
              </a>
            </li>
            <li class="main-navbar__item">
              <a href="customers.php" class="main-navbar__link main-navbar__link--active">
                <i class="main-navbar__link__prepend icon-home"></i>
                <span class="main-navbar__link__body">Clientes</span>
              </a>
            </li>
          </ul>

          <a href="./logout.php" class="btn btn--red">Cerrar sesión</a>
        </div>
      </nav>
    </header>

    <script src="../js/app.js"></script>
  </body>
</html>
