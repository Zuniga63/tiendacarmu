<?php
require './system/includes/functions.php';
$allItems = get_all_items();
//$fmt = numfmt_create( 'de_DE', NumberFormatter::CURRENCY );
?>


<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Tienda Carmú</title>

  <!-- SE CARGAN LAS FUENTES DE LOS ICONOS -->
  <link rel="stylesheet" href=<?= "./font/style.css?v=".VERSION ?> />
  <!-- El icono del sitio web -->
  <link rel="icon" type="image/icon" href="./img/favicon.ico" />

  <!-- SE CARGAN LOS ESTILOS GENERALES -->
  <link rel="stylesheet" href=<?= "./css/normalize.css?v=".VERSION ?> />
  <link rel="stylesheet" href=<?= "./css/main.css?v=".VERSION ?> />
</head>

<body class="landing">
  <header class="header">
    <!-- Inicio del texto sobre el navbar -->
    <div class="text-header" id="textHeader">
      <div class="slider">
        <div class="slider__items">
          <div class="slider__item">
            <p class="text-header__info text-header__info--red">
              <?= PHRASE_ONE ?>
            </p>
          </div>
          <!--FIN DEL ITEM-->
          <div class="slider__item">
            <p class="text-header__info text-header__info--purple">
            <?= PHRASE_TWO ?>
            </p>
          </div>
          <!--FIN DEL ITEM-->
          <div class="slider__item">
            <p class="text-header__info text-header__info--yellow">
              <?= PHRASE_TREE ?>
            </p>
          </div>
          <!--FIN DEL ITEM-->
        </div>
        <!--fIN DEL CONTENDEOR DEL SLIDER-->
      </div>
      <!--FIN DEL SLIDER-->

      <nav class="main-navbar" id="mainNavbar">
        <a href="#" class="main-navbar__brand">
          <img src="./img/logo.png" alt="Logo de Carmú" class="main-navbar__img" />
        </a>

        <button class="main-navbar__toggler" id="navbar-toggler">
          <i class="icon-bars"></i>
        </button>

        <div class="main-navbar__nav" id="navbar-collapse">
          <ul class="main-navbar__list">
            <li class="main-navbar__item">
              <a href="#" class="main-navbar__link link__active">
                <i class="main-navbar__link__prepend icon-home"></i>
                <span class="main-navbar__link__body">Principal</span>
              </a>
            </li>
            <li class="main-navbar__item">
              <a href="#" class="main-navbar__link">
                <i class="main-navbar__link__prepend icon-buy-bag"></i>
                <span class="main-navbar__link__body">Productos</span>
                <i class="main-navbar__link__append icon-chevron-down"></i>
              </a>
              <!-- <nav class="dropdown__nav">
                  <ul class="dropdown__list">
                    <li class="dropdown__item">
                      <a href="#" class="dropdown__link">Relojería</a>
                    </li>
                    <li class="dropdown__item">
                      <a href="#" class="dropdown__link">Accesorios</a>
                    </li>
                    <li class="dropdown__item">
                      <a href="#" class="dropdown__link">Bolsos</a>
                    </li>
                    <li class="dropdown__item">
                      <a href="#" class="dropdown__link">Ropa</a>
                    </li>
                  </ul>
                </nav> -->
            </li>

            <li class="main-navbar__item">
              <a href="#contactanos" class="main-navbar__link">
                <i class="main-navbar__link__prepend icon-correo"></i>
                <span class="main-navbar__link__body">Contactanos</span>
              </a>
            </li>
          </ul>
        </div>
      </nav>
      <!-- Fin del navbar -->
    </div>
  </header>

  <main style="margin-top: 96px;">
    <div class="banner">
      <div class="banner__container">
        <input type="radio" id="1" name="image-slide" hidden />
        <input type="radio" id="2" name="image-slide" hidden />
        <input type="radio" id="3" name="image-slide" hidden />

        <div class="banner__slide">
          <div class="banner__item">
            <img src="./img/banners/banner_1.jpg" alt="" class="banner__img" />
          </div>
          <div class="banner__item">
            <img src="./img/banners/banner_2.jpg" alt="" class="banner__img" />
          </div>
          <div class="banner__item">
            <img src="./img/banners/banner_3.jpg" alt="" class="banner__img" />
          </div>
        </div>

        <div class="banner__pagination">
          <label for="1" class="banner__pagination__item"></label>
          <label for="2" class="banner__pagination__item"></label>
          <label for="3" class="banner__pagination__item"></label>
        </div>
      </div>
    </div>
    <!--Fin de Bannder-->

    <div class="feature-products">
      <h2 class="feature-products__title">Productos destacados</h2>
      <div class="feature-products__slider">
        <div class="slider" id="featureProductsSlider">
          <div class="slider__items">
            <?php foreach ($allItems as $item) : ?>
              <?php if($item['published'] && count($item['images']) > 0): ?>
                <div class="slider__item">
                  <article class="card">
                    <header class="card__header">
                      <?php if($item['isNew']): ?>
                        <div class="card__sticker card__sticker--left card__sticker--new">
                          New
                        </div>
                      <?php endif ?>

                    <figure class="card__fig">
                      <img src="./<?= $item['images'][0]['src'] ?> " alt="<?= $item['name'] ?>" class="card__img" loading="lazy"/>
                    </figure>

                    <?php if(count($item['images']) > 1): ?>
                      <div class="card__gallery">
                        <?php for($index = 1; $index < count($item['images']); $index++): ?>
                          <figure class="card__gallery__item">
                            <img src="./<?= $item['images'][$index]['src']?>" alt="" class="card__gallery__img" loading="lazy"/>
                          </figure>
                        <?php endfor ?>
                      </div>
                      <div class="card__pill">Imagenes</div>
                    <?php endif ?>
                  </header>
                  <div class="card__body">
                    <div class="container-flex">
                      <p class="card__old-price"></p>
                      <p class="card__free-shipping">Entrega inmediata</p>
                    </div>
                    <div class="container-flex">
                      <p class="card__retail-price">
                        <?php if($item['retailPrice']>0):?>
                          $ <?= number_format($item['retailPrice'], 0, ',', '.'); ?>
                        <?php endif ?>
                      </p>
                      <p class="card__off"> <span></span></p>
                    </div>
                    <p class="card__item-name"><?= $item['name'] ?></p>
                  </div>
                </article>
              </div>
              <?php endif ?>
            <?php endforeach ?>
          </div>
          <div class="slider__btn-prev">
            <i class="icon-chevron-left"></i>
          </div>
          <div class="slider__btn-next">
            <i class="icon-chevron-right"></i>
          </div>
        </div>
      </div>
    </div>

    <footer class="footer" id="contactanos">
      <div class="contact-us">
        <h3 class="contact-us__title">Contactanos</h3>
        <p class="contact-us__txt"><i class="icon-location"></i><span>C.C Ibirico Plaza local 14 - 16</span></p>
        <p class="contact-us__txt"><i class="icon-mobil-phone"></i><span>320-555-5387</span></p>
        <p class="contact-us__txt"><i class="icon-email" style="vertical-align: middle;"></i><span>carmuboutique@gmail.com</span></p>
      </div>

      <div class="social">
        <h3 class="social__header">Redes sociales</h3>
        <a class="social__link" href="https://www.facebook.com/Carm%C3%BA-Boutique-101230488021470">
          <i class="icon-facebook"></i>
          <span class="social__text__body">Facebock</span>
        </a>
        <a class="social__link" href="https://www.instagram.com/carmutienda/">
          <i class="icon-instagram"></i>
          <span class="social__text__body">Instagram</span>
        </a>
        <p class="social__txt"><i class="icon-whatsapp-bold"></i><span>320-555-5387</span></p>
      </div>

      <p class="copy">Tienda Carmú &copy; 2020</p>
    </footer>
  </main>

  <script src=<?= "./js/jquery-3.5.1.min.js?v=".VERSION ?>></script>
  <script src=<?= "./js/app.js?v=".VERSION ?>></script>
  <script src=<?= "./js/landing_page.js?v=".VERSION ?>></script>
</body>

</html>