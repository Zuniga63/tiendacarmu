<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sistema de clientes</title>
  <!-- SE CARGAN LAS FUENTES DE LOS ICONOS -->
  <link rel="stylesheet" href=<?= "../font/style.css?v=" . VERSION ?> />
  <!-- FONT AWESOME -->
  <!-- <script src="https://use.fontawesome.com/7ebcf381fa.js"></script> -->
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.14.0/css/all.css" integrity="sha384-HzLeBuhoNPvSl5KYnjx0BT+WB0QEEqLprO+NBkkk5gbc67FTaL7XIGa2w1L0Xbgc" crossorigin="anonymous">

  <!-- SE CARGAN LOS ESTILOS GENERALES -->
  <link rel="stylesheet" href=<?= "../css/normalize.css?v=" . VERSION ?> />
  <link rel="stylesheet" href=<?= "../css/main.css?v=" . VERSION ?> />
</head>

<body class="customers-view">
  <div class="preloader show" id="preload">
    <div class="loader"></div>
  </div>
  <!-- <div>


    <div class="customers-view__body">

    </div>
  </div> -->

  <div id="app">

    <!-- Barra de navegacion -->
    <header class="header">
      <nav class="main-navbar" id="mainNavbar">
        <a href="home.php" class="main-navbar__brand">
          <img src="../img/logo.png" alt="Logo de Carmú" class="main-navbar__img" />
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
                <i class="main-navbar__link__append icon-chevron-down dropdown__icon"></i>
              </a>

              <nav class="dropdown__nav">
                <ul class="dropdown__list">
                  <li class="dropdown__item">
                    <a href="#" class="dropdown__link active">Operaciones e Historial</a>
                  </li>
                  <li class="dropdown__item">
                    <a href="#" class="dropdown__link">Nuevo y Actualización</a>
                  </li>
                  <li class="dropdown__item">
                    <a href="#" class="dropdown__link disabled">Historial de movimientos</a>
                  </li>
                  <li class="dropdown__item">
                    <a href="#" class="dropdown__link disabled">Informes</a>
                  </li>
                  <li class="dropdown__item">
                    <a href="#" class="dropdown__link disabled">Gestionar Clientes</a>
                  </li>
                </ul>
              </nav>
            </li>

            <li class="main-navbar__item">
              <a href="sales.php" class="main-navbar__link link__active">
                <i class="main-navbar__link__prepend fas fa-dollar-sign"></i>
                <span class="main-navbar__link__body">Ventas</span>
              </a>
            </li>

            <li class="main-navbar__item">
              <a href="products.php" class="main-navbar__link link__active">
                <i class="main-navbar__link__prepend icon-home"></i>
                <span class="main-navbar__link__body">Productos</span>
              </a>
            </li>
          </ul>

          <a href="./logout.php" class="btn btn--red">Cerrar sesión</a>
        </div>
      </nav>
    </header>

    <customer-register :customers="customers" id="customerReg" @update-customer="updateCustomer" @new-customer="newCustomer">
    </customer-register>

    <operation-register :customers="customers" id="customerOperation" @new-credit="onNewCredit" @new-payment="onNewPayment"></operation-register>

    <waiting-modal v-bind:visible="waiting"></waiting-modal>
    <process-result v-bind:process-result="processResult" @hidden-modal="processResult.visible = false"></process-result>
  </div>

  <!-- Librería de Chart.js -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js@2.9.3/dist/Chart.min.js"></script>
  <!-- Libería de Moment.js -->
  <script src="../js/moment.js"></script>
  <!-- Librería de Vue.js -->
  <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>

  <!-- Scripts Personalizados -->
  <script src=<?= "../js/app.js?v=" . VERSION ?>></script>
  <script src=<?= "./js/customers.js?v=" . VERSION ?>></script>
</body>

</html>