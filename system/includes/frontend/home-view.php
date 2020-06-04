<!DOCTYPE html>
<html lang="es" class="home-html">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sistema Carmú - Home</title>

  <!-- SE CARGAN LAS FUENTES DE LOS ICONOS -->
  <link rel="stylesheet" href="../font/style.css" />

  <!-- SE CARGAN LOS ESTILOS GENERALES -->
  <link rel="stylesheet" href="../css/normalize.css">
  <link rel="stylesheet" href="../css/main.css">
</head>

<body class="home-body">
  <header class="header">
    <nav class="main-navbar" id="mainNavbar">
      <a href="#" class="main-navbar__brand">
        <img src="../img/logo.png" alt="Logo de Carmú" class="main-navbar__img">
      </a>

      <button class="main-navbar__toggler" id="navbar-toggler">
        <i class="icon-bars"></i>
      </button>

      <div class="main-navbar__nav" id="navbar-collapse">
        <ul class="main-navbar__list">
          <!-- <li class="main-navbar__item">
            <a href="#" class="main-navbar__link link__active">
              <i class="main-navbar__link__prepend icon-home"></i>
              <span class="main-navbar__link__body">Principal</span>
            </a>
          </li> -->
        </ul>

        <a href="./logout.php" class="btn btn--red">Cerrar sesión</a>
      </div>
    </nav>

  </header>

  <!-- <h1 class="header__title">Bienvenido <?php echo $_SESSION['first_name'] ?></h1> -->
  <!-- SECCION PARA INGRESAR O MODIFICAR PRODUCTOS -->
  <section class="section">
    <h2 class="section__header">Formulario de inscripcion de nuevos productos</h2>
    <div class="section__body">
      <!-- INICIO DEL FORMULARIO -->
      <form class="form">
        <!-- PRIMER CONTENEDOR CON LOS CAMPOS PARA LOS DATOS GENERALES -->
        <div class="form__container">
          <span class="form__container__name">Informacion general</span>
          <div class="form__container__column">

            <div class="form__group">
              <div class="form__group__body">
                <label for="itemName" class="form__label">Nombre del producto</label>
                <input type="text" name="itemName" id="itemName" class="form__input form__input--txt">
              </div>
              <div class="form__group__footer">
                <span class="alert alert--danger">El nombre ya está en uso</span>
              </div>
            </div>

            <div class="form__group">
              <div class="form__group__body">
                <label for="itemName" class="form__label">Precio de venta al publico</label>
                <input type="text" name="itemName" id="itemName" class="form__input form__input--money" value="0">
              </div>
              <div class="form__group__footer">
                <span class="alert alert--danger">El precio no es valido</span>
              </div>
            </div>

            <div class="form__group">
              <div class="form__group__body form__group--oneline">
                <label for="itemName" class="form__label p-r-1">Stock</label>
                <input type="number" name="itemName" id="itemName" class="form__input" value="0">
              </div>
            </div>
          </div>

          <div class="form__container__column">

            <div class="form__group">
              <div class="form__group__body">
                <label for="itemName" class="form__label">Referencia de compra</label>
                <input type="text" name="itemName" id="itemName" class="form__input form__input--txt">
              </div>
              <div class="form__group__footer">
                <span class="alert alert--warning">La referencía está repetida</span>
              </div>
            </div>

            <div class="form__group">
              <div class="form__group__body">
                <label for="itemName" class="form__label">Codigo de barras</label>
                <input type="text" name="itemName" id="itemName" class="form__input form__input--money" value="0">
              </div>
              <div class="form__group__footer">
                <span class="alert alert--danger">Este codigo ya está en uso</span>
              </div>
            </div>

            <div class="form__group">
              <div class="form__group__body form__group--oneline">
                <label for="itemName" class="form__label p-r-1">Genero:</label>
                <select name="gender" id="itemGender" class="form__input">
                  <option value="x" class="form__option">Unisex</option>
                  <option value="f">Femenino</option>
                  <option value="m">Masculino</option>
                </select>
              </div>
            </div>
          </div>

          <div class="form__container-flex">
            <div class="form__group form__group--oneline-flex">
              <input type="checkbox" name="" id="" class="form__input form__input--check">
              <label for="" class="form__label">NEW</label>
            </div>
            <div class="form__group form__group--oneline-flex">
              <input type="checkbox" name="" id="" class="form__input form__input--check">
              <label for="" class="form__label">Destacado</label>
            </div>
            <div class="form__group form__group--oneline-flex">
              <input type="checkbox" name="" id="" class="form__input form__input--check">
              <label for="" class="form__label">Publicar</label>
            </div>
          </div>

          <div class="form__container__row-span">
            <div class="form__group">
              <div class="form__group__body">
                <label for="" class="form__label form__label--center">Descripción</label>
                <textarea name="" id="" cols="30" rows="4" class="form__input"></textarea>
              </div>
              <div class="form__group__footer">
                <span class="alert alert--danger">Este campo es obligatorio</span>
                <span class="form__input__length">255</span>
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
                <div class="form__gallery__container">
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
                  </figure>
                  <figure class="form__gallery__fig">
                    <img src="../img/user-min.png" alt="" class="form__gallery__img">
                  </figure>
                </div>
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
              <label for="" class="form__label form__label--center">Categorías</label>
              <select name="" id="" class="form__input">
                <option value="0">Seleccionar</option>
              </select>
              <div class="form__selected">
                <div class="form__selected__item">
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
                </div>
              </div>
            </div>
          </div>

          <div class="form__container__column">
            <div class="form__group">
              <label for="" class="form__label form__label--center">Etiquetas</label>
              <select name="" id="" class="form__input">
                <option value="0">Seleccionar</option>
              </select>
              <div class="form__selected">
                <div class="form__selected__item">
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
                </div>
              </div>
            </div>
          </div>

        </div>
        <!-- FIN DEL ULTIMO CONTENEDOR  -->
        
      </form>
      <!-- FIN DEL FORMULARIO -->
    </div>
    <div class="section__footer">
      <button class="btn btn--success" type="button">Enviar datos</button>
      <button class="btn btn--danger" type="button">Descartar</button>
    </div>
  </section>
  <!-- FIN DE LA PRIMERA SECCION -->
  <section class="section">
    <h2 class="section__header">Articulos del sistema</h2>
    <div class="section__body">
      <input type="text" id="" class="search-box" placeholder="Ingresar nombre del producto">
      <div class="items-list">
        <!-- item 1 -->
        <div class="item-info">
          <div class="item-info__fig">
            <img src="../img/user-min.png" alt="" class="item-info__img">
          </div>
          <div class="item-info__body">
            <h3 class="item-info__name">Nombre del producto</h3>
            <p class="item-info__label">Stock: <span class="item-info__value">0</span></p>
            <p class="item-info__label">Ref: <span class="item-info__value">VERF-INDIGO BLUE</span></p>
            <p class="item-info__label">Categoría: <span class="item-info__value">Relojería</span></p>
            <p class="item-info__label">Codigo: <span class="item-info__value">454564554554</span></p>
            <!-- A CONTINUACION SE ENCUENTRAN LOS CAMPOS MODIFICABLES -->
            <div class="item-info__inputs">
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
            </div>
          </div>
        </div>
        <!-- item 2 -->
        <div class="item-info">
          <div class="item-info__fig">
            <img src="../img/user-min.png" alt="" class="item-info__img">
          </div>
          <div class="item-info__body">
            <h3 class="item-info__name">Nombre del producto</h3>
            <p class="item-info__label">Stock: <span class="item-info__value">0</span></p>
            <p class="item-info__label">Ref: <span class="item-info__value">VERF-INDIGO BLUE</span></p>
            <p class="item-info__label">Categoría: <span class="item-info__value">Relojería</span></p>
            <p class="item-info__label">Codigo: <span class="item-info__value">454564554554</span></p>
            <!-- A CONTINUACION SE ENCUENTRAN LOS CAMPOS MODIFICABLES -->
            <div class="item-info__inputs">
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
            </div>
          </div>
        </div>
        <!-- item 3 -->
        <div class="item-info">
          <div class="item-info__fig">
            <img src="../img/user-min.png" alt="" class="item-info__img">
          </div>
          <div class="item-info__body">
            <h3 class="item-info__name">Nombre del producto</h3>
            <p class="item-info__label">Stock: <span class="item-info__value">0</span></p>
            <p class="item-info__label">Ref: <span class="item-info__value">VERF-INDIGO BLUE</span></p>
            <p class="item-info__label">Categoría: <span class="item-info__value">Relojería</span></p>
            <p class="item-info__label">Codigo: <span class="item-info__value">454564554554</span></p>
            <!-- A CONTINUACION SE ENCUENTRAN LOS CAMPOS MODIFICABLES -->
            <div class="item-info__inputs">
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
            </div>
          </div>
        </div>
        <!-- item 4 -->
        <div class="item-info">
          <div class="item-info__fig">
            <img src="../img/user-min.png" alt="" class="item-info__img">
          </div>
          <div class="item-info__body">
            <h3 class="item-info__name">Nombre del producto</h3>
            <p class="item-info__label">Stock: <span class="item-info__value">0</span></p>
            <p class="item-info__label">Ref: <span class="item-info__value">VERF-INDIGO BLUE</span></p>
            <p class="item-info__label">Categoría: <span class="item-info__value">Relojería</span></p>
            <p class="item-info__label">Codigo: <span class="item-info__value">454564554554</span></p>
            <!-- A CONTINUACION SE ENCUENTRAN LOS CAMPOS MODIFICABLES -->
            <div class="item-info__inputs">
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
            </div>
          </div>
        </div>
        <!-- item 5 -->
        <div class="item-info">
          <div class="item-info__fig">
            <img src="../img/user-min.png" alt="" class="item-info__img">
          </div>
          <div class="item-info__body">
            <h3 class="item-info__name">Nombre del producto</h3>
            <p class="item-info__label">Stock: <span class="item-info__value">0</span></p>
            <p class="item-info__label">Ref: <span class="item-info__value">VERF-INDIGO BLUE</span></p>
            <p class="item-info__label">Categoría: <span class="item-info__value">Relojería</span></p>
            <p class="item-info__label">Codigo: <span class="item-info__value">454564554554</span></p>
            <!-- A CONTINUACION SE ENCUENTRAN LOS CAMPOS MODIFICABLES -->
            <div class="item-info__inputs">
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
            </div>
          </div>
        </div>
        <!-- item 6 -->
        <div class="item-info">
          <div class="item-info__fig">
            <img src="../img/user-min.png" alt="" class="item-info__img">
          </div>
          <div class="item-info__body">
            <h3 class="item-info__name">Nombre del producto</h3>
            <p class="item-info__label">Stock: <span class="item-info__value">0</span></p>
            <p class="item-info__label">Ref: <span class="item-info__value">VERF-INDIGO BLUE</span></p>
            <p class="item-info__label">Categoría: <span class="item-info__value">Relojería</span></p>
            <p class="item-info__label">Codigo: <span class="item-info__value">454564554554</span></p>
            <!-- A CONTINUACION SE ENCUENTRAN LOS CAMPOS MODIFICABLES -->
            <div class="item-info__inputs">
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
            </div>
          </div>
        </div>
        <!-- item 1 -->
        <div class="item-info">
          <div class="item-info__fig">
            <img src="../img/user-min.png" alt="" class="item-info__img">
          </div>
          <div class="item-info__body">
            <h3 class="item-info__name">Nombre del producto</h3>
            <p class="item-info__label">Stock: <span class="item-info__value">0</span></p>
            <p class="item-info__label">Ref: <span class="item-info__value">VERF-INDIGO BLUE</span></p>
            <p class="item-info__label">Categoría: <span class="item-info__value">Relojería</span></p>
            <p class="item-info__label">Codigo: <span class="item-info__value">454564554554</span></p>
            <!-- A CONTINUACION SE ENCUENTRAN LOS CAMPOS MODIFICABLES -->
            <div class="item-info__inputs">
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
            </div>
          </div>
        </div>
        <!-- item 2 -->
        <div class="item-info">
          <div class="item-info__fig">
            <img src="../img/user-min.png" alt="" class="item-info__img">
          </div>
          <div class="item-info__body">
            <h3 class="item-info__name">Nombre del producto</h3>
            <p class="item-info__label">Stock: <span class="item-info__value">0</span></p>
            <p class="item-info__label">Ref: <span class="item-info__value">VERF-INDIGO BLUE</span></p>
            <p class="item-info__label">Categoría: <span class="item-info__value">Relojería</span></p>
            <p class="item-info__label">Codigo: <span class="item-info__value">454564554554</span></p>
            <!-- A CONTINUACION SE ENCUENTRAN LOS CAMPOS MODIFICABLES -->
            <div class="item-info__inputs">
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
            </div>
          </div>
        </div>
        <!-- item 3 -->
        <div class="item-info">
          <div class="item-info__fig">
            <img src="../img/user-min.png" alt="" class="item-info__img">
          </div>
          <div class="item-info__body">
            <h3 class="item-info__name">Nombre del producto</h3>
            <p class="item-info__label">Stock: <span class="item-info__value">0</span></p>
            <p class="item-info__label">Ref: <span class="item-info__value">VERF-INDIGO BLUE</span></p>
            <p class="item-info__label">Categoría: <span class="item-info__value">Relojería</span></p>
            <p class="item-info__label">Codigo: <span class="item-info__value">454564554554</span></p>
            <!-- A CONTINUACION SE ENCUENTRAN LOS CAMPOS MODIFICABLES -->
            <div class="item-info__inputs">
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
            </div>
          </div>
        </div>
        <!-- item 4 -->
        <div class="item-info">
          <div class="item-info__fig">
            <img src="../img/user-min.png" alt="" class="item-info__img">
          </div>
          <div class="item-info__body">
            <h3 class="item-info__name">Nombre del producto</h3>
            <p class="item-info__label">Stock: <span class="item-info__value">0</span></p>
            <p class="item-info__label">Ref: <span class="item-info__value">VERF-INDIGO BLUE</span></p>
            <p class="item-info__label">Categoría: <span class="item-info__value">Relojería</span></p>
            <p class="item-info__label">Codigo: <span class="item-info__value">454564554554</span></p>
            <!-- A CONTINUACION SE ENCUENTRAN LOS CAMPOS MODIFICABLES -->
            <div class="item-info__inputs">
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
            </div>
          </div>
        </div>
        <!-- item 5 -->
        <div class="item-info">
          <div class="item-info__fig">
            <img src="../img/user-min.png" alt="" class="item-info__img">
          </div>
          <div class="item-info__body">
            <h3 class="item-info__name">Nombre del producto</h3>
            <p class="item-info__label">Stock: <span class="item-info__value">0</span></p>
            <p class="item-info__label">Ref: <span class="item-info__value">VERF-INDIGO BLUE</span></p>
            <p class="item-info__label">Categoría: <span class="item-info__value">Relojería</span></p>
            <p class="item-info__label">Codigo: <span class="item-info__value">454564554554</span></p>
            <!-- A CONTINUACION SE ENCUENTRAN LOS CAMPOS MODIFICABLES -->
            <div class="item-info__inputs">
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
            </div>
          </div>
        </div>
        <!-- item 6 -->
        <div class="item-info">
          <div class="item-info__fig">
            <img src="../img/user-min.png" alt="" class="item-info__img">
          </div>
          <div class="item-info__body">
            <h3 class="item-info__name">Nombre del producto</h3>
            <p class="item-info__label">Stock: <span class="item-info__value">0</span></p>
            <p class="item-info__label">Ref: <span class="item-info__value">VERF-INDIGO BLUE</span></p>
            <p class="item-info__label">Categoría: <span class="item-info__value">Relojería</span></p>
            <p class="item-info__label">Codigo: <span class="item-info__value">454564554554</span></p>
            <!-- A CONTINUACION SE ENCUENTRAN LOS CAMPOS MODIFICABLES -->
            <div class="item-info__inputs">
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
            </div>
          </div>
        </div>
      </div>

    </div>

    <div class="section__footer">
      <button class="btn btn--success" type="button">Modificar</button>
      <button class="btn btn--danger" type="button">Eliminar</button>
    </div>
  </section>

  <script src="../js/app.js"></script>
</body>

</html>