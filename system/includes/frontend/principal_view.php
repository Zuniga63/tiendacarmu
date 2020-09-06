<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Panel de control</title>
  <!-- SE CARGAN LOS ESTILOS GENERALES -->
  <link rel="stylesheet" href=<?= "./css/normalize.css?v=" . VERSION ?> />
  <link rel="stylesheet" href=<?= "./css/main.css?v=" . VERSION ?> />
</head>

<body>
  <div class="preloader show" id="preload">
    <div class="loader"></div>
  </div>
  <div id="app">
    <nav-bar></nav-bar>
    
    <category-view id="categoryView" v-show="actualView === 'categories'"></category-view>
    <sales-view id="salesView" v-show="actualView === 'newSale'"></sales-view>

    <waiting-modal></waiting-modal>
    <process-result></process-result>
    <confirm-new-sale></confirm-new-sale>
  </div>
  <!-- FONT AWESOME -->
  <!-- <script src="https://use.fontawesome.com/7ebcf381fa.js"></script> -->
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.14.0/css/all.css" integrity="sha384-HzLeBuhoNPvSl5KYnjx0BT+WB0QEEqLprO+NBkkk5gbc67FTaL7XIGa2w1L0Xbgc" crossorigin="anonymous">

  <!-- Librería de Vue.js -->
  <script src="./js/library/vue.js"></script>
  <!-- Librería de Vuex -->
  <script src="./js/library/vuex.js"></script>
  <!-- Librería de Chart.js -->
  <script src="./js/library/Chart.min.js"></script>
  <!-- Librería de moment.js -->
  <script src="./js/library/moment-with-locales.js"></script>
  <!-- se carga el escrip personalizado -->
  <script src=<?= "./js/utilities.js?v=" . VERSION ?>></script>
  <script src=<?= "./js/components.js?v=" . VERSION ?>></script>
  <script src=<?= "./js/app.js?v=" . VERSION ?>></script>
</body>

</html>