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
            <li class="main-navbar__item dropdown">
              <a href="#" class="main-navbar__link main-navbar__link--active">
                <i class="main-navbar__link__prepend icon-user"></i>
                <span class="main-navbar__link__body">Clientes</span>
                <i class="main-navbar__link__append icon-chevron-down"></i>
              </a>

              <nav class="dropdown__nav">
                <ul class="dropdown__list">
                  <li class="dropdown__item">
                    <a href="#" class="dropdown__link dropdown__link--active">Resumen</a>
                  </li>
                  <li class="dropdown__item">
                    <a href="#" class="dropdown__link dropdown__link--disabled">Nuevo Cliente</a>
                  </li>
                  <li class="dropdown__item">
                    <a href="#" class="dropdown__link">Agregar Transaccion</a>
                  </li>
                  <li class="dropdown__item">
                    <a href="#" class="dropdown__link dropdown__link--disabled">Actualizar Cliente</a>
                  </li>
                  <li class="dropdown__item">
                    <a href="#" class="dropdown__link dropdown__link--disabled">Consultar creditos</a>
                  </li>
                </ul>
              </nav>
            </li>
          </ul>

          <a href="./logout.php" class="btn btn--red">Cerrar sesión</a>
        </div>
      </nav>
    </header>

    <script src="../js/app.js"></script>
  </body>
</html>
