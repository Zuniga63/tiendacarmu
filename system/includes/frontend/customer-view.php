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
                  <a href="#" class="dropdown__link" id="sumaryLink">Resumen</a>
                </li>
                <li class="dropdown__item">
                  <a href="#" class="dropdown__link" id="newCustomerLink">Nuevo Cliente</a>
                </li>
                <li class="dropdown__item">
                  <a href="#" class="dropdown__link" id="newPaymentLink">Registrar Abono</a>
                </li>
                <li class="dropdown__item">
                  <a href="#" class="dropdown__link" id="newDebtLink">Registrar Credito</a>
                </li>
                <li class="dropdown__item">
                  <a href="#" class="dropdown__link" id="customerUpdateLink">Actualizar Cliente</a>
                </li>
                <li class="dropdown__item">
                  <a href="#" class="dropdown__link" id="consultDebtsLink">Consultar creditos</a>
                </li>
              </ul>
            </nav>
          </li>
        </ul>

        <a href="./logout.php" class="btn btn--red">Cerrar sesión</a>
      </div>
    </nav>
  </header>
  <!--Fin de la barra de navegacion-->

  <div class="customers-view__body">
    <div class="customers-view__header">
      <h1 class="customers-view__title">Sistema de clientes</h1>
      <p class="customers-view__subtitle" id="systemLegend"></p>
    </div>

    <!-- SECCION DE RESUMEN -->
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

    <!-- NEW CUSTOMER SECTION -->
    <div class="customers-view__container" id="newCustomer">
      <form class="form form--bg-light" id="newCustomerForm">
        <h2 class="form__title">Formulario de registro</h2>
        <!-- CAMPO PARA EL NOMBRE DEL CLIENTE -->
        <div class="form__group">
          <div class="form__group__body">
            <label class="form__label" for="newCustomerFirstName">Nombre del cliente</label>
            <input class="form__input" type="text" name="first_name" id="newCustomerFirstName" placeholder="Ingresar nombre aquí" required>
          </div>
          <div class="form__group__footer">
            <span class="alert alert--danger">El nombre ya está en uso</span>
          </div>
        </div>
        <!-- CAMPO PARA EL APELLIDO DEL CLIENTE -->
        <div class="form__group">
          <div class="form__group__body">
            <label class="form__label" for="newCustomerLastName">Apellido del cliente</label>
            <input class="form__input" type="text" name="last_name" id="newCustomerLastName" placeholder="Ingresar el apellido aquí">
          </div>
          <div class="form__group__footer">
            <span class="alert alert--danger">Este codigo ya está en uso</span>
          </div>
        </div>
        <!-- CAMPO PARA EL NIT o CC -->
        <div class="form__group">
          <div class="form__group__body">
            <label class="form__label" for="newCustomerNit">Nit o CC</label>
            <input class="form__input" type="text" name="nit" id="newCustomerNit" placeholder="Ingresar Nit o C.C">
          </div>
          <div class="form__group__footer">
            <span class="alert alert--danger">Este codigo ya está en uso</span>
          </div>
        </div>
        <!-- CAMPO PARA EL TELEFONO -->
        <div class="form__group">
          <div class="form__group__body">
            <label class="form__label" for="newCustomerPhone">Numero de Telefono</label>
            <input class="form__input" type="text" name="phone" id="newCustomerPhone" placeholder="Ingresar telefono">
          </div>
          <div class="form__group__footer">
            <span class="alert alert--danger">Este codigo ya está en uso</span>
          </div>
        </div>
        <!-- CAMPO PARA EL TELEFONO -->
        <div class="form__group">
          <div class="form__group__body">
            <label class="form__label" for="newCustomerEmail">Correo</label>
            <input class="form__input" type="email" name="email" id="newCustomerEmail" placeholder="Ingresar correo">
          </div>
          <div class="form__group__footer">
            <span class="alert alert--danger">Este codigo ya está en uso</span>
          </div>
        </div>
        <P class="alert alert--danger alert--big" id="newCustomerAlert">El nombre del cliente es obligatorio</P>
        <input type="submit" value="Registrar Cliente" class="btn btn--success" id="newCustomerBtn">
      </form>
    </div>

    <!-- SECCION PARA AGREGAR UN PAGO -->
    <div class="customers-view__container" id="newPayment">
      <div class="search-box">
        <input type="text" class="search-box__search" placeholder="Buscar por nombre">
        <div class="search-box__result scroll">
          <div class="customer-card">
            <h3 class="customer-card__name">Nombre del cliente</h3>
            <p class="customer-card__balance">$ 1.000.000</p>
            <div>
              <p class="customer-card__debts">Creditos: x</p>
              <p class="customer-card__points">Puntos: x</p>
            </div>
          </div>
          <div class="customer-card customer-card--late">
            <h3 class="customer-card__name">Nombre del cliente</h3>
            <p class="customer-card__balance">$ 1.000.000</p>
            <div>
              <p class="customer-card__debts">Creditos: x</p>
              <p class="customer-card__points">Puntos: x</p>
            </div>
          </div>
          <div class="customer-card">
            <h3 class="customer-card__name">Nombre del cliente</h3>
            <p class="customer-card__balance">$ 0</p>
            <div>
              <p class="customer-card__debts">Creditos: x</p>
              <p class="customer-card__points">Puntos: x</p>
            </div>
          </div>
          <div class="customer-card customer-card--late">
            <h3 class="customer-card__name">Nombre del cliente</h3>
            <p class="customer-card__balance">$ 1.000.000</p>
            <div>
              <p class="customer-card__debts">Creditos: x</p>
              <p class="customer-card__points">Puntos: x</p>
            </div>
          </div>
          <div class="customer-card">
            <h3 class="customer-card__name">Nombre del cliente</h3>
            <p class="customer-card__balance">$ 1.000.000</p>
            <div>
              <p class="customer-card__debts">Creditos: x</p>
              <p class="customer-card__points">Puntos: x</p>
            </div>
          </div>
          <div class="customer-card customer-card--late">
            <h3 class="customer-card__name">Nombre del cliente</h3>
            <p class="customer-card__balance">$ 1.000.000</p>
            <div>
              <p class="customer-card__debts">Creditos: x</p>
              <p class="customer-card__points">Puntos: x</p>
            </div>
          </div>
        </div>
        <p class="search-box__count">6 Clientes</p>
      </div>

      <form action="" class="form form--bg-light">
        <h2 class="form__title">Registrar Abono</h2>
        <div class="customer-card" id="newPaymentCustomer">
          <h3 class="customer-card__name">Nombre del cliente</h3>
          <p class="customer-card__balance">$ 1.000.000</p>
          <div>
            <p class="customer-card__debts">Creditos: x</p>
            <p class="customer-card__points">Puntos: x</p>
          </div>
        </div>
        <div class="form__group">
          <div class="form__group__body">
            <label class="form__label">Forma de pago</label>

            <div class="form__container-flex">
              <div class="form__group form__group--oneline-flex">
                <input type="radio" name="payment_type" id="cashPayment" class="form__input form__input--check">
                <label for="cashPayment" class="form__label">Efectivo</label>
              </div>
              <div class="form__group form__group--oneline-flex">
                <input type="radio" name="payment_type" id="itemOutstanding" class="form__input form__input--check">
                <label for="cardPayment" class="form__label">Tarjeta</label>
              </div>
            </div>
          </div>
          <div class="form__group__footer show">
            <span class="alert alert--danger">Este codigo ya está en uso</span>
          </div>
        </div>
        <!-- IMPORTE A abonar -->
        <div class="form__group">
          <div class="form__group__body">
            <label class="form__label" for="customerLastname">Importe</label>
            <input class="form__input form__input--money form__input--money-big" type="text" name="customer_lastname" placeholder="$0">
          </div>
          <div class="form__group__footer">
            <span class="alert alert--danger">Este codigo ya está en uso</span>
          </div>
        </div>
        <input type="submit" value="Registrar Abono" class="btn btn--success">
      </form>
    </div>

    <!-- SECCION PARA AGREGAR UNA NUEVA DEUDA -->
    <div class="customers-view__container" id="newDebt">
      <div class="search-box">
        <input type="text" class="search-box__search" id="newDebtSearchBox" placeholder="Buscar por nombre">
        <div class="search-box__result scroll" id="newDebtSearchBoxResult">
          <div class="customer-card">
            <h3 class="customer-card__name">Nombre del cliente</h3>
            <p class="customer-card__balance">$ 1.000.000</p>
            <div>
              <p class="customer-card__debts">Creditos: x</p>
              <p class="customer-card__points">Puntos: x</p>
            </div>
          </div>
          <div class="customer-card customer-card--late">
            <h3 class="customer-card__name">Nombre del cliente</h3>
            <p class="customer-card__balance">$ 1.000.000</p>
            <div>
              <p class="customer-card__debts">Creditos: x</p>
              <p class="customer-card__points">Puntos: -15000</p>
            </div>
          </div>
          <div class="customer-card">
            <h3 class="customer-card__name">Nombre del cliente</h3>
            <p class="customer-card__balance">$ 0</p>
            <div>
              <p class="customer-card__debts">Creditos: x</p>
              <p class="customer-card__points">Puntos: x</p>
            </div>
          </div>
          <div class="customer-card customer-card--late">
            <h3 class="customer-card__name">Nombre del cliente</h3>
            <p class="customer-card__balance">$ 1.000.000</p>
            <div>
              <p class="customer-card__debts">Creditos: x</p>
              <p class="customer-card__points">Puntos: x</p>
            </div>
          </div>
          <div class="customer-card">
            <h3 class="customer-card__name">Nombre del cliente</h3>
            <p class="customer-card__balance">$ 1.000.000</p>
            <div>
              <p class="customer-card__debts">Creditos: x</p>
              <p class="customer-card__points">Puntos: x</p>
            </div>
          </div>
          <div class="customer-card customer-card--late">
            <h3 class="customer-card__name">Nombre del cliente</h3>
            <p class="customer-card__balance">$ 1.000.000</p>
            <div>
              <p class="customer-card__debts">Creditos: x</p>
              <p class="customer-card__points">Puntos: x</p>
            </div>
          </div>
        </div>
        <p class="search-box__count">6 Clientes</p>
      </div>

      <form action="" class="form form--bg-light">
        <h2 class="form__title">Registrar Credito</h2>
        <div class="customer-card" id="newDebtCustomer">
          <h3 class="customer-card__name">Nombre del cliente</h3>
          <p class="customer-card__balance">$ 1.000.000</p>
          <div>
            <p class="customer-card__debts">Creditos: x</p>
            <p class="customer-card__points">Puntos: x</p>
          </div>
        </div>
        <div class="form__group">
          <div class="form__group__body">
            <label for="itemDescription" class="form__label form__label--center">Detalles del credito</label>
            <textarea name="itemDescription" id="itemDescription" cols="30" rows="4" class="form__input" placeholder="Escribe los detalles aquí"></textarea>
          </div>
          <div class="form__group__footer">
            <span class="alert alert--danger" id="itemDescriptionAlert">Este campo es obligatorio</span>
            <span class="form__input__length" id="itemDescriptionLength">255</span>
          </div>
        </div>
        <!--FIN DEL GRUPO-->
        <!-- IMPORTE A abonar -->
        <div class="form__group">
          <div class="form__group__body">
            <label class="form__label" for="customerLastname">Importe</label>
            <input class="form__input form__input--money form__input--money-big" type="text" name="customer_lastname" placeholder="$0">
          </div>
          <div class="form__group__footer">
            <span class="alert alert--danger">Este codigo ya está en uso</span>
          </div>
        </div>
        <input type="submit" value="Registrar Credito" class="btn btn--success">
      </form>
    </div>

    <!-- SECCION PARA ACTUALIZAR UN CLIENTE -->
    <div class="customers-view__container" id="customerUpdate">
      <div class="search-box">
        <input type="text" class="search-box__search" placeholder="Buscar por nombre">
        <div class="search-box__result scroll">
          <div class="customer-card">
            <h3 class="customer-card__name">Nombre del cliente</h3>
            <p class="customer-card__balance">$ 1.000.000</p>
            <div>
              <p class="customer-card__debts">Creditos: x</p>
              <p class="customer-card__points">Puntos: x</p>
            </div>
          </div>
          <div class="customer-card customer-card--late">
            <h3 class="customer-card__name">Nombre del cliente</h3>
            <p class="customer-card__balance">$ 1.000.000</p>
            <div>
              <p class="customer-card__debts">Creditos: x</p>
              <p class="customer-card__points">Puntos: x</p>
            </div>
          </div>
          <div class="customer-card">
            <h3 class="customer-card__name">Nombre del cliente</h3>
            <p class="customer-card__balance">$ 0</p>
            <div>
              <p class="customer-card__debts">Creditos: x</p>
              <p class="customer-card__points">Puntos: x</p>
            </div>
          </div>
          <div class="customer-card customer-card--late">
            <h3 class="customer-card__name">Nombre del cliente</h3>
            <p class="customer-card__balance">$ 1.000.000</p>
            <div>
              <p class="customer-card__debts">Creditos: x</p>
              <p class="customer-card__points">Puntos: x</p>
            </div>
          </div>
          <div class="customer-card">
            <h3 class="customer-card__name">Nombre del cliente</h3>
            <p class="customer-card__balance">$ 1.000.000</p>
            <div>
              <p class="customer-card__debts">Creditos: x</p>
              <p class="customer-card__points">Puntos: x</p>
            </div>
          </div>
          <div class="customer-card customer-card--late">
            <h3 class="customer-card__name">Nombre del cliente</h3>
            <p class="customer-card__balance">$ 1.000.000</p>
            <div>
              <p class="customer-card__debts">Creditos: x</p>
              <p class="customer-card__points">Puntos: x</p>
            </div>
          </div>
        </div>
        <p class="search-box__count">6 Clientes</p>
      </div>

      <form action="" class="form form--bg-light">
        <h2 class="form__title">Formulario de Actualización</h2>
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
            <input class="form__input" type="text" name="customer_lastname" placeholder="Ingresar el apellido aquí">
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

        <input type="submit" value="Actualizar Cliente" class="btn btn--success">
      </form>
    </div>

    <!-- SECCION PARA CONSULTAR DEUDAS -->
    <div class="customers-view__container" id="consultDebts">
      <div class="search-box">
        <input type="text" class="search-box__search" placeholder="Buscar por nombre">
        <div class="search-box__result scroll">
          <div class="customer-card">
            <h3 class="customer-card__name">Nombre del cliente</h3>
            <p class="customer-card__balance">$ 1.000.000</p>
            <div>
              <p class="customer-card__debts">Creditos: x</p>
              <p class="customer-card__points">Puntos: x</p>
            </div>
          </div>
          <div class="customer-card customer-card--late">
            <h3 class="customer-card__name">Nombre del cliente</h3>
            <p class="customer-card__balance">$ 1.000.000</p>
            <div>
              <p class="customer-card__debts">Creditos: x</p>
              <p class="customer-card__points">Puntos: x</p>
            </div>
          </div>
          <div class="customer-card">
            <h3 class="customer-card__name">Nombre del cliente</h3>
            <p class="customer-card__balance">$ 0</p>
            <div>
              <p class="customer-card__debts">Creditos: x</p>
              <p class="customer-card__points">Puntos: x</p>
            </div>
          </div>
          <div class="customer-card customer-card--late">
            <h3 class="customer-card__name">Nombre del cliente</h3>
            <p class="customer-card__balance">$ 1.000.000</p>
            <div>
              <p class="customer-card__debts">Creditos: x</p>
              <p class="customer-card__points">Puntos: x</p>
            </div>
          </div>
          <div class="customer-card">
            <h3 class="customer-card__name">Nombre del cliente</h3>
            <p class="customer-card__balance">$ 1.000.000</p>
            <div>
              <p class="customer-card__debts">Creditos: x</p>
              <p class="customer-card__points">Puntos: x</p>
            </div>
          </div>
          <div class="customer-card customer-card--late">
            <h3 class="customer-card__name">Nombre del cliente</h3>
            <p class="customer-card__balance">$ 1.000.000</p>
            <div>
              <p class="customer-card__debts">Creditos: x</p>
              <p class="customer-card__points">Puntos: x</p>
            </div>
          </div>
        </div>
        <p class="search-box__count">6 Clientes</p>
      </div>

      <div class="customer-card" id="consultDebtsCustomer">
        <h3 class="customer-card__name">Nombre del cliente</h3>
        <p class="customer-card__balance">$ 1.000.000</p>
        <div>
          <p class="customer-card__debts">Creditos: x</p>
          <p class="customer-card__points">Puntos: x</p>
        </div>
      </div>

      <div class="customer-sumary__container">
        <h3 class="customer-sumary__title">Historial de Creditos</h3>
        <div class="form__container-flex">
          <div class="form__group form__group--oneline-flex">
            <input type="radio" name="payment_type" id="cashPayment" class="form__input form__input--check">
            <label for="cashPayment" class="form__label">Todos</label>
          </div>
          <div class="form__group form__group--oneline-flex">
            <input type="radio" name="payment_type" id="itemOutstanding" class="form__input form__input--check">
            <label for="cardPayment" class="form__label">Pendientes</label>
          </div>
          <div class="form__group form__group--oneline-flex">
            <input type="radio" name="payment_type" id="itemOutstanding" class="form__input form__input--check">
            <label for="cardPayment" class="form__label">Pagados</label>
          </div>
        </div>
        <div class="customer-sumary__box scroll">
          <div class="debt-card">
            <p class="debt-card__title">Es la descripcion del credito</p>
            <p class="debt-card__date">15 de feb de 2020</p>
            <p class="debt-card__label">Valor Inicial</p>
            <p class="debt-card__label">Saldo pendiente</p>
            <p class="debt-card__money">$ 2.400.000</p>
            <p class="debt-card__money">$ 1.100.000</p>
          </div>
          <div class="debt-card">
            <p class="debt-card__title">Es la descripcion del credito</p>
            <p class="debt-card__date">15 de feb de 2020</p>
            <p class="debt-card__label">Valor Inicial</p>
            <p class="debt-card__label">Saldo pendiente</p>
            <p class="debt-card__money">$ 2.400.000</p>
            <p class="debt-card__money">$ 1.100.000</p>
          </div>
        </div>
        <p class="search-box__count show">2 Creditos; $ 4.400.000</p>
      </div>

      <div class="customer-sumary__container">
        <h3 class="customer-sumary__title">Historial de pagos</h3>
        <div class="customer-sumary__box scroll">
          <div class="payment-row">
            <p class="paymen-row__date">01-02-2020</p>
            <p class="payment-row__amount">$ 1.000.000</p>
          </div>
          <div class="payment-row">
            <p class="paymen-row__date">01-03-2020</p>
            <p class="payment-row__amount">$ 300.000</p>
          </div>
        </div>
        <p class="search-box__count show">2 Abonos; $ 1.300.000</p>
      </div>
    </div>
  </div>

  </div>


  <script src="https://cdn.jsdelivr.net/npm/chart.js@2.9.3/dist/Chart.min.js"></script>
  <script src="../js/app.js"></script>
  <script src="./js/customers.js"></script>
</body>

</html>