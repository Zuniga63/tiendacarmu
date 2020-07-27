<!DOCTYPE html>
<html lang="es" class="home-html">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sistema Carmú - Home</title>

  <!-- SE CARGAN LAS FUENTES DE LOS ICONOS -->
  <link rel="stylesheet" href=<?= "../font/style.css?v=" . VERSION ?> />
  <!-- FONT AWESOME -->
  <!-- <script src="https://use.fontawesome.com/7ebcf381fa.js"></script> -->
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.14.0/css/all.css" integrity="sha384-HzLeBuhoNPvSl5KYnjx0BT+WB0QEEqLprO+NBkkk5gbc67FTaL7XIGa2w1L0Xbgc" crossorigin="anonymous">

  <!-- SE CARGAN LOS ESTILOS GENERALES -->
  <link rel="stylesheet" href=<?= "../css/normalize.css?v=" . VERSION ?> />
  <link rel="stylesheet" href=<?= "../css/main.css?v=" . VERSION ?> />
  <style>
    .notification {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 90%;
      padding: 20px;
      background-color: #fff;
      border-radius: 20px;
      max-width: 300px;
      text-align: center;
      font-size: 1.5em;
    }

    @media (min-width: 1000px){
      .notification{
        display: none;
      }
    }
  </style>
</head>

<body>
  <header class="header">
    <nav class="main-navbar" id="mainNavbar">
      <a href="home.php" class="main-navbar__brand">
        <img src="../img/logo.png" alt="Logo de Carmú" class="main-navbar__img">
      </a>

      <button class="main-navbar__toggler" id="navbar-toggler">
        <i class="icon-bars"></i>
      </button>

      <div class="main-navbar__nav" id="navbar-collapse">
        <ul class="main-navbar__list">
          <li class="main-navbar__item">
            <a href="#" class="main-navbar__link main-navbar__link--active">
              <i class="main-navbar__link__prepend icon-home"></i>
              <span class="main-navbar__link__body">Principal</span>
            </a>
          </li>
          <li class="main-navbar__item">
            <a href="customers.php" class="main-navbar__link link__active">
              <i class="main-navbar__link__prepend icon-user"></i>
              <span class="main-navbar__link__body">Clientes</span>
            </a>
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
  <div class="home-body">
    <!-- <h1 class="header__title">Bienvenido <?php echo $_SESSION['first_name'] ?></h1> -->
    <!-- SECCION PARA INGRESAR O MODIFICAR PRODUCTOS -->
    <section class="section">
      <header class="section__header">
        <h2 class="section__title">Formulario de inscripcion de nuevos productos</h2>
      </header>
      <div class="section__body">
        <!-- INICIO DEL FORMULARIO -->
        <form class="form">
          <!-- PRIMER CONTENEDOR CON LOS CAMPOS PARA LOS DATOS GENERALES -->
          <div class="form__container">
            <span class="form__container__name">Informacion general</span>
            <div class="form__container__column">
              <!-- NOMBRE DEL PRODUCTO -->
              <div class="form__group">
                <div class="form__group__body">
                  <label for="itemName" class="form__label">Nombre del producto</label>
                  <input type="text" name="itemName" id="itemName" class="form__input form__input--txt" placeholder="Ingresar nombre">
                </div>
                <div class="form__group__footer">
                  <span class="alert alert--danger" id="itemNameAlert"></span>
                </div>
              </div>
              <!-- PRECIO DE VENTA AL PUBLICO -->
              <div class="form__group">
                <div class="form__group__body">
                  <label for="itemRetailPrice" class="form__label">Precio de venta al publico</label>
                  <input type="text" name="itemRetailPrice" id="itemRetailPrice" class="form__input form__input--money" placeholder="COP $ 0">
                </div>
                <div class="form__group__footer">
                  <span class="alert alert--danger" id="itemRetailPriceAlert">El precio no es valido</span>
                </div>
              </div>
              <!-- UNIDADES EN STOCK -->
              <div class="form__group">
                <div class="form__group__body form__group--oneline">
                  <label for="itemStock" class="form__label p-r-1">Stock</label>
                  <input type="number" name="itemStock" id="itemStock" class="form__input" value="0">
                </div>
              </div>
            </div>

            <!-- SEGUNDA COLUMNA DEL CONTENEDOR -->
            <div class="form__container__column">
              <!-- REFERENCIA DE COMPRA -->
              <div class="form__group">
                <div class="form__group__body">
                  <label for="itemRef" class="form__label">Referencia de compra</label>
                  <input type="text" name="itemRef" id="itemRef" class="form__input form__input--txt" placeholder="Ingresar referencia">
                </div>
                <div class="form__group__footer">
                  <span class="alert alert--warning" id="itemRefAlert">La referencía está repetida</span>
                </div>
              </div>
              <!-- CODIGO DE BARRAS -->
              <div class="form__group">
                <div class="form__group__body">
                  <label for="itemBarcode" class="form__label">Codigo de barras</label>
                  <input type="text" name="itemBarcode" id="itemBarcode" class="form__input" placeholder="Ingresar codigo de barras">
                </div>
                <div class="form__group__footer">
                  <span class="alert alert--danger" id="itemBarcodeAlert">Este codigo ya está en uso</span>
                </div>
              </div>

              <!-- SECCION DE CHECKBOX -->
              <div class="form__group">
                <div class="form__group__body form__group--oneline">
                  <label for="itemGender" class="form__label p-r-1">Genero:</label>
                  <select name="itemGender" id="itemGender" class="form__input">
                    <option value="x" class="form__option">Unisex</option>
                    <option value="f">Femenino</option>
                    <option value="m">Masculino</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="form__container-flex">
              <div class="form__group form__group--oneline-flex">
                <input type="checkbox" name="itemIsNew" id="itemIsNew" class="form__input form__input--check">
                <label for="itemIsNew" class="form__label">NEW</label>
              </div>
              <div class="form__group form__group--oneline-flex">
                <input type="checkbox" name="itemOutstanding" id="itemOutstanding" class="form__input form__input--check">
                <label for="itemOutstanding" class="form__label">Destacado</label>
              </div>
              <div class="form__group form__group--oneline-flex">
                <input type="checkbox" name="itemPublished" id="itemPublished" class="form__input form__input--check">
                <label for="itemPublished" class="form__label">Publicar</label>
              </div>
            </div>
            <!-- DESCRIPCION DEL PRODUCTO -->
            <div class="form__container__row-span">
              <div class="form__group">
                <div class="form__group__body">
                  <label for="itemDescription" class="form__label form__label--center">Descripción</label>
                  <textarea name="itemDescription" id="itemDescription" cols="30" rows="4" class="form__input" placeholder="Ingrese una descripción aquí"></textarea>
                </div>
                <div class="form__group__footer">
                  <span class="alert alert--danger" id="itemDescriptionAlert">Este campo es obligatorio</span>
                  <span class="form__input__length" id="itemDescriptionLength">255</span>
                </div>
              </div>
            </div>
          </div>
          <!-- FIN DEL PRIMER COTENEDOR E INICIO DEL CONTENDOR DE LA IMAGENES -->
          <div class="form__container">
            <span class="form__container__name">Imagenes</span>

            <div class="form__container__row-span">
              <div class="form__group">
                <label for="" class="form__label form__label--center">Imagenes</label>
                <div class="form__gallery">
                  <div class="form__gallery__container" id="itemGalleryContainer">
                    <!-- <figure class="form__gallery__fig">
                    <img src="../img/user-min.png" alt="" class="form__gallery__img">
                  </figure>
                  <figure class="form__gallery__fig">
                    <img src="../img/user-min.png" alt="" class="form__gallery__img">
                  </figure>
                  <figure class="form__gallery__fig">
                    <img src="../img/user-min.png" alt="" class="form__gallery__img">
                  </figure>
                  <figure class="form__gallery__fig">
                    <img src="../img/user-min.png" alt="" class="form__gallery__img">
                  </figure>
                  <figure class="form__gallery__fig">
                    <img src="../img/user-min.png" alt="" class="form__gallery__img">
                  </figure>
                  <figure class="form__gallery__fig">
                    <img src="../img/user-min.png" alt="" class="form__gallery__img">
                  </figure>
                  <figure class="form__gallery__fig">
                    <img src="../img/user-min.png" alt="" class="form__gallery__img">
                  </figure>
                  <figure class="form__gallery__fig">
                    <img src="../img/user-min.png" alt="" class="form__gallery__img">
                  </figure>
                  <figure class="form__gallery__fig">
                    <img src="../img/user-min.png" alt="" class="form__gallery__img">
                  </figure>
                  <figure class="form__gallery__fig">
                    <img src="../img/user-min.png" alt="" class="form__gallery__img">
                  </figure> -->
                  </div>
                  <!-- FIN DEL CONTENEDOR -->
                </div>
                <div class="form__group__footer">
                  <span class="alert alert--warning">No se ha seleccionado ninguna imagen</span>
                  <span class="form__input__length">select: 0</span>
                </div>
              </div>
            </div>
          </div>
          <!-- FIN DEL SEGUNDO CONTENEDOR E INICIO DE LA SELECCION DE CATEGORÍAS Y ETIQUETAS -->
          <div class="form__container">
            <span class="form__container__name">Categorías y Etiquetas</span>

            <div class="form__container__column">
              <div class="form__group">
                <label for="itemCategorySelector" class="form__label form__label--center">Categorías</label>
                <select name="" id="itemCategorySelector" class="form__input">
                  <option value="0">Seleccionar</option>
                </select>
                <div class="form__selected" id="itemCategoryContainer">
                  <!-- <div class="form__selected__item">
                  <div class="form__selected__item__body">
                    <span>Relojería</span>
                  </div>
                </div>
                <div class="form__selected__item">
                  <div class="form__selected__item__body">
                    <span>Analogo</span>
                  </div>
                </div>
                <div class="form__selected__item">
                  <div class="form__selected__item__body">
                    <span>Relojería</span>
                  </div>
                </div>
                <div class="form__selected__item">
                  <div class="form__selected__item__body">
                    <span>Analogo</span>
                  </div>
                </div> -->
                </div>
                <!--Fin del form__selected-->
              </div>
              <!--Fin de form__group-->
            </div>
            <!--Fin de la columna-->

            <div class="form__container__column">
              <div class="form__group">
                <label for="itemLabelSelector" class="form__label form__label--center">Etiquetas</label>
                <select name="" id="itemLabelSelector" class="form__input">
                  <option value="0">Seleccionar</option>
                </select>
                <!--Fin del select-->
                <div class="form__selected" id="itemLabelContainer">
                  <!-- <div class="form__selected__item">
                  <div class="form__selected__item__body">
                    <span>Q&Q</span>
                  </div>
                  <button class="form__selected__item__append" type="button">X</button>
                </div>
                <div class="form__selected__item">
                  <div class="form__selected__item__body">
                    <span>Deportivo</span>
                  </div>
                  <button class="form__selected__item__append" type="button">X</button>
                </div> -->
                </div>
                <!--Fin del form__selected-->
              </div>
              <!--Fin del form__group-->
            </div>
            <!--Fin del form__container__column-->

          </div>
          <!-- FIN DEL ULTIMO CONTENEDOR  -->

        </form>
        <!-- FIN DEL FORMULARIO -->
      </div>
      <div class="section__footer">
        <button class="btn btn--success" type="button" id="btnSendData">Enviar datos</button>
        <button class="btn btn--danger" type="button" id="btnAbort">Descartar</button>
      </div>
    </section>
    <!-- FIN DE LA PRIMERA SECCION -->
    <section class="section">
      <header class="section__header">
        <h2 class="section__title">Articulos del sistema</h2>
        <input type="text" id="seachrBox" class="search-box__temporal" placeholder="Ingresar nombre del producto">
      </header>
      <div class="section__body">
        <div class="items-list" id="itemsContainer">
          <!-- item 1 -->
          <!-- <div class="item-info"> -->
          <!-- <div class="item-info__fig">
            <img src="../img/user-min.png" alt="" class="item-info__img">
          </div>
          <div class="item-info__body">
            <h3 class="item-info__name">Nombre del producto</h3>
            <p class="item-info__label">Stock: <span class="item-info__value">0</span></p>
            <p class="item-info__label">Ref: <span class="item-info__value">VERF-INDIGO BLUE</span></p>
            <p class="item-info__label">Categoría: <span class="item-info__value">Relojería</span></p>
            <p class="item-info__label">Codigo: <span class="item-info__value">454564554554</span></p> -->
          <!-- A CONTINUACION SE ENCUENTRAN LOS CAMPOS MODIFICABLES -->
          <!-- <div class="item-info__inputs">
              <input type="text" name="" id="" class="item-info__price">
              <div class="item-info__checks">
                <label class="item-info__check">
                  <input type="checkbox" name="" id=""> NEW
                </label>
                <label class="item-info__check">
                  <input type="checkbox"> Destacado
                </label>
                <label class="item-info__check">
                  <input type="checkbox"> Publicar
                </label>
              </div>
            </div> -->
          <!-- </div> -->
          <!-- </div> -->


        </div>

      </div>

      <div class="section__footer">
        <button class="btn btn--success" type="button">Modificar</button>
        <button class="btn btn--danger" type="button">Eliminar</button>
      </div>
    </section>
  </div>

  <section class="notification">
    <figure class="notification__fig">
      <img class="notification__img" src="../img/alerta.svg" alt="">
    </figure>
    <p class="notification__info">Esta seccion no está disponible en version movil</p>
  </section>

  <script src=<?= "../js/app.js?v=" . VERSION ?>></script>
  <script src=<?= "../js/objects.js?v=" . VERSION ?>></script>
  <script src=<?= "./js/home_controler.js?v=" . VERSION ?>></script>
</body>

</html>