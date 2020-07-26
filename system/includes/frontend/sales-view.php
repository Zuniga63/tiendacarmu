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
                    <a href="#" :class="['dropdown__link', {'dropdown__link--active' : views.newCategory.visible}]" id="sumaryLink">Categorías <span class="dropdown__link__new">New</span></a>
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

    <div id="categories" class="container">

      <div class="container__header">
        <h1 class="container__title">{{title}}</h1>
        <p class="container__subtitle">{{subtitle}}</p>
      </div>

      <div class="container__content">
        <!-- Cada item corresponde a un elemento del panel de navegacion -->
        <div class="container__item">
          <form class="form form--bg-light" @submit.prevent="onNewCategorySubmit">
            <h2 class="form__title">Nueva categoría</h2>

            <!-- Campo para agregar el nombre -->
            <div class="form__group">
              <!-- Cuerpo del formulario -->
              <div class="form__group__body">
                <label for="newCategoryName" class="form__label">Nombre</label>
                <input 
                  type="text" 
                  name="category-name" 
                  id="newCategoryName" 
                  :class="['form__input', {error : views.newCategory.categoryNameError}]" placeholder="Ingresa la nueva categoría" v-model="views.newCategory.categoryName" @focus="$event.target.select()" 
                  @blur="validateCategoryName" 
                  required
                >
              </div>

              <!-- Seccion para mostrar alertas e informacion adicional -->
              <div class="form__group__footer">
                <span :class="['alert', 'alert--danger', {show: views.newCategory.categoryNameError}]">
                  {{views.newCategory.errorMessage}}
                </span>
                <span class="form__input__length">
                  {{newCategoryNameLength}}
                </span>
              </div>

            </div>
            <!-- Fin del campo -->

            <p 
              :class="['alert', 'alert--big', {'alert--success' : views.newCategory.response, 'alert--danger' : !views.newCategory.response, show : views.newCategory.responseMessageShow}]"
            >
              {{views.newCategory.responseMessage}}
            </p>
            <input type="submit" v-model="views.newCategory.buttomMessage" :disabled="views.newCategory.requestStart" class="btn btn--success">

          </form>
          <!-- Fin del formulario -->

          <!-- Contenedor con las categorías -->
          <div class="sumary">
            <h3 class="sumary__title">Listado de categorías</h2>
              <div class="sumary__box scroll">

                <div class="category-card" v-for="category in categories" :key="category.id">
                  <header class="category-card__header">
                    <h3 class="category-card__name">
                      {{category.name}}
                    </h3>
                    <p class="category-card__amount">{{formatCurrency(category.totalAmount, 0)}}</p>
                  </header>

                  <div class="category-card__average">{{formatCurrency(category.averageSale, 2)}}</div>
                  <p class="category-card__info">Ventas: {{category.sales.length}}</p>
                </div>

              </div>
              <p class="sumary__count">{{categories.length}} categorías</p>
          </div>
          <!-- Fin de sumary -->
        </div>
        <!-- Fin de neva categoria -->

        <div class="container__item" v-show="views.newSale.visible">
          <form class="form form--bg-light">
            <h2 class="form__title">Registrar Venta</h2>
            <div class="form__group">

              <div class="form__body">
                <label for="newSaleDate" class="form__label">Fecha</label>
                <div class="form__radio-content">
                  <!-- Seleccion de este momento -->
                  <div>
                    <input 
                      type="radio" 
                      name="newSaleDate" 
                      id="newSaleNow" 
                      class="form__radio" 
                      value="now"
                      v-model="views.newSale.saleMoment"
                    >
                    <label for="newSaleNow" class="form__label-inline">Ahora</label>
                  </div>

                  <!-- Seleccion de otro momento -->
                  <div>
                    <input 
                      type="radio" 
                      name="newSaleDate" 
                      id="newSaleDateOther" 
                      class="form__radio"
                      value="other"
                      v-model="views.newSale.saleMoment"
                    >
                    <label for="newSaleDateOther" class="form__label-inline">Otra Fecha</label>
                  </div>
                </div>

                <!-- Seleccion de la fecha -->
                <input 
                  type="date" 
                  name="saleDate" 
                  id="saleDate" 
                  placeholder="Selecciona una fecha" 
                  :class="['form__input', {error: views.newSale.saleDate.hasError}]"
                  v-if="views.newSale.saleMoment === 'other'"
                  v-model="views.newSale.saleDate.value"
                  :max="views.newSale.maxDate"
                  @blur="validateSaleDate"
                >

                <span 
                  class="alert alert--danger"
                  :class="{show: views.newSale.saleDate.hasError}"
                >
                  {{views.newSale.saleDate.message}}
                </span>
              </div>

            </div>

            <!-- Seleccion de la categoría -->
            <div class="form__group">
              <label for="newSaleCategory" class="form__label">Categoría</label>
              <select 
                name="newSaleCategory" 
                id="newSaleCategory" 
                class="form__input"
                :class="{error: views.newSale.categoryID.hasError}"
                v-model="views.newSale.categoryID.value"
                @blur="validateSaleCategory"
                @change="validateSaleCategory"
              >
                <option value="" disabled selected>Selecciona una categoría</option>
                <option :value="category.id" v-for="category in categories" :key="category.id">{{category.name}}</option>
              </select>

              <span 
                class="alert alert--danger"
                :class="{show: views.newSale.categoryID.hasError}"
                >
                  {{views.newSale.categoryID.message}}
              </span>
            </div>

            <!-- Ingreso de la descripcion de la venta -->
            <div class="form__group">
              <div class="form__group__body">
                <label for="newSaleDescription" class="form__label form__label--center">Descripción de la venta</label>
                <textarea 
                  name="credit_description" 
                  id="newSaleDescription" 
                  cols="30" 
                  rows="3" 
                  class="form__input" 
                  :class="{error: views.newSale.description.hasError}" 
                  placeholder="Escribe los detalles aquí" 
                  required
                  v-model.trim="views.newSale.description.value"
                  @blur="validateSaleDescription"
                  @change="validateSaleDescription"
                  >
                </textarea>
              </div>

              <div class="form__group__footer">
                <span 
                  class="alert alert--danger" 
                  :class="{show: views.newSale.description.hasError}"
                  id="newSaleDescriptionAlert">
                  {{views.newSale.description.message}}
                </span>
                <span class="form__input__length" id="newSaleDescriptionLength">{{newSaleDescriptionLength}}</span>
              </div>
            </div>

            <!-- Ingreso del inporte de la venta -->
            <div class="form__group">
              <div class="form__group__body">
                <label class="form__label" for="creditAmount">Importe</label>
                <input-money 
                  id="creditAmount" 
                  required v-model="views.newSale.amount.value"
                  @blur="validateSaleAmount"
                  >
                </input-money>
              </div>
              <div class="form__group__footer">
                <span 
                  class="alert alert--danger" 
                  :class="{show: views.newSale.amount.hasError}"  
                  >
                  {{views.newSale.amount.message}}
                </span>
              </div>
            </div>

            <p 
              class="alert alert--big" 
              :class="{show: views.newSale.showAlert, 'alert--danger': !views.newSale.processSuccess, 'alert--success':views.newSale.processSuccess}"
              >
              {{views.newSale.alertMessage}}
            </p>

            <input type="submit" value="Registrar Venta" class="btn btn--success" id="newCreditBtn" @click="validateNewSale">
          </form>
        </div>
      </div>

      <!-- Modal para confirmar la venta -->
      <div class="modal">
        <div class="modal__content">
          <div class="modal__close">
            <i class="fas fa-times-circle"></i>
          </div>

          <h2 class="modal__title">
            Nueva Venta
          </h2>
          <p class="modal__info">
            Se va a registra la venta de 
            <span class="text-bold">"Un articulo ramdom"</span>
            realizada en la fecha
            <span class="text-bold">"Lunes 14 de junio de 2017"</span> 
            por valor de <span class="text-bold">$230.000</span>
          </p>

          <button class="btn btn--success">Registrar</button>
        </div>
      </div>

    <div class="modal show">
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

  <!-- Librería de Vue.js -->
  <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>

  <!-- Script de esta vista -->
  <script src=<?= "./js/sales.js?v=" . VERSION ?>></script>
</body>

</html>