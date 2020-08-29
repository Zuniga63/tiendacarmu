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

            <li class="main-navbar__item">
              <a href="./home.php" class="main-navbar__link">
                <i class="main-navbar__link__prepend icon-home"></i>
                <span class="main-navbar__link__body">Principal</span>
              </a>
            </li>
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
                    <a href="#" :class="['dropdown__link', {'dropdown__link--active' : views.newCategory.visible}]" id="sumaryLink" @click="showView('newCategory')">Categorías <span class="dropdown__link__new">New</span></a>
                  </li>

                  <li class="dropdown__item">
                    <a href="#" :class="['dropdown__link', {'dropdown__link--active' : views.newSale.visible}]" id="sumaryLink" @click="showView('newSale')">Registrar Venta <span class="dropdown__link__new">New</span></a>
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
            <form class="form form--bg-light" @submit.prevent="validateNewSale">
              <h2 class="form__title">Registrar Venta</h2>
              <div class="form__group">

                <div class="form__body">
                  <label for="newSaleDate" class="form__label">Establecer el momento</label>
                  <div class="form__radio-content">
                    <!-- Seleccion de este momento -->
                    <div>
                      <input type="radio" name="newSaleDate" id="newSaleNow" class="form__radio" value="now" v-model="views.newSale.saleMoment">
                      <label for="newSaleNow" class="form__label-inline">Ahora</label>
                    </div>

                    <!-- Seleccion de otro momento -->
                    <div>
                      <input type="radio" name="newSaleDate" id="newSaleDateOther" class="form__radio" value="other" v-model="views.newSale.saleMoment">
                      <label for="newSaleDateOther" class="form__label-inline">Otra Fecha</label>
                    </div>
                  </div>

                  <!-- Seleccion de la fecha -->
                  <input type="date" name="saleDate" id="saleDate" placeholder="Selecciona una fecha" :class="['form__input', {error: views.newSale.saleDate.hasError}]" v-if="views.newSale.saleMoment === 'other'" v-model="views.newSale.saleDate.value" :max="views.newSale.maxDate" @blur="validateSaleDate" @change="validateSaleDate">

                  <span class="alert alert--danger" :class="{show: views.newSale.saleDate.hasError}">
                    {{views.newSale.saleDate.message}}
                  </span>
                </div>

              </div>

              <!-- Seleccion de la categoría -->
              <div class="form__group">
                <label for="newSaleCategory" class="form__label">Categoría</label>
                <select name="newSaleCategory" id="newSaleCategory" class="form__input" :class="{error: views.newSale.categoryID.hasError}" v-model="views.newSale.categoryID.value" @blur="validateSaleCategory" @change="validateSaleCategory">
                  <option value="" disabled selected>Selecciona una categoría</option>
                  <option :value="category.id" v-for="category in categories" :key="category.id">{{category.name}}</option>
                </select>

                <span class="alert alert--danger" :class="{show: views.newSale.categoryID.hasError}">
                  {{views.newSale.categoryID.message}}
                </span>
              </div>

              <!-- Ingreso de la descripcion de la venta -->
              <div class="form__group">
                <div class="form__group__body">
                  <label for="newSaleDescription" class="form__label form__label--center">Descripción de la venta</label>
                  <textarea name="credit_description" id="newSaleDescription" cols="30" rows="3" class="form__input" :class="{error: views.newSale.description.hasError}" placeholder="Escribe los detalles aquí" required v-model.trim="views.newSale.description.value" @focus="$event.target.select()" @change="validateSaleDescription" @blur="validateSaleDescription">
                        </textarea>
                </div>

                <div class="form__group__footer">
                  <span class="alert alert--danger" :class="{show: views.newSale.description.hasError}" id="newSaleDescriptionAlert">
                    {{views.newSale.description.message}}
                  </span>
                  <span class="form__input__length" id="newSaleDescriptionLength">{{newSaleDescriptionLength}}</span>
                </div>
              </div>

              <!-- Ingreso del inporte de la venta -->
              <div class="form__group">
                <div class="form__group__body">
                  <label class="form__label" for="creditAmount">Importe</label>
                  <input-money id="creditAmount" required v-model="views.newSale.amount.value" @blur="validateSaleAmount" @change="validateSaleAmount">
                  </input-money>
                </div>
                <div class="form__group__footer">
                  <span class="alert alert--danger" :class="{show: views.newSale.amount.hasError}">
                    {{views.newSale.amount.message}}
                  </span>
                </div>
              </div>

              <p class="alert alert--big" :class="{show: views.newSale.showAlert, 'alert--danger': !views.newSale.processSuccess, 'alert--success':views.newSale.processSuccess}">
                {{views.newSale.alertMessage}}
              </p>

              <input type="submit" value="Registrar Venta" class="btn btn--success" id="newCreditBtn">
            </form>

            <sales-module :sales="sales" :amount="salesAmount" class="view-desktop-colapse"></sales-module>

            <category-module :categories="categories" class="view-movil-colapse"></category-module>
          </div>
        </section>

        <aside class="view__sidebar">
          <sales-module :sales="sales" :amount="salesAmount"></sales-module>
          <div class="report">
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
          </div>
        </aside>
      </div>

    </main>
    <waiting-modal></waiting-modal>
    <process-result></process-result>

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