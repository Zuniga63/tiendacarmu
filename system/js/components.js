//---------------------------------------------------------------------------
//  COMPONENTES DEL PANEL DE NAVEGACION
//---------------------------------------------------------------------------
Vue.component('nav-bar', {
  data() {
    return {
      /**
       * La siguiente variables es un valor estatico relacionado los cuatro
       * link principales de la aplicacion, si se agrega o sis se quita uno
       * entonces se debe modificar este valor hasta que se pueda solucionar 
       * la forma de ocultar todos los dropdown al mismo tiempo que se abre uno nuevo.
       */
      mainMenuHeight: 203,//Ojo: Este valor de momento está sujeto al numero de elementos actuales
    }
  },
  computed: {
    ...Vuex.mapState(['actualView', 'rootView', 'links']),
  },
  methods: {
    ...Vuex.mapMutations(['createLinks', 'changeRootView', 'changeActualView']),
    /**
     * Metodo encargado de crear los links y los 
     * dropdown de la aplicación
     */
    createLinks() {
      this.links.push(new Link(1, 'Home', 'home', false, 'fas fa-home'));
      this.links.push(new Link(
        2,
        'Clientes',
        'customers',
        false,
        'fas fa-users',
        true,
        [
          new Link(1, 'Nuevo Cliente', 'newCustomer'),
          new Link(2, 'Créditos y Abonos', 'newOperation'),
          new Link(3, 'Historial de movimientos', 'history'),
          new Link(4, 'Gestionar Cliente', 'customerGestion', true),
          new Link(5, 'Informes', 'report', true),
        ]
      ));
      this.links.push(new Link(
        4,
        'Ventas',
        'sales',
        false,
        'fas fa-cart-plus',
        true,
        [
          new Link(1, 'Categorías', 'categories'),
          new Link(2, 'Registrar Venta', 'newSale'),
          new Link(3, 'Estadisticas', 'stats', true),
          new Link(4, 'Generar factura', 'newBill', true),
        ]
      ));
      this.links.push(new Link(5, 'Mi cuenta', 'myAcount', true, 'fas fa-user'));
    },
    /**
     * Recorre los hijos del elemento y va computando margenes y paddin para obtener el
     * alto en pixeles que el cliente ve en pantalla
     * @param {object} element Elemento del dom al que se va a calcular el alto
     * @returns {number} Height value in px
     */
    elementHeight(element) {
      let height = 0;
      //Obtengo los elementos hijo
      let children = element.children;
      /**
       * Se recorre cada elemento hijo y se van computando los estilos
       * para poder recuperar el alto y los margenes
       */
      for (let index = 0; index < children.length; index++) {
        const child = children[index];

        let style = window.getComputedStyle(child);
        //Obtengo los valores de los margenes
        let margins =
          parseFloat(style["marginTop"]) + parseFloat(style["marginBottom"]);
        //Sumo el alto del elemento y le sumo los margenes
        height += child.offsetHeight + margins;
      }

      //Se aproxima para obtener un entero
      return Math.ceil(height);
    },
    /**
     * Este metodo obtiene como parametro un menu colapsable y lo que hace es cambiar el alto para
     * que se vea u oculte. Cuando se va a mostrar lo que hace es calcular el alto de los elementos
     * hijos
     * @param {*} menu Es el menú html al que se le va a modificar el alto
     */
    showMenu(menu, fatherMenu = undefined, open = true) {
      /**
       * Esta funcionalidad solo se aplica para cuando se 
       * tiene la vista en version movil
       */
      if (document.documentElement.clientWidth < 1000) {
        //Se obtiene el alto del menu que se quiere modificar
        height = this.elementHeight(menu);
        /**
         * Si el menu está visible simplemnete se elimina el atributo
         * style y este por defecto termina con la propiedad height en 0px
         */
        if (menu.classList.contains("show")) {
          /**
           * Si es un dropdown dentro de otro menú deslegable antes de
           * remover el atributo style del menú se modifica el alto del menú padre
           */
          if (fatherMenu) {
            // let fatherHeight = this.elementHeight(fatherMenu) - height;
            // fatherMenu.style.height = `${fatherHeight}px`;
            fatherMenu.style.height = `${this.mainMenuHeight}px`;
            // console.log(fatherMenu);
          }

          menu.classList.remove("show");
          menu.removeAttribute("style");
        } else {
          menu.classList.add("show");

          /**
           * Se modifica el alto del menú padre en el caso de que sea un
           * dropdown dentro de otro panel de navegacion
           */
          if (fatherMenu) {
            // let fatherHeight = height + this.elementHeight(fatherMenu);
            fatherHeight = height + this.mainMenuHeight;
            fatherMenu.style.height = `${fatherHeight}px`;
            // console.log(fatherMenu);
          }

          menu.style.height = `${height}px`;
        }
      }
    },
    closeAllDropdown() {
      const dropdowns = document.querySelectorAll(".main-navbar .dropdown");
      dropdowns.forEach(dropdown => {
        this.dropdownController(dropdown, false);
      });
    },
    /**
     * Se encarga de abrir o cerrar el dropdown en cuestion
     * @param {object} dropdown Elemento del dom correspondiente a un dropdown
     * @param {bool} open Si se desea abrir el menú, por defecto es true
     */
    dropdownController(dropdown, open = true) {
      let mainMenu = document.getElementById("navbar-collapse");
      let dropdownMenu = dropdown.querySelector(".dropdown__nav");
      let dropdownIcon = dropdown.querySelector(".dropdown__icon");

      if (dropdownMenu) {
        if (open && !dropdownMenu.classList.contains("show")) {
          dropdownIcon.classList.add("rotate");
          this.showMenu(dropdownMenu, mainMenu);
        } else if (!open && dropdownMenu.classList.contains("show")) {
          dropdownIcon.classList.remove("rotate");
          this.showMenu(dropdownMenu, mainMenu);
          console.log('cerrando!')
        }
      }
    },
    /**
     * Funcionalidad del boton toggler que hace que el menú 
     * principal se oculte o se muestre
     */
    onTogglerClick() {
      const mainMenu = document.getElementById("navbar-collapse");
      this.showMenu(mainMenu);
    },
    /**
     * Este metodo se ejecuta cuando se da click en un link
     * normal, ya que en este caso la vista y la raiz tienen el mismo nombre.
     * Al ejecutarse se oculta automaticamente el menú
     * @param {string} viewName Nombre de la vista basica
     */
    onRootLinkClick(viewName) {
      this.changeRootView(viewName);
      this.changeActualView(viewName);
      // this.rootView = viewName;
      // this.viewName = viewName;
      this.closeAllDropdown();
      this.onTogglerClick();
    },
    /**
     * Este metodo se encarga de mostrar solo el dropdown que se clico
     * @param {string} viewName Nombre raiz de la vie que se quiere mostrar
     * @param {objet} target Elemento del dom responsable de lanzar el evento
     */
    onDropdownClick(viewName, target) {
      if (this.rootView != viewName) {
        this.closeAllDropdown();
      }
      this.changeRootView(viewName);
      // this.changeActualView(viewName);
      // this.rootView = viewName;
      while (!target.classList.contains('dropdown')) {
        target = target.parentElement;
      }
      let dropdownMenu = target.querySelector(".dropdown__nav");
      if (dropdownMenu.classList.contains('show')) {
        this.dropdownController(target, false);
      } else {
        this.dropdownController(target);
      }
    },//Fin del metodo
    /**
     * Este metodo se encarga de actualizar el rootView y el actual view y de ocultar el panel
     * de navegacion
     * @param {string} viewName Nombre de la vista que se quiere mostrar
     * @param {string} rootViewName Nombre de la raiz
     */
    onDropdownItemClick(viewName, rootViewName) {
      this.changeRootView(rootViewName);
      this.changeActualView(viewName);
      // this.rootView = rootViewName;
      // this.actualView = viewName;
      this.onTogglerClick();
    }
  },
  mounted() {
    this.createLinks();
  },
  template:
  /*html*/`
  <header class="header">
    <nav class="main-navbar" id="mainNavbar">
      <a href="home.php" class="main-navbar__brand">
        <img
          src="./img/logo.png"
          alt="Logo de Carmú"
          class="main-navbar__img"
        />
      </a>

      <button class="main-navbar__toggler" id="navbar-toggler" @click="onTogglerClick">
        <i class="fas fa-bars"></i>
      </button>

      <div class="main-navbar__nav" id="navbar-collapse">
        <ul class="main-navbar__list">
          <li 
            class="main-navbar__item"
            :class="{dropdown: link.isDropdown}"
            v-for="link of links" 
            :key="link.id"
          >
            <a 
              v-if="link.isDropdown"
              href="#" 
              :class="[
                'main-navbar__link', 
                {
                  'main-navbar__link--active': link.viewName === rootView,
                  'main-navbar__link--disabled': link.disabled
                }
              ]"
              @click="onDropdownClick(link.viewName, $event.target)"
              >
              <i :class="['main-navbar__link__prepend', link.prependIcon]"></i>
              <span class="main-navbar__link__body">{{link.name}}</span>
              <i
                v-if="link.isDropdown"
                class="main-navbar__link__append fas fa-chevron-down dropdown__icon"
              ></i>
            </a>
            <a 
              v-else-if="!link.disabled"
              href="#" 
              :class="[
                'main-navbar__link', 
                {
                  'main-navbar__link--active': link.viewName === rootView,
                  'main-navbar__link--disabled': link.disabled
                }
              ]"
              @click="onRootLinkClick(link.viewName)"
              >
              <i :class="['main-navbar__link__prepend', link.prependIcon]"></i>
              <span class="main-navbar__link__body">{{link.name}}</span>
            </a>
            <a 
              v-else
              href="#" 
              :class="[
                'main-navbar__link', 
                {
                  'main-navbar__link--disabled': link.disabled
                }
              ]"
              >
              <i :class="['main-navbar__link__prepend', link.prependIcon]"></i>
              <span class="main-navbar__link__body">{{link.name}}</span>
            </a>
            <nav class="dropdown__nav" v-if="link.isDropdown">
              <ul class="dropdown__list">
                <li class="dropdown__item" v-for="dropdownLink of link.dropdownList">
                  <a
                    v-if="!dropdownLink.disabled"
                    href="#"
                    :class="[
                      'dropdown__link', 
                      {
                        active: actualView === dropdownLink.viewName,
                        'dropdown__link disabled': dropdownLink.disabled
                      }
                    ]"
                    @click="onDropdownItemClick(dropdownLink.viewName, link.viewName)"
                  >
                    {{dropdownLink.name}}
                  </a>
                  <a
                    v-else
                    href="#"
                    :class="[
                      'dropdown__link', 
                      'disabled'
                    ]"
                    disabled
                  >
                    {{dropdownLink.name}}
                  </a>
                </li>
              </ul>
            </nav>
          </li>
        </ul>

        <a href="./logout.php" class="btn btn--red">Cerrar sesión</a>
      </div>
    </nav>
  </header>
`
})

//---------------------------------------------------------------------------
//  COMPONENTES DE LOS MODALES GLOBALES
//---------------------------------------------------------------------------
/**
 * Componente reutilizable para notificarle al usuario
 * que la peticion fue enviada al servidor y se está esperando
 * una respuestas. Requiere que se le pasa la propiedad visible
 */
Vue.component("waiting-modal", {
  computed: {
    ...Vuex.mapState(["waiting", "waitingMessage"]),
  },
  template: /*html*/ `
  <div :class="['modal', {show:waiting}]">
    <div class="modal__content" style="padding-top: 140px;">
      <div class="loader"></div>
        <p class="modal__info" style="text-align: center; padding-top: 1em">{{waitingMessage}}</p>
      </div>
    </div>
  </div>    `,
});

/**
 * Componente reutilizable para notificar al usuario el
 * resultado de la peticion al servidor. Requiere un objeto
 * process-result con los resultados de la peiicion.
 * Este componente emite un evento hidden-modal para que el estado visible
 * pueda ser cambiado desde la raiz
 */
Vue.component("process-result", {
  computed: {
    ...Vuex.mapState(["processResult"]),
  },
  methods: {
    ...Vuex.mapMutations(["hiddenRequest"]),
  },
  template: /*html*/ `
  <div
    class="modal"
    :class="{show: processResult.visible}"
    @click.self="hiddenRequest"
  >
    <div class="modal__content">
      <div class="modal__close" @click="hiddenRequest">
        <i class="fas fa-times-circle"></i>
      </div>

      <div class="modal__icon">
        <img :src="'../icon/'+ (processResult.hasError ? 'error' : 'success') +'.svg'" class="modal__icon__img">
        <p class="modal__icon__caption">{{processResult.message}}</p>
      </div>

    </div>
  </div>
  `,
});

//---------------------------------------------------------------------------
//  COMPONENTES DE LA VISTA DE VENTAS
//---------------------------------------------------------------------------
/**
 * Componente utilizado para poder darle formato de moneda a los
 * input que corresponden a importes
 */
Vue.component("input-money", {
  props: ["value"],
  template: `
  <input
    type="text"
    class="form__input form__input--money form__input--money-big"
    :value="value"
    @focus="$event.target.select()"
    @input="$emit('input', formatCurrencyInput($event.target.value))"
    @blur="$emit('blur')"
    @change="$emit('change')"
    placeholder="$0"
    style="letter-spacing: 5px; margin-bottom: 1em;"
  />`,
  methods: {
    formatCurrencyInput(value) {
      value = this.deleteCurrencyFormater(value);
      value = parseFloat(value);
      if (!isNaN(value)) {
        value = this.formatCurrency(value);
      } else {
        value = "";
      }

      return value;
    },
    deleteCurrencyFormater(text) {
      let value = text.replace("$", "");
      value = value.split(".");
      value = value.join("");

      return value;
    },
    formatCurrency(value) {
      var formatted = new Intl.NumberFormat("es-Co", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
      }).format(value);
      return formatted;
    }, //Fin del metodo,
  },
});

/**
 * Este componente se engarga de confirmar las ventas 
 * y de registrarlas en la base de datos
 */
Vue.component("confirm-new-sale", {
  data() {
    return {
      title: "Registrar Venta",
    };
  },
  computed: {
    ...Vuex.mapState(["confirmSaleModal", "categories"]),
    date() {
      let value = "";
      if (this.confirmSaleModal.formData) {
        value = this.confirmSaleModal.formData.get("date");
        if (value) {
          value = moment(value).format("ll");
        } else {
          value = moment().format("lll");
        }
      }
      return value;
    },
    description() {
      let value = "";
      if (this.confirmSaleModal.formData) {
        value = this.confirmSaleModal.formData.get("description");
      }
      return value;
    },
    category() {
      let value = "";
      if (this.confirmSaleModal.formData) {
        value = this.confirmSaleModal.formData.get("category_id");
        value = parseInt(value);
        value = this.categories.filter((c) => c.id === value);
        value = value[0].name;
      }
      return value;
    },
    amount() {
      let value = "";
      if (this.confirmSaleModal.formData) {
        value = this.confirmSaleModal.formData.get("amount");
        value = parseFloat(value);
        value = formatCurrencyLite(value, 0);
      }
      return value;
    },
  },
  methods: {
    ...Vuex.mapMutations(["hiddenConfirmSaleModal"]),
    ...Vuex.mapActions(["addNewSale"]),
    onClick() {
      this.addNewSale(this.confirmSaleModal.formData);
      this.hiddenConfirmSaleModal();
    },
  },
  template: /*template*/ `
  <div
    class="modal"
    :class="{show: confirmSaleModal.visible}"
    @click.self="hiddenConfirmSaleModal"
  >
    <div class="modal__content">
      <div class="modal__close" @click="hiddenConfirmSaleModal">
        <i class="fas fa-times-circle"></i>
      </div>

      <h2 class="modal__title">{{title}}</h2>
      <p class="modal__info">
        Fecha: 
        <span class="text-bold">"{{date}}"</span> <br>
        Concepto: 
        <span class="text-bold">"{{description}}"</span> <br>
        Categoría: 
        <span class="text-bold">"{{category}}"</span> <br>
        Valor: 
        <span class="text-bold">"{{amount}}"</span> <br>
      </p>

      <button class="btn btn--success" @click="onClick">
        Registrar
      </button>
    </div>
  </div>
  `,
});

/**
 * Este modulo es utilizado para mostrar en pantalla el listado de categorías
 * ordenadas de la que tiene mas ventas a la de menor y que emite un evento con
 * los datos de la categoría que fue seleccionada
 */
Vue.component("category-module", {
  data: function () {
    return {
      categorySelected: undefined,
    };
  },
  methods: {
    onClick(category) {
      this.categorySelected = category.id;
      this.$emit("category-selected", category);
    },
    formatCurrency(value) {
      var formatted = new Intl.NumberFormat("es-Co", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
      }).format(value);
      return formatted;
    }, //Fin formatCurrency
  },
  computed: {
    ...Vuex.mapState(["categories"]),
  },
  /*html*/
  template: `
  <div class="sumary">
    <h3 class="sumary__title">Listado de categorías</h3>
    <div class="sumary__box scroll">
      <div 
        class="category-card" 
        :class="{selected : category.id === categorySelected}" 
        v-for="category in categories" 
        :key="category.id" 
        @click="onClick(category)"
      >
        <header class="category-card__header">
          <h3 class="category-card__name">
            {{category.name}}
          </h3>
          <div class="category-card__details">
            <p class="category-card__info">
              Promedio: <span class="text-bold">{{formatCurrency(category.averageSale)}}</span>
            </p>
            <p class="category-card__info">
              Ventas: <span class="text-bold">{{category.sales.length}}</span>
            </p>
          </div>
        </header>
        <p class="category-card__amount">{{formatCurrency(category.totalAmount)}}</p>
      </div>
    </div>
    <p class="sumary__count">{{categories.length}} categorías</p>
  </div>`,
});

Vue.component("new-category-form", {
  props: ["id"],
  data() {
    return {
      categoryName: new DataInput(),
    };
  },
  computed: {
    ...Vuex.mapState(["categories", "eventHub"]),
    newCategoryNameLength() {
      let length = this.categoryName.value.length;
      let maxChar = 45;
      let diff = maxChar - length;
      return diff;
    },
    disabledSubmit() {
      let result = true;
      if (
        !this.categoryName.hasError &&
        this.categoryName.value.length >= 4 &&
        this.newCategoryNameLength >= 0
      ) {
        result = false;
      }
      return result;
    },
  },
  methods: {
    ...Vuex.mapActions(["addNewCategory"]),
    onSubmit() {
      categoryNameIsOk = this.validateCategoryName();
      if (categoryNameIsOk) {
        const data = new FormData();
        data.append("category_name", this.categoryName.value);
        this.addNewCategory(data);
      }
    },
    validateCategoryName() {
      let name = this.categoryName.value;
      let isOk = false;

      //Se verifica que el nombre no está en blanco
      if (name) {
        //Se verifica que el nombre esté dentro del rango permitido
        if (name.length >= 4 && name.length <= 45) {
          /**
           * Se comprueba que el nombre de la nueva categoría
           * no se encuentre asignado ya.
           */
          let coincidence = this.categories.some(
            (c) => c.name.toUpperCase() === name.toUpperCase()
          );

          /**
           * Se notificca que el nombre es correcto
           */
          if (!coincidence) {
            this.categoryName.isCorrect();
            isOk = true;
          } else {
            this.categoryName.isIncorrect("¡Nombre asignado!");
          }
        } else {
          let message = "";
          if (name.length < 4) {
            message = "¡Nombre de categoría demasiado corto!";
          } else {
            message = "¡Nombre demasiado largo!";
          }
          this.categoryName.isIncorrect(message);
        }
      } else {
        this.categoryName.isIncorrect("¡Este campo es obligatorio!");
      }

      return isOk;
    }, //Fin del metodo
    resetFields() {
      this.categoryName.resetInput();
    },
  },
  mounted() {
    this.eventHub.$on("category-was-created", this.resetFields);
  },
  template: /*html*/ `
  <form class="form form--bg-light" @submit.prevent="onSubmit">
    <h2 class="form__title">Nueva categoría</h2>

    <!-- Campo para agregar el nombre -->
    <div class="form__group">
      <!-- Cuerpo del formulario -->
      <div class="form__group__body">
        <label :for="id + 'CategoryName'" class="form__label">Nombre</label>
        <input 
          type="text" 
          name="category-name" 
          :id="id + 'CategoryName'" 
          :class="['form__input', {error : categoryName.hasError}]" 
          placeholder="Ingresa la nueva categoría" 
          v-model.trim="categoryName.value" 
          @focus="$event.target.select()" 
          @blur="validateCategoryName" 
          @input="validateCategoryName" 
          required
        >
      </div>

      <!-- Seccion para mostrar alertas e informacion adicional -->
      <div class="form__group__footer">
        <span :class="['alert', 'alert--danger', {show: categoryName.hasError}]">
          {{categoryName.message}}
        </span>
        <span class="form__input__length" :class="{'text-danger': newCategoryNameLength < 0}">
          {{newCategoryNameLength}}
        </span>
      </div>

    </div>
    <!-- Fin del campo -->

    
    <input 
      type="submit" 
      value = "Registrar Categoría" 
      :disabled="disabledSubmit" 
      :class="['btn', {'btn--success':!disabledSubmit, 'btn--disabled':disabledSubmit}]"
    >

  </form>
  `,
});

Vue.component("container-header", {
  props: ["title", "subtitle"],
  template: `
  <div class="container__header">
    <h1 class="container__title">{{title}}</h1>
    <p class="container__subtitle">{{subtitle}}</p>
  </div>`,
});

Vue.component("sales-module", {
  props: ["subtitle", "id", "sales"],
  data() {
    return {
      periods: [
        { id: 1, value: "thisWeek", name: "Esta semana" },
        { id: 2, value: "lastWeek", name: "La semana pasada" },
        { id: 5, value: "thisBiweekly", name: "Esta quincena" },
        { id: 6, value: "lastBiweekly", name: "Quincena pasada" },
        { id: 3, value: "thisMonth", name: "Este mes" },
        { id: 4, value: "lastMonth", name: "El mes pasado" },
        { id: 7, value: "thisYear", name: "Este año" },
        { id: 8, value: "lastYear", name: "El año pasado" },
      ],
      period: "thisMonth",
    };
  },
  computed: {
    salesList() {
      let list = [];
      let start, end;
      let dayOfMonth = moment().date();
      switch (this.period) {
        case "thisWeek":
          start = moment().startOf("week");
          end = moment().endOf("week");
          break;
        case "lastWeek":
          start = moment().subtract(7, 'day').startOf('week');
          end = moment(start).endOf('week');
          break;
        case "thisBiweekly":
          if (dayOfMonth > 15) {
            start = moment().startOf('month').add(15, 'days');
            end = moment().endOf("month");
          } else {
            start = moment().startOf("month");
            end = moment(start).add(14, 'days').endOf("day");
          }
          break;
        case "lastBiweekly":
          // let dayOfMonth = moment().date();
          if (dayOfMonth > 15) {
            start = moment().startOf("month");
            end = moment(start).add(14, 'days').endOf("day");
          } else {
            start = moment().subtract(1, 'month').startOf("month").add(15, 'days');
            end = moment(start).endOf("month");
          }
          break;
        case "thisMonth":
          start = moment().startOf("month");
          end = moment().endOf("month");
          break;
        case "lastMonth":
          start = moment().subtract(1, 'month').startOf("month");
          end = moment(start).endOf("month");
          break;
        case "thisYear":
          start = moment().startOf("year");
          end = moment().endOf("year");
          break;
        case "lastYear":
          start = moment().subtract(1, 'year').startOf("year");
          end = moment(start).endOf("year");
          break;
        default:
          start = moment().startOf("year");
          end = moment().endOf("year");
          break;
      } //Fin de swith
      list = this.getSales(start, end);
      return list;
    },
    saleListAmount() {
      let amount = 0;
      this.salesList.forEach((sale) => {
        amount += sale.amount;
      });

      return amount;
    },
    averageSale() {
      let average = 0;
      let sales = this.salesList.length;
      if(sales > 0){
        average = this.saleListAmount / sales;
      }

      return Math.floor(average);
    },
  },
  methods: {
    formatCurrency(value) {
      var formatted = new Intl.NumberFormat("es-Co", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
      }).format(value);
      return formatted;
    }, //Fin del metodo
    getSales(since, until) {
      let list = [];
      for (let index = 0; index < this.sales.length; index++) {
        const sale = this.sales[index];
        if (
          sale.saleDate.isSameOrAfter(since) &&
          sale.saleDate.isSameOrBefore(until)
        ) {
          list.push(sale);
        }
      }
      return list;
    },
  },
  template: /*html*/ `
  <div class="history">
    <div class="history__header">
      <h2 class="history__title">Historial de ventas</h2>
      <p class="history__subtitle">{{subtitle}}</p>
      <select name="" id="" class="form__input" v-model="period">
        <option v-for="item of periods" :key="item.id" :value="item.value">{{item.name}}</option>
      </select>
    </div>
    <div class="history__head">
      <table class="table">
        <thead>
          <tr class="table__row-header">
            <th class="table__header table--25">Fecha</th>
            <th class="table__header table--50">Descripción</th>
            <th class="table__header table--25">Valor</th>
          </tr>
        </thead>
      </table>
    </div>
    <div class="history__body scroll">
      <table class="table">
        <tbody class="table__body">
          <template v-for="sale in salesList">
            <tr class="table__row" :key="sale.id">
              <td class="table__data table--25" data-label="id">{{sale.dateToString}}</td>
              <td class="table__data table--50 table--lef" data-label="description">{{sale.description}}</td>
              <td class="table__data table--25 table--right" data-label="amount">{{formatCurrency(sale.amount)}}</td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <footer class="history__footer">
      <p class="history__info">Total: <span class="text-bold">{{formatCurrency(saleListAmount)}}</span></p>
      <p class="history__info" v-show="averageSale">Prom: <span class="text-bold">{{formatCurrency(averageSale)}}</span></p>
      <p class="history__info">Ventas: <span class="text-bold">{{salesList.length}}</span></p>
    </footer>
  </div>
  `,
});

Vue.component("new-sale-form", {
  props: ["id"],
  data() {
    return {
      saleMoment: "now",
      saleDate: new DataInput(),
      maxDate: moment().format("yyyy-MM-DD"),
      categoryID: new DataInput(),
      description: new DataInput(),
      amount: new DataInput(),
    };
  },
  computed: {
    ...Vuex.mapState(["categories", "eventHub"]),
    newSaleDescriptionLength() {
      let length = this.description.value.length;
      const maxLength = 45;
      let availableLength = maxLength - length;

      return availableLength;
    },
  },
  methods: {
    ...Vuex.mapMutations(["showConfirmSaleModal"]),
    onSubmit() {
      let dateVal = this.validateSaleDate();
      let categoryVal = this.validateSaleCategory();
      let descriptionVal = this.validateSaleDescription();
      let amountVal = this.validateSaleAmount();

      if (dateVal && categoryVal && descriptionVal & amountVal) {
        let amount = parseFloat(this.deleteFormaterOfAmount(this.amount.value));
        const data = new FormData();
        data.append("moment", this.saleMoment);
        data.append("date", this.saleDate.value);
        data.append("category_id", this.categoryID.value);
        data.append("description", this.description.value);
        data.append("amount", amount);
        this.showConfirmSaleModal(data);
      }
    },
    validateSaleDate() {
      let isOk = false;
      let date = this.saleDate;

      if (this.saleMoment === "now") {
        isOk = true;
      } else {
        if (moment(date.value).isValid()) {
          if (date.value <= this.maxDate) {
            date.isCorrect();
            isOk = true;
          } else {
            date.isIncorrect("Selecciona o escribe una fecha valida");
          }
        } else {
          date.isIncorrect("Selecciona una fecha valida");
        }
      }

      return isOk;
    },
    validateSaleCategory() {
      let isOk = false;
      let categoryID = this.categoryID;
      let categoryExist = this.categories.some(
        (c) => c.id === categoryID.value
      );

      if (categoryExist) {
        categoryID.isCorrect();
        isOk = true;
      } else {
        categoryID.isIncorrect("Selecciona una categoría valida");
      }

      return isOk;
    },
    validateSaleDescription() {
      let description = this.description;

      if (description.value) {
        if (description.value.length >= 5) {
          description.isCorrect();
        } else {
          description.isIncorrect("Descripción demasiado corta");
        }
      } else {
        description.isIncorrect("Campo obligatorio");
      }

      return !description.hasError;
    },
    validateSaleAmount() {
      let amount = this.amount;

      //Elimino el formato de moneda y trato de convertir a numero
      let amountValue = parseFloat(this.deleteFormaterOfAmount(amount.value));

      if (!isNaN(amountValue)) {
        if (amountValue > 0) {
          amount.isCorrect();
        } else {
          amount.isIncorrect("Debe ser mayor que cero (0)");
        }
      } else {
        amount.isIncorrect("Ingresa un valor valido");
      }

      return !amount.hasError;
    },
    deleteFormaterOfAmount(text) {
      let value = text.replace("$", "");
      value = value.split(".");
      value = value.join("");

      return value;
    },
    resetFields() {
      this.saleMoment = "now";
      this.saleDate.resetInput();
      this.categoryID.resetInput();
      this.description.resetInput();
      this.amount.resetInput();
    },
  },
  mounted() {
    this.eventHub.$on("sale-was-created", this.resetFields);
  },
  template: /*html*/ `
  <form class="form form--bg-light" @submit.prevent="onSubmit">
    <h2 class="form__title">Registrar Venta</h2>
    <div class="form__group">
      <div class="form__body">
        <label for="newSaleDate" class="form__label">Momento de la venta</label>
        <div class="form__radio-content">
          <!-- Seleccion de este momento -->
          <div>
            <input 
              type="radio" 
              name="newSaleDate" 
              :id="id +'newSaleNow'" 
              class="form__radio" 
              value="now" 
              v-model="saleMoment"
            >
            <label :for="id +'newSaleNow'" class="form__label-inline">Ahora</label>
          </div>

          <!-- Seleccion de otro momento -->
          <div>
            <input 
              type="radio" 
              name="newSaleDate" 
              :id="id + 'newSaleDateOther'" 
              class="form__radio" 
              value="other" 
              v-model="saleMoment"
            >
            <label :for="id + 'newSaleDateOther'" class="form__label-inline">En otra fecha</label>
          </div>
        </div>

        <!-- Seleccion de la fecha -->
        <input 
          type="date" 
          name="saleDate" 
          id="saleDate" 
          placeholder="Selecciona una fecha" 
          :class="['form__input', {error: saleDate.hasError}]" 
          v-if="saleMoment === 'other'" 
          v-model="saleDate.value" 
          :max="maxDate" 
          @blur="validateSaleDate" 
          @change="validateSaleDate"
        >

        <span class="alert alert--danger" :class="{show: saleDate.hasError}">
          {{saleDate.message}}
        </span>
      </div>
    </div>
      <!-- Seleccion de la categoría -->
      <div class="form__group">
        <label :for="id + 'newSaleCategory'" class="form__label">Categoría</label>
        <select 
          name="newSaleCategory" 
          :id="id + 'newSaleCategory'" 
          class="form__input" 
          :class="{error: categoryID.hasError}" 
          v-model="categoryID.value" 
          @blur="validateSaleCategory" 
          @change="validateSaleCategory"
        >
          <option value="" disabled selected>Selecciona una categoría</option>
          <option :value="category.id" v-for="category in categories" :key="category.id">{{category.name}}</option>
        </select>

        <span class="alert alert--danger" :class="{show: categoryID.hasError}">
          {{categoryID.message}}
        </span>
      </div>

      <!-- Ingreso de la descripcion de la venta -->
      <div class="form__group">
        <div class="form__group__body">
          <label :for="id + 'newSaleDescription'" class="form__label form__label--center">Descripción de la venta</label>
          <textarea 
            name="credit_description" 
            :id="id + 'newSaleDescription'" 
            cols="30" 
            rows="3" 
            class="form__input" 
            :class="{error: description.hasError}" 
            placeholder="Escribe los detalles aquí" 
            required 
            v-model.trim="description.value" 
            @focus="$event.target.select()" 
            @change="validateSaleDescription" 
            @blur="validateSaleDescription"
          >
          </textarea>
        </div>

        <div class="form__group__footer">
          <span class="alert alert--danger" :class="{show: description.hasError}" id="newSaleDescriptionAlert">
            {{description.message}}
          </span>
          <span class="form__input__length" id="newSaleDescriptionLength">{{newSaleDescriptionLength}}</span>
        </div>
      </div>

      <!-- Ingreso del inporte de la venta -->
      <div class="form__group">
        <div class="form__group__body">
          <label class="form__label" :for="id + 'creditAmount'">Importe de la venta</label>
          <input-money 
            :id="id + 'creditAmount'" 
            required 
            v-model="amount.value" 
            @blur="validateSaleAmount" 
            @change="validateSaleAmount"
          >
          </input-money>
        </div>
        <div class="form__group__footer">
          <span class="alert alert--danger" :class="{show: amount.hasError}">
            {{amount.message}}
          </span>
        </div>
      </div>

      <input type="submit" value="Registrar Venta" class="btn btn--success">
  </form>
  `,
});

Vue.component("category-view", {
  data() {
    return {
      categorySelected: undefined,
      title: ""
    };
  },
  computed: {
    ...Vuex.mapState(["categories"]),
    sales() {
      let sales = [];
      if (this.categorySelected) {
        sales = this.categorySelected.sales;
      }
      return sales;
    },
    subtitle() {
      let value = "";
      if (this.categorySelected) {
        value = this.categorySelected.name;
      }
      return value;
    },
  },
  methods: {
    onCategorySelected(category) {
      this.categorySelected = category;
    },
  },
  template: /*html*/ `
  <div class="view" id="categories">
    <section class="view__section">
      <div class="container">
        <container-header :title="title" subtitle="Gestion de Categorías"></container-header>
        <new-category-form id="newCategory"></new-category-form>
        <category-module v-on:category-selected="onCategorySelected"></category-module>
      </div>
    </section>

    <aside class="view__sidebar">
      <sales-module :sales="sales" :subtitle="subtitle"></sales-module>
    </aside>
  </div>`,
});

Vue.component("sales-view", {
  props: ['id'],
  data() {
    return {
      title: "Sistema de ventas"
    }
  },
  computed: {
    ...Vuex.mapState(['sales']),
  },
  template: /*html*/`
  <div class="view" :id="id">
    <section class="view__section">
      <div class="container">
        <container-header :title="title" subtitle="Gestion de Ventas"></container-header>
        <new-sale-form id="saleForm"></new-sale-form>
        <sales-module id="salesMovil" class="view-desktop-colapse" :sales="sales"></sales-module>

        <category-module class="view-movil-colapse"></category-module>
      </div>
    </section>

    <aside class="view__sidebar">
      <sales-module id="salesDesktop" :sales="sales"></sales-module>
    </aside>
  </div>`
})