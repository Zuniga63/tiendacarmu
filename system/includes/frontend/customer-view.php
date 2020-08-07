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
  <div>
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
                    <a href="#" class="dropdown__link" id="sumaryLink">Resumen <span class="dropdown__link__new">New</span></a>
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
                  <li class="dropdown__item">
                    <a href="#" class="dropdown__link" id="customerHistoryLink">Historial <span class="dropdown__link__new">New</span></a>
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
            <canvas id="customerSumary"></canvas>
          </figure>
          <p class="chart-section__info" id="customerSumaryInfo"></p>
        </section>

        <section class="chart-section">
          <h2 class="chart-section__title">Morosidad de clientes activos</h2>
          <figure class="chart-section__chart">
            <canvas id="delinquentCustomers"></canvas>
          </figure>
          <p class="chart-section__info" id="delinquentCustomersInfo"></p>
        </section>

        <section class="chart-section">
          <h2 class="chart-section__title">Dificultad de cobro</h2>
          <figure class="chart-section__chart">
            <canvas id="collectionDificulty"></canvas>
          </figure>
          <p class="chart-section__info" id="collectionDificultyInfo"></p>
        </section>

        <section class="chart-section">
          <h2 class="chart-section__title">Flujo de efectivo</h2>
          <figure class="chart-section__chart">
            <canvas id="cashFlowQuinquenal"></canvas>
          </figure>
          <p class="chart-section__info">El grafico de barras anterior muestra los flujos de dinero en relación a los créditos de las últimas cuatro quincenas.</p>
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
        <div class="view">
          <section class="view__section">
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

            <form action="" class="form form--bg-light" id="newPaymentForm">
              <h2 class="form__title">Registrar Abono</h2>
              <!-- CUSTOMER CARD -->
              <div class="customer-card" id="newPaymentCustomer">
                <h3 class="customer-card__name">Nombre del cliente</h3>
                <p class="customer-card__balance">$ 1.000.000</p>
                <div>
                  <p class="customer-card__debts">Creditos: x</p>
                  <p class="customer-card__points">Puntos: x</p>
                </div>
              </div>
              <!-- FORMULARIO -->
              <div class="form__group">
                <div class="form__group__body">
                  <label class="form__label">Forma de pago</label>

                  <div class="form__container-flex">
                    <div class="form__group form__group--oneline-flex">
                      <input type="radio" name="payment_type" id="newPaymentCashPayment" class="form__input form__input--check" checked>
                      <label for="newPaymentCashPayment" class="form__label">Efectivo</label>
                    </div>
                    <div class="form__group form__group--oneline-flex">
                      <input type="radio" name="payment_type" id="cardPayment" class="form__input form__input--check">
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
                  <label class="form__label" for="newPaymentAmount">Importe</label>
                  <input class="form__input form__input--money form__input--money-big" type="text" name="payment_amount" placeholder="$0" id="newPaymentAmount" require>
                </div>
                <div class="form__group__footer">
                  <span class="alert alert--danger" id="newPaymentAmountAlert">Este codigo ya está en uso</span>
                </div>
              </div>
              <P class="alert alert--big" id="newPaymentAlert">El nombre del cliente es obligatorio</P>
              <input type="submit" value="Registrar Abono" class="btn btn--success" id="newPaymentBtn">
            </form>
          </section>
          <aside class="view__sidebar">
            <div class="customer-sumary__container">
              <h3 class="customer-sumary__title">Historial de Creditos</h3>
              <div class="form__container-flex">
                <div class="form__group form__group--oneline-flex">
                  <input type="radio" name="select" id="consultDebtsAll" class="form__input form__input--check">
                  <label for="consultDebtsAll" class="form__label">Todos</label>
                </div>
                <div class="form__group form__group--oneline-flex">
                  <input type="radio" name="select" class="form__input form__input--check" checked>
                  <label for="consultDebtsOutstanding" class="form__label">Pendientes</label>
                </div>
                <div class="form__group form__group--oneline-flex">
                  <input type="radio" name="select" class="form__input form__input--check">
                  <label for="consultDebtsPaid" class="form__label">Pagados</label>
                </div>
              </div>
              <div class="customer-sumary__box scroll">
              </div>
              <p class="search-box__count show">2 Creditos; $ 4.400.000</p>
            </div>

            <div class="customer-sumary__container">
              <h3 class="customer-sumary__title">Historial de pagos</h3>
              <div class="customer-sumary__box scroll">

              </div>
              <p class="search-box__count show">2 Abonos; $ 1.300.000</p>
            </div>
          </aside>
        </div>
      </div>

      <!-- SECCION PARA AGREGAR UNA NUEVA DEUDA -->
      <div class="customers-view__container" id="newDebt">
        <div class="view">
          <section class="view__section">
            <!-- SECCION PARA SELECCIONAR CLIENTE -->
            <div class="search-box">
              <input type="text" class="search-box__search" id="newDebtSearchBox" placeholder="Buscar por nombre">
              <div class="search-box__result scroll" id="newDebtSearchBoxResult">
              </div>
              <p class="search-box__count"></p>
            </div>

            <!-- FORMULARIO DE DATOS -->
            <form class="form form--bg-light" id="newCreditForm">
              <h2 class="form__title">Registrar Crédito</h2>
              <!-- CUSTOMER CARD -->
              <div class="customer-card" id="newDebtCustomer">
                <h3 class="customer-card__name">Nombre del cliente</h3>
                <p class="customer-card__balance">$ 1.000.000</p>
                <div>
                  <p class="customer-card__debts">Creditos: x</p>
                  <p class="customer-card__points">Puntos: x</p>
                </div>
              </div>

              <!-- CAMPO PARA DETALLES DEL CREDITO -->
              <div class="form__group">
                <div class="form__group__body">
                  <label for="creditDescription" class="form__label form__label--center">Detalles del credito</label>
                  <textarea name="credit_description" id="creditDescription" cols="30" rows="4" class="form__input" placeholder="Escribe los detalles aquí" required></textarea>
                </div>
                <div class="form__group__footer">
                  <span class="alert alert--danger" id="creditDescriptionAlert">Este campo es obligatorio</span>
                  <span class="form__input__length" id="creditDescriptionLength">255</span>
                </div>
              </div>
              <!--FIN DEL GRUPO-->

              <!-- IMPORTE A abonar -->
              <div class="form__group">
                <div class="form__group__body">
                  <label class="form__label" for="creditAmount">Importe</label>
                  <input class="form__input form__input--money form__input--money-big" type="text" name="credit_amount" id="creditAmount" placeholder="$ 0" required>
                </div>
                <div class="form__group__footer">
                  <span class="alert alert--danger" id="creditAmountAlert">Este codigo ya está en uso</span>
                </div>
              </div>
              <!-- ALERTA DE ERROR EN DATOS DE CREDITO -->
              <P class="alert alert--big" id="newCreditAlert">El nombre del cliente es obligatorio</P>
              <input type="submit" value="Registrar Credito" class="btn btn--success" id="newCreditBtn">
            </form>
          </section>

          <aside class="view__sidebar">
            <div class="customer-sumary__container">
              <h3 class="customer-sumary__title">Historial de Creditos</h3>
              <div class="form__container-flex">
                <div class="form__group form__group--oneline-flex">
                  <input type="radio" name="select" id="consultDebtsAll" class="form__input form__input--check">
                  <label for="consultDebtsAll" class="form__label">Todos</label>
                </div>
                <div class="form__group form__group--oneline-flex">
                  <input type="radio" name="select" class="form__input form__input--check" checked>
                  <label class="form__label">Pendientes</label>
                </div>
                <div class="form__group form__group--oneline-flex">
                  <input type="radio" name="select" class="form__input form__input--check">
                  <label class="form__label">Pagados</label>
                </div>
              </div>
              <div class="customer-sumary__box scroll">
              </div>
              <p class="search-box__count show">2 Creditos; $ 4.400.000</p>
            </div>

            <div class="customer-sumary__container">
              <h3 class="customer-sumary__title">Historial de pagos</h3>
              <div class="customer-sumary__box scroll">

              </div>
              <p class="search-box__count show">2 Abonos; $ 1.300.000</p>
            </div>
          </aside>
        </div>

      </div>

      <!-- SECCION PARA ACTUALIZAR UN CLIENTE -->
      <div class="customers-view__container" id="customerUpdate">
        <div class="search-box">
          <input type="text" class="search-box__search" placeholder="Buscar por nombre">
          <div class="search-box__result scroll">
            <!-- <div class="customer-card">
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
          </div> -->
          </div>
          <p class="search-box__count"></p>
        </div>

        <form class="form form--bg-light" id="customerUpdateForm">
          <h2 class="form__title">Formulario de Actualización</h2>
          <div class="form__group">
            <div class="form__group__body">
              <label class="form__label" for="customerName">Nombre del cliente</label>
              <input class="form__input" type="text" name="first_name" id="updateName" placeholder="Ingresar nombres aquí" required>
            </div>
            <div class="form__group__footer">
              <span class="alert alert--danger">Este codigo ya está en uso</span>
            </div>
          </div>
          <!-- CAMPO PARA EL APELLIDO DEL CLIENTE -->
          <div class="form__group">
            <div class="form__group__body">
              <label class="form__label" for="customerLastname">Apellido del cliente</label>
              <input class="form__input" type="text" name="last_name" id="updateLastname" placeholder="Ingresar el apellido aquí">
            </div>
            <div class="form__group__footer">
              <span class="alert alert--danger">Este codigo ya está en uso</span>
            </div>
          </div>
          <!-- CAMPO PARA EL NIT o CC -->
          <div class="form__group">
            <div class="form__group__body">
              <label class="form__label" for="customerNit">Nit o CC</label>
              <input class="form__input" type="text" name="nit" id="updateNit" placeholder="Ingresar Nit o C.C">
            </div>
            <div class="form__group__footer">
              <span class="alert alert--danger">Este codigo ya está en uso</span>
            </div>
          </div>
          <!-- CAMPO PARA EL TELEFONO -->
          <div class="form__group">
            <div class="form__group__body">
              <label class="form__label" for="customerPhone">Numero de Telefono</label>
              <input class="form__input" type="text" name="phone" id="updatePhone" placeholder="Ingresar telefono">
            </div>
            <div class="form__group__footer">
              <span class="alert alert--danger">Este codigo ya está en uso</span>
            </div>
          </div>
          <!-- CAMPO PARA EL TELEFONO -->
          <div class="form__group">
            <div class="form__group__body">
              <label class="form__label" for="customerEmail">Correo</label>
              <input class="form__input" type="email" name="email" id="updateEmail" placeholder="Ingresar correo">
            </div>
            <div class="form__group__footer">
              <span class="alert alert--danger">Este codigo ya está en uso</span>
            </div>
          </div>
          <!-- ALERTA DE ERROR EN DATOS DE CREDITO -->
          <P class="alert alert--big" id="customerUpdateAlert">El nombre del cliente es obligatorio</P>
          <input type="submit" value="Actualizar Cliente" class="btn btn--success" id="updateBtn">
        </form>
      </div>

      <!-- SECCION PARA CONSULTAR DEUDAS -->
      <div class="customers-view__container" id="consultDebts">
        <div class="search-box">
          <input type="text" class="search-box__search" placeholder="Buscar por nombre">
          <div class="search-box__result scroll">
            <!-- <div class="customer-card">
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
          </div> -->
          </div>
          <p class="search-box__count"></p>
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
              <input type="radio" name="select" id="consultDebtsAll" class="form__input form__input--check">
              <label for="consultDebtsAll" class="form__label">Todos</label>
            </div>
            <div class="form__group form__group--oneline-flex">
              <input type="radio" name="select" id="consultDebtsOutstanding" class="form__input form__input--check" checked>
              <label for="consultDebtsOutstanding" class="form__label">Pendientes</label>
            </div>
            <div class="form__group form__group--oneline-flex">
              <input type="radio" name="select" id="consultDebtsPaid" class="form__input form__input--check">
              <label for="consultDebtsPaid" class="form__label">Pagados</label>
            </div>
          </div>
          <div class="customer-sumary__box scroll" id="debtsHistory">
            <!-- <div class="debt-card">
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
          </div> -->
          </div>
          <p class="search-box__count show" id="debtsSumary">2 Creditos; $ 4.400.000</p>
        </div>

        <div class="customer-sumary__container">
          <h3 class="customer-sumary__title">Historial de pagos</h3>
          <div class="customer-sumary__box scroll" id="paymentsHistory">
            <!-- <div class="payment-row">
            <p class="paymen-row__date">01-02-2020</p>
            <p class="payment-row__amount">$ 1.000.000</p>
          </div>
          <div class="payment-row">
            <p class="paymen-row__date">01-03-2020</p>
            <p class="payment-row__amount">$ 300.000</p>
          </div> -->
          </div>
          <p class="search-box__count show" id="paymentsSumary">2 Abonos; $ 1.300.000</p>
        </div>
      </div>

      <!-- SECCION PARA CONSULTAR EL HISTORIAL -->
      <div class="customers-view__container" id="customerHistory">
        <div class="history__options">
          <p class="history__legend">Tipo de historial</p>
          <div class="history__option">
            <input type="radio" name="historyType" id="historyNews" class="history__input">
            <label for="historyNews" class="history__label">Nuevos</label>
          </div>
          <div class="history__option">
            <input type="radio" name="historyType" id="historyUpdates" class="history__input">
            <label for="historyUpdates" class="history__label">Actualizaciones</label>
          </div>
          <div class="history__option">
            <input type="radio" name="historyType" id="creditHistory" class="history__input">
            <label for="creditHistory" class="history__label">Creditos</label>
          </div>
          <div class="history__option">
            <input type="radio" name="historyType" id="paymentHistory" class="history__input">
            <label for="paymentHistory" class="history__label">Abonos</label>
          </div>
        </div>

        <div class="history__container">
          <p class="history__legend">Resultados</p>
          <div class="history__cards scroll" id="historyBox">
            <!-- <div class="history__card history__card--recently">
            <p class="history__card__title">Nombre del cliente</p>
            <p class="history__card__date">Ayer</p>
            <p class="history__card__info">Se registró un credito por valor de <span class="history__card__bold">$1.200.000</span></p>
            <p class="history__card__author">Responsable: <span class="history__card__bold">Julanito de Tal</span></p>
          </div>
          <div class="history__card">
            <p class="history__card__title">Nombre del cliente</p>
            <p class="history__card__date">La semana pasada</p>
            <p class="history__card__info">Se registró un credito por valor de <span class="history__card__bold">$1.200.000</span></p>
            <p class="history__card__author">Responsable: <span class="history__card__bold">Julanito de Tal</span></p>
          </div>
          <div class="history__card">
            <p class="history__card__title">Nombre del cliente</p>
            <p class="history__card__date">La semana pasada</p>
            <p class="history__card__info">Se registró un credito por valor de <span class="history__card__bold">$1.200.000</span></p>
            <p class="history__card__author">Responsable: <span class="history__card__bold">Julanito de Tal</span></p>
          </div>
          <div class="history__card">
            <p class="history__card__title">Nombre del cliente</p>
            <p class="history__card__date">La semana pasada</p>
            <p class="history__card__info">Se registró un credito por valor de <span class="history__card__bold">$1.200.000</span></p>
            <p class="history__card__author">Responsable: <span class="history__card__bold">Julanito de Tal</span></p>
          </div>
          <div class="history__card">
            <p class="history__card__title">Nombre del cliente</p>
            <p class="history__card__date">La semana pasada</p>
            <p class="history__card__info">Se registró un credito por valor de <span class="history__card__bold">$1.200.000</span></p>
            <p class="history__card__author">Responsable: <span class="history__card__bold">Julanito de Tal</span></p>
          </div> -->
          </div>
        </div>
      </div>
    </div>
  </div>

  <div id="app">
    <customer-register 
      :customers="customers" 
      id="customerReg"
      @update-customer="updateCustomer"
      @new-customer="newCustomer"
    >
    </customer-register>

    <div class="view" id="operationView">
      <section class="view__section">
        <div class="container">
          <div class="container__header container__header--success">
            <h1 class="container__title">Sistema de Clientes</h1>
            <p class="container__subtitle">Registrar Operaciones</p>
          </div>
          <!-- Modulo para la busqueda de cliente -->
          <search-box :customers="customers" @customer-selected="onCustomerSelected"></search-box>
          <!-- FORMULARIO DE REGISTRO O ACTUALIZACIÓN -->
          <new-operation-form></new-operation-form>
          <!-- Contenedor con las tarjetas de creditos -->
          <customer-credits :customer="customerSelected" id="creditHistoryMovil"></customer-credits>
          <!-- Historial del cliente -->
          <div class="">
            <div class="history__header">
              <h2 class="history__title">Historial</h2>
            </div>
            <div class="history__head">
              <table class="table">
                <thead>
                  <tr class="table__row-header">
                    <th class="table__header table--34">Fecha</th>
                    <th class="table__header table--33">Credito</th>
                    <th class="table__header table--33">Abono</th>
                  </tr>
                </thead>
              </table>
            </div>
            <div class="history__body scroll">
              <table class="table">
                <tbody class="table__body">
                  <tr class="table__row" key="customer.id">
                    <td class="table__data table--34">12-03-01</td>
                    <td class="table__data table--33">$1.2000.000</td>
                    <td class="table__data table--33">$1.200.000</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="history__footer">
              <p></p>
              <p class="history__info">Operaciones: 0</p>
            </div>
          </div>
        </div>
      </section>
      <aside class="view__sidebar">
        <!-- Contenedor con las tarjetas de creditos -->
        <customer-credits :customer="customerSelected" id="creditHistoryDesktop"></customer-credits>

        <div class="history__header">
          <h2 class="history__title">Historial</h2>
        </div>
        <div class="history__head">
          <table class="table">
            <thead>
              <tr class="table__row-header">
                <th class="table__header table--25">Fecha</th>
                <th class="table__header table--25">Credito</th>
                <th class="table__header table--25">Abono</th>
                <th class="table__header table--25">Saldo</th>
              </tr>
            </thead>
          </table>
        </div>
        <div class="history__body scroll">
          <table class="table">
            <tbody class="table__body">
              <template v-for="customer in customers">
                <tr class="table__row" :key="customer.id">
                  <td class="table__data table--25">{{customer.firstName}}</td>
                  <td class="table__data table--25">{{customer.lastName}}</td>
                  <td class="table__data table--25">{{customer.phone}}</td>
                  <td class="table__data table--25">
                    <input type="checkbox" name="" id="" style="zoom: 2;" />
                  </td>
                </tr>
              </template v-for="customer">
              
            </tbody>
          </table>
        </div>
        <div class="history__footer">
          <p></p>
          <p class="history__info">Operaciones: 0</p>
        </div>
      </aside>
    </div>
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