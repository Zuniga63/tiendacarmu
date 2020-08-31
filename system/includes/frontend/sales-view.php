<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ventas</title>

  <!-- SE CARGAN LAS FUENTES DE LOS ICONOS -->
  <link rel="stylesheet" href=<?= "../font/style.css?v=" . VERSION ?> />

  <!-- FONT AWESOME -->
  <!-- <script src="https://use.fontawesome.com/7ebcf381fa.js"></script> -->
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.14.0/css/all.css" integrity="sha384-HzLeBuhoNPvSl5KYnjx0BT+WB0QEEqLprO+NBkkk5gbc67FTaL7XIGa2w1L0Xbgc" crossorigin="anonymous">

  <!-- SE CARGAN LOS ESTILOS GENERALES -->
  <link rel="stylesheet" href=<?= "../css/normalize.css?v=" . VERSION ?> />
  <link rel="stylesheet" href=<?= "../css/main.css?v=" . VERSION ?> />

  <!-- Librería de Vue.js -->
  <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
  <!-- Librería de Vuex -->
  <script src="https://unpkg.com/vuex@3.5.1/dist/vuex.js"></script>
</head>

<!-- Se agrega esta clase para traerme todas las caracteristicas basicas de esa page -->

<body class="customers-view">

  <div class="preloader show" id="preload">
    <div class="loader"></div>
  </div>

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

            <!-- <li class="main-navbar__item">
              <a href="./home.php" class="main-navbar__link">
                <i class="main-navbar__link__prepend icon-home"></i>
                <span class="main-navbar__link__body">Principal</span>
              </a>
            </li> -->
            <!-- Fin del elemento -->

            <li class="main-navbar__item dropdown">
              <a href="#" class="main-navbar__link main-navbar__link--active">
                <i class="main-navbar__link__prepend fas fa-dollar-sign"></i>
                <span class="main-navbar__link__body">Ventas</span>
                <i class="main-navbar__link__append icon-chevron-down dropdown__icon"></i>
              </a>

              <nav class="dropdown__nav">
                <ul class="dropdown__list">

                  <li class="dropdown__item">
                    <a 
                      href="#" 
                      :class="['dropdown__link', {'dropdown__link--active' : actualView === 'categoryView'}]" 
                      @click="actualView='categoryView'"
                    >
                    Categorías <!--span class="dropdown__link__new">New</span-->
                  </a>
                  </li>

                  <li class="dropdown__item">
                    <a 
                      href="#" 
                      :class="['dropdown__link', {'dropdown__link--active' : actualView === 'salesView'}]" 
                      @click="actualView='salesView'"
                    >
                      Registrar Venta <!--span class="dropdown__link__new">New</span-->
                    </a>
                  </li>

                  <!-- <li class="dropdown__item">
                    <a href="#" class="dropdown__link" id="sumaryLink">Historial <span class="dropdown__link__new">New</span></a>
                  </li> -->

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

            <!-- <li class="main-navbar__item">
              <a href="products.php" class="main-navbar__link link__active">
                <i class="main-navbar__link__prepend icon-home"></i>
                <span class="main-navbar__link__body">Productos</span>
              </a>
            </li> -->
            <!-- Fin del elemento -->


          </ul>
          <!-- Fin de la lista de enlaces -->

          <a href="./logout.php" class="btn btn--red">Cerrar sesión</a>

        </div>
        <!-- Fin del meú colpasable -->
      </nav>

    </header>
    <!--Fin de la barra de navegacion-->

    <main class="main">
      <div class="view" id="categories" v-show="views.newCategory.visible">
        <section class="view__section">
          <div class="container">
            <container-header :title="title" subtitle="Gestion de Categorías"></container-header>
            <new-category-form id="newCategory"></new-category-form>
            <category-module :categories="categories" v-on:category-selected="onCategorySelected"></category-module>
          </div>
        </section>

        <aside class="view__sidebar">
          <sales-module :sales="views.newCategory.categorySales" :amount="views.newCategory.categorySelected ? views.newCategory.categorySelected.totalAmount : 0" :subtitle="views.newCategory.categorySelected ? views.newCategory.categorySelected.name : ''"></sales-module>
        </aside>
      </div>


      <div class="view" id="newSale" v-show="views.newSale.visible">
        <section class="view__section">
          <div class="container">
            <container-header :title="title" subtitle="Gestion de Ventas"></container-header>
            <!-- Formulario de nueva venta -->
            <new-sale-form id="saleForm"></new-sale-form>
            <sales-module id="salesMovil" class="view-desktop-colapse" :sales="sales"></sales-module>

            <category-module class="view-movil-colapse"></category-module>
          </div>
        </section>

        <aside class="view__sidebar">
          <sales-module id="salesDesktop" :sales="sales"></sales-module>

        </aside>
      </div>

      <!-- <div class="report">
        <h2 class="report__title">Informe Semanal</h2>
        <figure class="report__fig">
          <canvas class="report__graph" id="biweeklyChart"></canvas>
        </figure>
        <div class="report__statistics">
          <div class="report__statistics__section">
            <h3 class="report__statistics__title">Estadisticas Por Ventas</h3>
            <p class="report__statistics__statistic">
              Registros: <span class="text-bold">{{biweeklyReports.thisWeekReport.sales.length}}</span> /
              <span>{{biweeklyReports.lastWeekReport.sales.length}}</span>
            </p>
            <p class="report__statistics__statistic">
              Importe: <span class="text-bold">{{formatCurrency(biweeklyReports.thisWeekReport.amount)}}</span> /
              <span>{{formatCurrency(biweeklyReports.lastWeekReport.amount)}}</span>
            </p>
            <p class="report__statistics__statistic">
              Promedio: <span class="text-bold">{{formatCurrency(Math.floor(biweeklyReports.thisWeekReport.average))}}</span>
              <span class="text-bold text-small" :class="{'text-danger':biweeklyReports.thisWeekReport.upperBound*100 <=50, 'text-success': biweeklyReports.thisWeekReport.upperBound*100 >50}">
                ({{Math.ceil(biweeklyReports.thisWeekReport.upperBound*100)}}%)
              </span> /
              <span>{{formatCurrency(Math.floor(biweeklyReports.lastWeekReport.average))}}</span>
              <span class="text-small" :class="{'text-danger':biweeklyReports.lastWeekReport.upperBound*100 <=50, 'text-success': biweeklyReports.lastWeekReport.upperBound*100 > 50}">
                ({{Math.ceil(biweeklyReports.lastWeekReport.upperBound*100)}}%)
              </span>
            </p>
            <p class="report__statistics__statistic">
              Vta. Max:
              <span class="text-bold">
                {{biweeklyReports.thisWeekReport.maxSale ? formatCurrency(biweeklyReports.thisWeekReport.maxSale.amount) : formatCurrency(0)}}
              </span>/
              <span>
                {{biweeklyReports.lastWeekReport.maxSale ? formatCurrency(biweeklyReports.lastWeekReport.maxSale.amount) : formatCurrency(0)}}
              </span>
            </p>
            <p class="report__statistics__statistic">
              Vta. Min: <span class="text-bold">{{biweeklyReports.thisWeekReport.minSale ? formatCurrency(biweeklyReports.thisWeekReport.minSale.amount) : formatCurrency(0)}}</span>/
              <span>
                {{biweeklyReports.lastWeekReport.minSale ? formatCurrency(biweeklyReports.lastWeekReport.minSale.amount) : formatCurrency(0)}}
              </span>
            </p>
          </div>
          <div class="report__statistics__section">
            <h3 class="report__statistics__title">Estadisticas Diarias</h3>
            <p class="report__statistics__statistic">
              Promedio:
              <span class="text-bold">{{formatCurrency(biweeklyReports.thisWeekReport.averageDailySale)}}</span> /
              <span>{{formatCurrency(biweeklyReports.lastWeekReport.averageDailySale)}}</span>
            </p>
            <p class="report__statistics__statistic">
              Vta. Max:
              <span class="text-bold">
                {{biweeklyReports.thisWeekReport.maxDailySale ? formatCurrency(biweeklyReports.thisWeekReport.maxDailySale.amount) : formatCurrency(0)}}
              </span>/
              <span>
                {{biweeklyReports.lastWeekReport.maxDailySale ? formatCurrency(biweeklyReports.lastWeekReport.maxDailySale.amount) : formatCurrency(0)}}
              </span>
            </p>
            <p class="report__statistics__statistic">
              Vta. Min:
              <span class="text-bold">
                {{biweeklyReports.thisWeekReport.minDailySale ? formatCurrency(biweeklyReports.thisWeekReport.minDailySale.amount) : formatCurrency(0)}}
              </span>/
              <span>
                {{biweeklyReports.lastWeekReport.minDailySale ? formatCurrency(biweeklyReports.lastWeekReport.minDailySale.amount) : formatCurrency(0)}}
              </span>
            </p>

            <p class="report__statistics__statistic">
              Dias en blanco: <span class="text-bold">{{biweeklyReports.thisWeekReport.dayInWhite}}</span>/
              <span>{{biweeklyReports.lastWeekReport.dayInWhite}}</span>
            </p>
          </div>
        </div>
      </div> -->

    </main>
    <waiting-modal></waiting-modal>
    <process-result></process-result>
    <confirm-new-sale></confirm-new-sale>

    <!-- Modal para confirmar la venta -->
    <div class="modal" :class="{show: modals.newSale.visible}" @click.self="modals.newSale.hiddenModal()">
      <div class="modal__content">
        <div class="modal__close" @click="modals.newSale.hiddenModal()">
          <i class="fas fa-times-circle"></i>
        </div>

        <h2 class="modal__title">
          Nueva Venta
        </h2>
        <p class="modal__info">
          Se va a registra la venta de
          <span class="text-bold">"{{modals.newSale.description}}"</span>
          realizada el
          <span class="text-bold">"{{modals.newSale.date}}"</span>
          por valor de <span class="text-bold">{{modals.newSale.amount}}</span>
        </p>

        <button class="btn btn--success" @click="registerNewSale">Registrar</button>
      </div>
    </div>

    <div class="modal" :class="{show: modals.waiting.visible}">
      <div class="modal__content" style="padding-top: 140px;">
        <div class="loader"></div>
        <p class="modal__info" style="text-align: center;">Procesando Solicitud</p>
      </div>
    </div>

  </div>

  </div>

  <!-- Librería de Chart.ls -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js@2.9.3/dist/Chart.min.js"></script>

  <!-- Librería de MomentJs -->
  <script src="../js/moment.js"></script>

  <!-- Script general con las utilidades basicas -->
  <script src=<?= "../js/app.js?v=" . VERSION ?>></script>

  <!-- Librería personal para reportes de ventas-->
  <script src=<?= "./js/reports.js?v=" . VERSION ?>></script>

  <!-- Script de esta vista -->
  <script src=<?= "./js/sales.js?v=" . VERSION ?>></script>
</body>

</html>