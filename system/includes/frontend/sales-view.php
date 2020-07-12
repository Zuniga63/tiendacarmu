<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ventas</title>

  <!-- SE CARGAN LAS FUENTES DE LOS ICONOS -->
  <link rel="stylesheet" href=<?= "../font/style.css?v=" . VERSION ?> />

  <!-- SE CARGAN LOS ESTILOS GENERALES -->
  <link rel="stylesheet" href=<?= "../css/normalize.css?v=" . VERSION ?> />
  <link rel="stylesheet" href=<?= "../css/main.css?v=" . VERSION ?> />
</head>

<!-- Se agrega esta clase para traerme todas las caracteristicas basicas de esa page -->

<body class="customers-view">

  <div id="app">
    <!-- Barra de navegacion -->
    <header class="header">
      <!-- Barra de navegacion -->
      <nav class="main-navbar" id="mainNavbar">
        <!-- Logo de la empresa que lleva al home -->
        <a href="home.php" class="main-navbar__brand">
          <img src="../img/logo.png" alt="Logo de Carmú" class="main-navbar__img" />
        </a>

        <!-- El boton que controla el menu colapsable -->
        <button class="main-navbar__toggler" id="navbar-toggler">
          <i class="icon-bars"></i>
        </button>

        <!-- Menu colapsable -->
        <div class="main-navbar__nav" id="navbar-collapse">
          <ul class="main-navbar__list">

            <li class="main-navbar__item">
              <a href="./home.php" class="main-navbar__link">
                <i class="main-navbar__link__prepend icon-home"></i>
                <span class="main-navbar__link__body">Principal</span>
              </a>
            </li>
            <!-- Fin del elemento -->

            <li class="main-navbar__item dropdown">
              <a href="#" class="main-navbar__link main-navbar__link--active">
                <i class="main-navbar__link__prepend icon-home"></i>
                <span class="main-navbar__link__body">Ventas</span>
                <i class="main-navbar__link__append icon-chevron-down dropdown__icon"></i>
              </a>

              <nav class="dropdown__nav">
                <ul class="dropdown__list">

                  <li class="dropdown__item">
                    <a href="#" class="dropdown__link" id="sumaryLink">Categorías <span class="dropdown__link__new">New</span></a>
                  </li>

                  <li class="dropdown__item">
                    <a href="#" class="dropdown__link" id="sumaryLink">Registrar Venta <span class="dropdown__link__new">New</span></a>
                  </li>

                  <li class="dropdown__item">
                    <a href="#" class="dropdown__link" id="sumaryLink">Historial <span class="dropdown__link__new">New</span></a>
                  </li>

                </ul>
              </nav>
              <!-- Fin del dropdown -->
            </li>
            <!-- Fin del elemento -->

            <li class="main-navbar__item">
              <a href="customers.php" class="main-navbar__link link__active">
                <i class="main-navbar__link__prepend icon-user"></i>
                <span class="main-navbar__link__body">Clientes</span>
              </a>
            </li>
            <!-- Fin del elemento -->

            <li class="main-navbar__item">
              <a href="products.php" class="main-navbar__link link__active">
                <i class="main-navbar__link__prepend icon-home"></i>
                <span class="main-navbar__link__body">Productos</span>
              </a>
            </li>
            <!-- Fin del elemento -->


          </ul>
          <!-- Fin de la lista de enlaces -->

          <a href="./logout.php" class="btn btn--red">Cerrar sesión</a>

        </div>
        <!-- Fin del meú colpasable -->
      </nav>

    </header>
    <!--Fin de la barra de navegacion-->

    <div id="categories">
      
    </div>

  </div>

  <!-- Librería de Chart.ls -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js@2.9.3/dist/Chart.min.js"></script>

  <!-- Librería de MomentJs -->
  <script src="../js/moment.js"></script>

  <!-- Script general con las utilidades basicas -->
  <script src=<?= "../js/app.js?v=" . VERSION ?>></script>

  <!-- Librería de Vue.js -->
  <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>

  <!-- Script de esta vista -->
  <script src=<?= "./js/sales.js?v=" . VERSION ?>></script>
</body>

</html>