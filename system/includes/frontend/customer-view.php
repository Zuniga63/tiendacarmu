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

<body class="customers-view">
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
                  <a href="#" class="dropdown__link" id="sumaryLink">Resumen</a>
                </li>
                <li class="dropdown__item">
                  <a href="#" class="dropdown__link" id="newCustomerLink">Nuevo Cliente</a>
                </li>
                <li class="dropdown__item">
                  <a href="#" class="dropdown__link dropdown__link--disabled">Agregar Transaccion</a>
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

  <div class="customers-view__body">
    <div class="customers-view__header">
      <h1 class="customers-view__title">Sistema de clientes</h1>
      <p class="customers-view__subtitle" id="systemLegend"></p>
    </div>

    <div class="customers-view__container" id="sumary">
      <section class="chart-section">
        <h2 class="chart-section__title">Clientes Activos e Inactivos</h2>
        <figure class="chart-section__chart">
          <canvas id="myChart"></canvas>
        </figure>
        <p class="chart-section__info">Este grafico muestra el numero clientes activos de los últimos tres meses.</p>
      </section>

      <section class="chart-section">
        <h2 class="chart-section__title">Morosidad de clientes activos</h2>
        <figure class="chart-section__chart">
          <canvas id="myChart2"></canvas>
        </figure>
        <p class="chart-section__info">Este grafico muestra el numero clientes que están al día y los clientes morosos del conjunto de clientes activos</p>
      </section>

      <section class="chart-section">
        <h2 class="chart-section__title">Clientes Inactivos</h2>
        <figure class="chart-section__chart">
          <canvas id="myChart3"></canvas>
        </figure>
        <p class="chart-section__info">Este grafico muestra cuantos de los clientes que están inactivos presentan deudas y cuales están al día.</p>
      </section>

      <section class="chart-section">
        <h2 class="chart-section__title">Flujo de efectivo</h2>
        <figure class="chart-section__chart">
          <canvas id="myChart4"></canvas>
        </figure>
        <p class="chart-section__info">Este grafico muestra cuantos de los clientes que están inactivos presentan deudas y cuales están al día.</p>
      </section>
    </div>

    <div class="customers-view__container" id="newCustomer">
      <form action="" class="form form--bg-light">
        <h2 class="form__title">Formulario de registro</h2>
        <div class="form__group">
          <div class="form__group__body">
            <label class="form__label" for="customerName">Nombre del cliente</label>
            <input class="form__input" type="text" name="customer_name" id="customerName" placeholder="Ingresar nombres aquí">
          </div>
          <div class="form__group__footer">
            <span class="alert alert--danger">Este codigo ya está en uso</span>
          </div>
        </div>
        <!-- CAMPO PARA EL APELLIDO DEL CLIENTE -->
        <div class="form__group">
          <div class="form__group__body">
            <label class="form__label" for="customerLastname">Apellido del cliente</label>
            <input class="form__input" type="text" name="customer_lastname" id="customerLastname" placeholder="Ingresar el apellido aquí">
          </div>
          <div class="form__group__footer">
            <span class="alert alert--danger">Este codigo ya está en uso</span>
          </div>
        </div>
        <!-- CAMPO PARA EL NIT o CC -->
        <div class="form__group">
          <div class="form__group__body">
            <label class="form__label" for="customerNit">Nit o CC</label>
            <input class="form__input" type="text" name="customer_nit" id="customerNit" placeholder="Ingresar Nit o C.C">
          </div>
          <div class="form__group__footer">
            <span class="alert alert--danger">Este codigo ya está en uso</span>
          </div>
        </div>
        <!-- CAMPO PARA EL TELEFONO -->
        <div class="form__group">
          <div class="form__group__body">
            <label class="form__label" for="customerPhone">Numero de Telefono</label>
            <input class="form__input" type="text" name="customer_phone" id="customerPhone" placeholder="Ingresar telefono">
          </div>
          <div class="form__group__footer">
            <span class="alert alert--danger">Este codigo ya está en uso</span>
          </div>
        </div>
        <!-- CAMPO PARA EL TELEFONO -->
        <div class="form__group">
          <div class="form__group__body">
            <label class="form__label" for="customerEmail">Correo</label>
            <input class="form__input" type="email" name="customer_phone" id="customerEmail" placeholder="Ingresar correo">
          </div>
          <div class="form__group__footer">
            <span class="alert alert--danger">Este codigo ya está en uso</span>
          </div>
        </div>

        <input type="submit" value="Registrar Cliente" class="btn btn--success">
      </form>
    </div>

  </div>


  <script src="https://cdn.jsdelivr.net/npm/chart.js@2.9.3/dist/Chart.min.js"></script>
  <script src="../js/app.js"></script>
  <script src="./js/customers.js"></script>
</body>

</html>