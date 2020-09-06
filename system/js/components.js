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

//---------------------------------------------------------------------------
//  COMPONENTES DE LA VISTA DE CLIENTES
//---------------------------------------------------------------------------

Vue.component("customer-list", {
  props: ["id", "customerSelected"],
  data() {
    return {
      listName: "active",
    };
  },
  computed: {
    ...Vuex.mapState(["customers"]),
    ...Vuex.mapGetters([
      "inactiveCustomerList",
      "activeCustomerList",
      "archivedCustomerList",
    ]),
    customerList() {
      let list = [];
      switch (this.listName) {
        case "active":
          list = this.activeCustomerList;
          break;
        case "inactive":
          list = this.inactiveCustomerList;
          break;
        case "archived":
          list = this.archivedCustomerList;
          break;
      }

      return list;
    },
    customerListBalance() {
      let amount = 0;
      this.customerList.forEach((c) => {
        amount += c.balance;
      });

      return amount;
    },
  },
  methods: {
    ...Vuex.mapActions(["archiveUnarchiveCustomer", "deleteCustomer"]),
    formatCurrency: formatCurrencyLite,
    onArchivedUnarchiveCustomer(customer) {
      let formData = new FormData();
      formData.append("customer_id", customer.id);
      formData.append("archive", !customer.archived);
      this.archiveUnarchiveCustomer(formData);
    },
    onDeleteCustomer(customer) {
      let message1 = `Se va a eliminar al cliente: ${customer.fullName}`;
      let message2 = "Está seguro que desea eliminar al cliente";
      if (confirm(message1)) {
        if (confirm(message2)) {
          let formData = new FormData();
          formData.append("customer_id", customer.id);
          this.deleteCustomer(formData);
        }
      }
    },
  },
  /*html*/
  template: `
  <div class="m-b-1">
    <div class="form__group-flex m-b-1">
      <div class="form__radio-group">
        <input
          type="radio"
          value="active"
          v-bind:id="id+'Active'"
          v-model="listName"
          class="form__radio"
        />
        <label v-bind:for="id+'Active'" class="form__radio">Clientes Act</label>
      </div>

      <div class="form__radio-group">
        <input
          type="radio"
          value="inactive"
          v-bind:id="id +'Inactive'"
          v-model="listName"
          class="form__radio"
        />
        <label v-bind:for="id +'Inactive'" class="form__radio">Clientes Inact</label>
      </div>

      <div class="form__radio-group">
        <input
          type="radio"
          value="archived"
          v-bind:id="id +'Archived'"
          v-model="listName"
          class="form__radio"
        />
        <label v-bind:for="id +'Archived'" class="form__radio">Clientes Arch</label>
      </div>
    </div>

    <div class="history__header">
      <h2 class="history__title">Listado de clientes</h2>
    </div>
    <div class="history__head">
      <table class="table">
        <thead>
          <tr class="table__row-header">
            <th class="table__header table--40">Nombres y Apellidos</th>
            <th class="table__header table--20">Telefono</th>
            <th class="table__header table--20">Saldo</th>
            <th class="table__header table--20">Acción</th>
          </tr>
        </thead>
      </table>
    </div>
    <div class="history__body scroll">
      <table class="table">
        <tbody class="table__body">
          <template v-for="customer in customerList">
            <tr class="table__row" :class = "{selected: customerSelected && customerSelected.id === customer.id}">
              <td class="table__data table--40">{{customer.fullName}}</td>
              <td class="table__data table--20">{{customer.phone}}</td>
              <td class="table__data table--20 text-right">{{formatCurrency(customer.balance,0)}}</td>
              <td class="table__data table--20 text-center" @click.stop="">
                <div class="table__data--actions">
                  <a class="table__data--actions__link" @click="$emit('customer-selected', customer)" title="Editar"><i class="fas fa-user-edit text-success"></i></a>
                  <a class="table__data--actions__link" @click="onArchivedUnarchiveCustomer(customer)">
                    <i 
                      class="fas fa-archive text-secundary"
                      :class="{'fa-folder': !customer.archived, 'fa-folder-open':customer.archived}" 
                      :title="customer.archived ? 'Desarchivar' : 'Archivar'"></i>
                  </a>
                  <a 
                    class="table__data--actions__link" 
                    v-if="customer.balance <= 0"
                    @click="onDeleteCustomer(customer)">
                    <i class="fas fa-trash-alt text-danger" title="Eliminar"></i>
                  </a>
                </div>
              </td>
            </tr>
          </template v-for="customer">
        </tbody>
      </table>
    </div>
    <div class="history__footer">
      <p class="history__info">Total Clientes: <span class="text-bold">{{customerList.length}}</span></p>
      <p class="history__info">Importe: <span class="text-bold">{{formatCurrency(customerListBalance)}}</span></p>
    </div>
  </div>
  `,
});

/**
 * Componente no reutilizable de momento con la vista
 * para agregar nuevos clientes o actualizar los datos
 */
Vue.component("customer-register", {
  props: ["id"],
  data: function () {
    return {
      customerSelected: undefined,
      updatingCustomer: false,
      typeList: "active",
      //los campos para el formulario
      firstName: new DataInput(),
      lastName: new DataInput(),
      nit: new DataInput(),
      phone: new DataInput(),
      email: new DataInput(),
    };
  },
  computed: {
    ...Vuex.mapState(["customers", "eventHub"]),
    inactiveCustomers() {
      const result = this.customers.filter((c) => c.inactive && !c.archived);
      return result;
    },
    activeCustomers() {
      const result = this.customers.filter((c) => !c.inactive && !c.archived);
      return result;
    },
    archivedCustomers() {
      const result = this.customers.filter((c) => c.archived);
      return result;
    },
    selectedList() {
      let result = [];
      switch (this.typeList) {
        case "active":
          {
            result = this.activeCustomers;
          }
          break;
        case "inactive":
          {
            result = this.inactiveCustomers;
          }
          break;
        case "archived":
          {
            this.archivedCustomers;
          }
          break;
        default: {
          result = this.activeCustomers;
        }
      }
      return result;
    },
  },
  methods: {
    ...Vuex.mapActions(["updateCustomer", "newCustomer"]),
    validateFirstName() {
      let firstName = this.firstName;
      if (firstName.value && typeof firstName.value === "string") {
        firstName.isCorrect();
        return true;
      } else {
        firstName.isIncorrect("Este campo es obligatorio");
      }

      return false;
    },
    validateNit() {
      let nit = this.nit;
      if (nit.value && typeof nit.value === "string") {
        let isAssigned = false;
        if (this.updatingCustomer) {
          isAssigned = this.customers.some(
            (c) => c.nit === nit.value && c.id !== this.customerSelected.id
          );
        } else {
          isAssigned = this.customers.some((c) => c.nit === nit.value);
        }

        if (isAssigned) {
          nit.isIncorrect("Esta identificación ya fue asignada");
          return false;
        } else {
          nit.isCorrect();
        }
      } else {
        nit.isCorrect();
      }

      return true;
    },
    validatePhone() {
      let phone = this.phone;
      if (phone.value && typeof phone.value === "string") {
        let isAssigned = false;
        if (this.updatingCustomer) {
          isAssigned = this.customers.some(
            (c) => c.phone === phone.value && c.id !== this.customerSelected.id
          );
        } else {
          isAssigned = this.customers.some((c) => c.phone === phone.value);
        }

        if (isAssigned) {
          phone.isIncorrect("Este número ya fue asignado");
          return false;
        } else {
          phone.isCorrect();
        }
      } else {
        phone.isCorrect();
      }

      return true;
    },
    validateEmail() {
      let email = this.email;
      if (email.value && typeof email.value === "string") {
        console.log(email.value);
        if (
          /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<ul>()[\]\.,;:\s@\"]{2,})$/i.test(
            email.value
          )
        ) {
          let isAssigned = false;

          if (this.updatingCustomer) {
            isAssigned = this.customers.some(
              (c) =>
                c.email === email.value && c.id !== this.customerSelected.id
            );
          } else {
            isAssigned = this.customers.some((c) => c.email === email.value);
          }

          if (isAssigned) {
            email.isIncorrect("Esta dirección de correo ya fue asignada");
            return false;
          } else {
            email.isCorrect();
          }
        } else {
          email.isIncorrect("Ingresa una dirección de correo valida");
          return false;
        }
      } else {
        email.isCorrect();
      }

      return true;
    },
    onSubmit() {
      let firstNameVal = this.validateFirstName();
      let nitVal = this.validateNit();
      let phoneVal = this.validatePhone();
      let emailVal = this.validateEmail();

      if (firstNameVal && nitVal && phoneVal && emailVal) {
        const body = new FormData();
        body.append("first_name", this.firstName.value);
        body.append("last_name", this.lastName.value);
        body.append("nit", this.nit.value);
        body.append("phone", this.phone.value);
        body.append("email", this.email.value);
        // this.waiting = true;
        if (this.updatingCustomer) {
          body.append("customer_id", this.customerSelected.id);
          this.updateCustomer(body);
        } else {
          this.newCustomer(body);
        }
      } //Fin de if
    }, //Fin del metodo
    /**
     * Este metodo carga al modulo los datos delcliente
     * @param {Customer} customer Instancia de customer
     */
    loadCustomer(customer) {
      this.customerSelected = customer;
      this.updatingCustomer = true;
      this.resetForm();
      this.firstName.value = customer.firstName;
      this.lastName.value = customer.lastName;
      this.nit.value = customer.nit;
      this.phone.value = customer.phone;
      this.email.value = customer.email;
    },
    discardUpdate() {
      this.customerSelected = undefined;
      this.updatingCustomer = false;
      this.resetForm();
    },
    resetForm() {
      this.firstName.resetInput();
      this.lastName.resetInput();
      this.nit.resetInput();
      this.phone.resetInput();
      this.email.resetInput();
    },
  }, //Fin de methods
  mounted() {
    this.eventHub.$on("customer-was-updated", this.discardUpdate);
    this.eventHub.$on("customer-was-created", this.discardUpdate);
    this.eventHub.$on("customer-was-deleted", this.discardUpdate);
  },
  template: /*html*/ `
  <div class="view" :id="id">
    <section class="view__section">
      <div class="container">
        <div class="container__header" :class="{'container__header--success': !updatingCustomer, 'container__header--primary': updatingCustomer}">
          <h1 class="container__title">Sistema de Clientes</h1>
          <p class="container__subtitle">
            {{updatingCustomer ? 'Actualización de Datos' : 'Nuevo Cliente'}}
          </p>
        </div>
        <!-- FORMULARIO DE REGISTRO O ACTUALIZACIÓN -->
        <form 
          :class="['form', {'form--bg-light': !updatingCustomer, 'form--bg-primary': updatingCustomer}]" 
          :id="id+'Form'"
          @submit.prevent="onSubmit"
        >
          <h2 class="form__title">{{updatingCustomer ? 'Actualización' : 'Nuevo Cliente'}}</h2>
          <!-- Campo para el nombre -->
          <label v-bind:for="id + 'Name'" class="form__label">Nombres</label>
          <input
            type="text"
            name="firts_name"
            v-bind:id="id + 'Name'"
            v-model.trim="firstName.value"
            @focus="$event.target.select()"
            @blur="validateFirstName"
            class="form__input"
            placeholder="Ingresa el nombre aquí"
          />
          <p class="alert alert--danger" :class="{show: firstName.hasError}">{{firstName.message}}</p>

          <!-- Campo para el apellido -->
          <label v-bind:for="id + 'LastName'" class="form__label"
            >Apellidos</label
          >
          <input
            type="text"
            name="last_name"
            v-bind:id="id + 'LastName'"
            v-model.trim="lastName.value"
            @focus="$event.target.select()"
            class="form__input"
            placeholder="Ingresa el apellido aquí"
          />

          <!-- Campo para la identificacion -->
          <label v-bind:for="id + 'Nit'" class="form__label">Nit o C.C</label>
          <input
            type="text"
            name="nit"
            v-bind:id="id + 'Nit'"
            v-model.trim="nit.value"
            @focus="$event.target.select()"
            @blur="validateNit"
            class="form__input"
            placeholder="Ingresa el Nit o CC"
          />
          <p class="alert alert--danger" :class="{show: nit.hasError}">{{nit.message}}</p>

          <!-- Campo para el numero de telefono -->
          <label v-bind:for="id + 'Phone'" class="form__label">Telefono</label>
          <input
            type="text"
            name="regCustomerName"
            v-bind:id="id + 'Phone'"
            v-model.trim="phone.value"
            @focus="$event.target.select()"
            @blur="validatePhone"
            class="form__input"
            placeholder="Escribe el numero aquí"
          />
          <p class="alert alert--danger" :class="{show:phone.hasError}">{{phone.message}}</p>

          <!-- Campo para el correo elecctronico -->
          <label v-bind:for="id + 'Email'" class="form__label">Correo</label>
          <input
            type="email"
            name="regCustomerEmail"
            v-bind:id="id + 'Email'"
            v-model.trim="email.value"
            @focus="$event.target.select()"
            @blur="validateEmail"
            class="form__input"
            placeholder="Escribe el correo aquí"
          />
          <p class="alert alert--danger" :class="{show: email.hasError}">{{email.message}}</p>

          <!-- Botones del formulario: Para crear nuevo cliente -->
          <input
            v-if="!updatingCustomer"
            type="submit"
            value="Registrar Cliente"
            class="btn btn--success"
          />
          <!-- Botones del formulario: Para actualizar los datos -->
          <div class="form__actions-double" v-if="updatingCustomer">
            <input
              type="submit"
              value="Actualizar"
              class="btn btn--primary"
            />
            <input type="button" value="Descartar" class="btn btn--danger" @click="discardUpdate"/>
          </div>
        </form>

        <!-- Tarjetas de los clientes -->
        <div class="card-container  view-desktop-colapse">
          <h2 class="card-container__title">Listado de Clientes</h2>
          <div class="card-container__options">
            <div class="form__group-flex">
              <div class="form__radio-group">
                <input
                  type="radio"
                  value="active"
                  v-bind:id="id+'Active'"
                  v-model="typeList"
                  class="form__radio"
                />
                <label v-bind:for="id+'Active'" class="form__radio">Act</label>
              </div>

              <div class="form__radio-group">
                <input
                  type="radio"
                  value="inactive"
                  v-bind:id="id +'Inactive'"
                  v-model="typeList"
                  class="form__radio"
                />
                <label v-bind:for="id +'Inactive'" class="form__radio">Inact</label>
              </div>

              <div class="form__radio-group">
                <input
                  type="radio"
                  value="archived"
                  v-bind:id="id +'Archived'"
                  v-model="typeList"
                  class="form__radio"
                />
                <label v-bind:for="id +'Archived'" class="form__radio">Arch</label>
              </div>
            </div>
          </div>
          <div class="card-container__box scroll">
            <div class="card-simple" v-for="customer in selectedList" :key="customer.id">
              <p class="card-simple__title">
                {{customer.firstName + ' ' + customer.lastName}}
              </p>
              <div class="card-simple__actions">
                <a :href="'#'+id+'Form'" class="btn btn--success" @click="loadCustomer(customer)">Actualizar Datos</a>
              </div>
            </div>
          </div>
          <p class="card-container__footer">Clientes: <span class="text-bold">{{selectedList.length}}</span></p>
        </div>
      </div>
    </section>
    <aside class="view__sidebar">
      <customer-list :id="id + 'CustumerList'" @customer-selected="loadCustomer" :customer-selected="customerSelected"></customer-list>
      <transition name="fade">
        <customer-history :customer = "customerSelected" v-show = "customerSelected"></customer-history>
      </transition>
    </aside>
  </div>
	`,
});

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
    style="letter-spacing: 5px;"
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

Vue.component("customer-card", {
  props: ["customer", "actions", "call"],
  methods: {
    ...Vuex.mapActions(["archiveUnarchiveCustomer", "deleteCustomer"]),
    formatCurrency(value) {
      var formatted = new Intl.NumberFormat("es-Co", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
      }).format(value);
      return formatted;
    }, //Fin del metodo
    onArchivedUnarchiveCustomer() {
      if (this.customer && this.customer.id > 0) {
        let formData = new FormData();
        formData.append("customer_id", this.customer.id);
        formData.append("archive", !this.customer.archived);
        this.archiveUnarchiveCustomer(formData);
      }
    },
    onDeleteCustomer() {
      if (this.customer && this.customer.id > 0) {
        let message1 = `Se va a eliminar al cliente: ${this.customer.fullName}`;
        let message2 = "Está seguro que desea eliminar al cliente";
        if (confirm(message1)) {
          if (confirm(message2)) {
            let formData = new FormData();
            formData.append("customer_id", this.customer.id);
            this.deleteCustomer(formData);
          }
        }
      }
    },
  },
  computed: {
    classState() {
      if (this.customer.inactive) {
        return { "customer-card--inactive": true };
      } else if (this.customer.deliquentBalance) {
        return { "customer-card--late": true };
      }

      return { success: false };
    },
    fullName() {
      return this.customer.firstName + " " + this.customer.lastName;
    },
    canCall() {
      return this.call && this.customer && this.customer.phone;
    }
  },
  template:
  /*html*/`
  <div class="customer-card" :class="classState" v-if="customer" @click="$emit('click')">
    <div class="customer-card__archived">
      <i class="fas fa-folder-open" v-show="!customer.archived"></i>
      <i class="fas fa-folder" v-show="customer.archived"></i>
    </div>
    <div class="customer-card__header">
      <h3 class="customer-card__name">{{fullName}}</h3>
      <p class="customer-card__info">{{customer.state}}</p>
    </div>
    <p class="customer-card__balance">{{formatCurrency(customer.balance)}}</p>
    <div>
      <p class="customer-card__debts">Creditos: {{customer.credits.length}}</p>
      <p class="customer-card__points">Abonos: {{customer.payments.length}}</p>
      <p class="customer-card__points">
        Puntos: <span class="text-bold" :class="{'text-success': customer.points > 0, 'text-danger': customer.points < 0}">{{customer.points}}</span>
      </p>
    </div>
    <div class="customer-card__actions" v-if="actions">
      <button class="btn btn--primary btn--small" @click="onArchivedUnarchiveCustomer">
        <i class="btn__prepend fas fa-folder" v-show="!customer.archived"></i>
        <i class="btn__prepend fas fa-folder-open" v-show="customer.archived"></i>
        <span class="btn__content" v-show="!customer.archived">Archivar</span>
        <span class="btn__content" v-show="customer.archived">Desarch</span>
      </button>
      <button 
        class="btn btn--small"
        :class="{'btn--danger': customer.balance <= 0, 'btn--disabled': customer.balance > 0}"
        :disabled="customer.balance > 0"
        @click="onDeleteCustomer"
      >
        <i class="btn__prepend fas fa-trash-alt"></i>
        <span class="btn__content">Eliminar</span>
      </button>
      <a :href="'tel:'+customer.phone" class="btn btn--success btn--small customer-card__actions--extends view-desktop-colapse" v-if="canCall">
        <i class="btn__prepend fas fa-phone-alt"></i>
        <span class="btn__content">Llamar</span>
      </a>
    </div>
  </div>`,
});

Vue.component("search-box", {
  props: ['id'],
  data: function () {
    return {
      customerSelected: undefined,
      showBox: false,
      customerName: "",
      typeList: 'all'
    };
  }, //Fin de data
  methods: {
    onCustomerSelected(customer) {
      this.customerSelected = customer;
      this.$emit("customer-selected", customer);
    },
    onCustomerWasDeleted() {
      this.customerSelected = undefined;
    },
  }, //Fin de methods
  computed: {
    ...Vuex.mapState(["customers", "eventHub"]),
    customerResult() {
      let result = [];
      if (this.customerName) {
        result = this.customerList.filter((c) =>
          textInclude(`${c.firstName} ${c.lastName}`, this.customerName)
        );
      } else {
        result = this.customerList;
      }
      return result;
    },
    customerList() {
      let list = [];
      switch (this.typeList) {
        case 'all':
          list = this.customers;
          break;
        case 'archived':
          list = this.customers.filter(c => c.archived);
          list = list.sort((c1,c2) => c1.paymentFrecuency - c2.paymentFrecuency);
          break;
        case 'active':
          list = this.customers.filter(c => c.balance > 0 && !c.archived);
          list = list.sort((c1,c2) => c1.paymentFrecuency - c2.paymentFrecuency);
          break;
        case 'inactive':
          list = this.customers.filter(c => c.balance <= 0 && !c.archived);
          break;
      }
      return list;
    }, 
    customersAmount(){
      let amount = 0;
      this.customerList.forEach(customer => {
        amount += customer.balance;
      })
      return formatCurrencyLite(amount, 0);
    }
  },
  mounted() {
    this.eventHub.$on("customer-was-deleted", this.onCustomerWasDeleted);
  },
  template:
  /*html*/`
  <div class="search-box">
    <div class="card-container__options">
      <div class="form__group-flex--small">
        <div class="form__radio-group">
          <input
            type="radio"
            value="all"
            v-bind:id="id +'All'"
            class="form__radio"
            v-model="typeList"
          />
          <label v-bind:for="id +'All'" class="form__radio">Todos</label>
        </div>
        <div class="form__radio-group">
          <input
            type="radio"
            value="active"
            v-bind:id="id+'Active'"
            class="form__radio"
            v-model="typeList"
          />
          <label v-bind:for="id+'Active'" class="form__radio">Act</label>
        </div>

        <div class="form__radio-group">
          <input
            type="radio"
            value="inactive"
            v-bind:id="id +'Inactive'"
            class="form__radio"
            v-model="typeList"
          />
          <label v-bind:for="id +'Inactive'" class="form__radio">Inact</label>
        </div>

        <div class="form__radio-group">
          <input
            type="radio"
            value="archived"
            v-bind:id="id +'Archived'"
            class="form__radio"
            v-model="typeList"
          />
          <label v-bind:for="id +'Archived'" class="form__radio">Arch</label>
        </div>
      </div>
    </div>
    <input 
      type="text" 
      class="search-box__search" 
      placeholder="Buscar Cliente por Nombre"
      v-model.trim="customerName"
      @focus="showBox=true"
      @blur="showBox=false">
    <div class="search-box__content" :class="{'m-b': showBox}">
      <div class="search-box__result scroll" :class="{show: showBox}">
        <customer-card 
          v-for="customer in customerResult" 
          :key="customer.id" 
          :customer="customer"
          @click="onCustomerSelected(customer)"
        >
        </customer-card>
      </div>
      <p class="search-box__count" :class="{show: showBox}">Clientes: <span class="text-bold">{{customerResult.length}} ({{customersAmount}})</span></p>
    </div>
    <div class="search-box__selected">
      <customer-card :customer="customerSelected" v-show="customerSelected" :actions="true" :call="true"></customer-card>
      <p v-show="!customerSelected">Selecciona a un cliente para poder agregar un abono o un credito</p>
    </div>
  </div>`,
});

Vue.component("new-operation-form", {
  props: ["customer", "id"],
  data: function () {
    return {
      operationType: "payment",
      operationMoment: "now",
      maxDate: moment().subtract(1, "d").format("YYYY-MM-DD"),
      date: new DataInput(),
      description: new DataInput(),
      paymentType: "cash",
      amount: new DataInput(),
      exceedsTheQuota: false,
    };
  }, //Fin de data
  methods: {
    ...Vuex.mapActions(["newPayment", "newCredit"]),
    validateDate() {
      let isOk = false;
      let value = this.date.value;
      let message = ";";
      if (this.operationMoment !== "now") {
        if (value && typeof value === "string") {
          if (moment(value).isValid()) {
            let date = moment(value);
            if (
              date.isAfter(this.minDate) &&
              date.isBefore(moment().startOf("day"))
            ) {
              isOk = true;
            } else {
              message = "Está fecha no está permitida";
            }
          } else {
            message = "Ingresa una fecha valida";
          }
        } else {
          message = "Selecciona o escribe una fecha valida";
        }
      } else {
        isOk = true;
        message = "";
      }

      if (isOk) {
        this.date.isCorrect();
      } else {
        this.date.isIncorrect(message);
      }

      return isOk;
    },
    validateDescription() {
      let isOk = false;

      if (this.isCredit) {
        if (this.description.value) {
          if (this.description.value.length < 45) {
            isOk = true;
            this.description.isCorrect();
          } else {
            this.description.isIncorrect("Descripción demasiado larga");
          }
        } else {
          this.description.isIncorrect("Este campo no puede estar en blanco");
        }
      } else {
        isOk = true;
        this.description.isCorrect();
      }

      return isOk;
    },
    validateAmount() {
      let isOk = false;
      let value = this.amount.value;
      let message = "";
      if (value) {
        value = parseFloat(deleteCurrencyFormater(value));
        if (!isNaN(value) && value > 0) {
          if (value >= 1000) {
            if (this.operationType === "payment") {
              this.exceedsTheQuota = false;
              if (this.customer.balance >= value) {
                isOk = true;
              } else {
                message = "El abono supera la deuda";
              }
            } else {
              this.verifyQuota(value);
              isOk = true;
            }
          } else {
            message = "La cifra es muy pequeña";
          }
        } else {
          message = "Ingresa un valor válido";
        }
      } else {
        message = "Este campo es requerído";
      }

      if (isOk) {
        this.amount.isCorrect();
      } else {
        this.amount.isIncorrect(message);
      }

      return isOk;
    },
    verifyQuota(value) {
      if (this.customer) {
        let customerBalance = this.customer.balance;
        if (customerBalance + value > 250000) {
          this.exceedsTheQuota = true;
        } else {
          this.exceedsTheQuota = false;
        }
      } else {
        this.exceedsTheQuota = false;
      }
    },
    onClick() {
      console.log(this.date);
    },
    onSubmit() {
      let dateIsOk = this.validateDate();
      let descriptionIsOk = this.validateDescription();
      let amountIsOk = this.validateAmount();

      if (
        this.customer &&
        this.customer instanceof Customer &&
        dateIsOk &&
        descriptionIsOk &&
        amountIsOk
      ) {
        let customerId = this.customer.id;
        let isNow = this.operationMoment === "now" ? true : false;
        let date = this.date.value;
        let description = this.description.value;
        let cash = this.paymentType === "cash" ? true : false;
        let amount = parseFloat(deleteCurrencyFormater(this.amount.value));

        let data = new FormData();
        data.append("customer_id", customerId);
        data.append("date", date);
        data.append("description", description);
        data.append("cash", cash);
        data.append("amount", amount);

        switch (this.operationType) {
          case "credit":
            this.newCredit(data);
            break;
          case "payment":
            this.newPayment(data);
            break;
          default:
            break;
        }
      }
    },
    resetFields() {
      this.operationType = "payment";
      this.paymentType = "cash";
      this.operationMoment = "now";
      this.description.resetInput();
      this.amount.resetInput();
      this.date.resetInput();
    },
  }, //Fin de methods
  computed: {
    ...Vuex.mapState(["eventHub"]),
    formTitle() {
      let title = "";
      switch (this.operationType) {
        case "payment":
          title = "Registrar Abono";
          break;
        case "credit":
          title = "Registar Credito";
          break;
        default:
          title = "Selecciona una opción";
      }

      return title;
    },
    isCredit() {
      return this.operationType === "credit";
    },
    minDate() {
      let minDate = moment().startOf("year");
      //Si el cliente no tiene credito la fecha minima
      if (this.customer) {
        let creditCount = this.customer.credits.length;
        console.log(creditCount);
        if (creditCount > 0) {
          let maxCreditDate = moment(
            this.customer.credits[creditCount - 1].date
          );
          minDate = maxCreditDate;
          let paymentCount = this.customer.payments.length;
          if (paymentCount > 0) {
            let maxPaymentDate = moment(
              this.customer.payments[paymentCount - 1].date
            );
            minDate = maxPaymentDate.isSameOrAfter(maxCreditDate)
              ? maxPaymentDate
              : maxCreditDate;
          }
        }
      }
      return minDate;
    },
    disabledSubmit() {
      //by default the button is activated
      let result = false;
      if (this.customer) {
        if (this.operationType === "payment" && this.customer.balance <= 0) {
          /**
           * The button is disabled when
           * the customer's balance is zero
           */
          result = true;
        }
      } else {
        /**
         * The button is disables in all case when a
         * customer has not been selected
         */
        result = true;
      }

      return result;
    },
  }, //Fin de computed,
  mounted() {
    // this.$root.$on("credit-was-created", this.resetFields);
    this.eventHub.$on("credit-was-created", this.resetFields);
    this.eventHub.$on("payment-was-created", this.resetFields);
  },
  template: /*html*/ `
  <form class="form form--bg-light" @submit.prevent="onSubmit" :id="id + 'Form'">
    <div class="form__header">
      <h2 class="form__title">{{formTitle}}</h2>
    </div>
    <div class="form__content">
      <!-- CAMPO PARA DEFINIR LA OPERACION -->
      <label class="form__label">Tipo de operacion</label>
      <div class="form__group-flex m-b">
        <!-- CREDITO -->
        <div class="form__radio-group">
          <input
            type="radio"
            name="operationType"
            value="credit"
            v-bind:id="id + 'credit'"
            v-model="operationType"
            class="form__radio"
          />
          <label v-bind:for="id + 'credit'" class="form__radio">Credito</label>
        </div>  
        <!-- ABONO -->
        <div class="form__radio-group">
          <input
            type="radio"
            name="operationType"
            value="payment"
            v-bind:id="id + 'payment'"
            v-model="operationType"
            class="form__radio"
          />
          <label v-bind:for="id + 'payment'" class="form__radio">Abono</label>
        </div>
      </div>
      <!-- DEFINIR LA FORMA DE PAGO -->
      <transition name="fade">
        <div v-show="!isCredit">
          <label class="form__input">Selecciona la forma de pago</label>
          <div class="form__group-flex m-b" >
            <div class="form__radio-group">
              <input
                type="radio"
                name="paymentType"
                value="cash"
                v-model="paymentType"
                v-bind:id="id + 'cash'"
                class="form__radio"
              />
              <label v-bind:for="id + 'cash'" class="form__radio">Efectivo</label>
            </div>  
            <!-- Seleccion de pago -->
            <div class="form__radio-group">
              <input
                type="radio"
                name="card"
                value="card"
                v-model="paymentType"
                v-bind:id="id + 'card'"
                class="form__radio"
              />
              <label v-bind:for="id + 'card'" class="form__radio">Tarjeta</label>
            </div>
          </div>
        </div>
      </transition>
      <!-- Campo para definir el momento de la operacion -->
      <label class="form__label">Fecha del {{isCredit ? 'credito' : 'abono'}}</label>
      <div class="form__group-flex m-b">
        <!-- Seleccionar ahora -->
        <div class="form__radio-group">
          <input
            type="radio"
            name="operationMoment"
            :id="id + 'now'"
            value="now"
            v-model="operationMoment"
            class="form__radio"
          />
          <label :for="id + 'now'" class="form__radio">Ahora</label>
        </div>  
        <!-- Seleccion de pago -->
        <div class="form__radio-group">
          <input
            type="radio"
            name="operationMoment"
            :id="id + 'other'"
            value="other"
            v-model="operationMoment"
            class="form__radio"
          />
          <label :for="id + 'other'" class="form__radio">Otra Fecha</label>
        </div>
      </div>
      
      <!-- Campo opcional para seleccionar la fecha -->
      <transition name="fade">
        <div v-show="operationMoment === 'other'">
          <label :for="id + 'date'" class="form__label">Selecciona una fecha</label>
          <input 
            type="date" 
            name="date" 
            v-bind:min="minDate.format('YYYY-MM-DD')"
            v-bind:max="maxDate"
            v-bind:id="id + 'date'" 
            :class="['form__input', {error: date.hasError}]"
            v-model="date.value"
            @blur="validateDate"
            @change="validateDate"
          />
          <p :class="['alert', 'alert--danger', {show:date.hasError}]">{{date.message}}</p>
        </div>
      </transition>
      
      <!-- Campo para agregar la descripcion del credito -->
      <transition name="fade">
        <div v-show="isCredit">
          <label for="description" class="form__label text-bold text-center">Detalles del credito</label>
          <textarea 
            name="description" 
            v-bind:id="id + 'description'" 
            v-model="description.value"
            @focus="$event.target.select()"
            @change="validateDescription"
            @blur="validateDescription"
            cols="30" rows="3" 
            :class="['form__input', {error:description.hasError}]"
            placeholder="Escribe los detalles aquí"
          >
          </textarea>
          <p :class="['alert', 'alert--danger', {show:description.hasError}]">{{description.message}}</p>
        </div>
      </transition>

      <!-- Campo para el ingreso del importe -->
      <label :for="id + 'amount'" class="form__label text-bold text-center">
        {{isCredit ? 'Valor del credito' : 'Importe a abonar'}}
      </label>

      <input-money 
        :id="id + 'amount'" 
        required 
        v-model="amount.value" 
        @blur="validateAmount"
        @change="validateAmount"
      >
      </input-money>
      <p :class="['alert', 'alert--danger', {show: amount.hasError}]">{{amount.message}}</p>
      <p :class="['alert', 'alert--warning', {show: exceedsTheQuota}]">
        <span class="text-bold">Ojo</span>: Se supera el cupo maximo
      </p>
    </div>
    <div class="form__actions">
      <input type="submit" 
        :value="isCredit ? 'Registar Credito' : 'Registrar Abono'" 
        :class="['btn', {'btn--success': !disabledSubmit, 'btn--disabled':disabledSubmit}]"
        :disabled="disabledSubmit"
      >
    </div>            
  </form>`,
});

Vue.component("customer-credits", {
  props: ["customer", "id"],
  data: function () {
    return {
      // creditType:"pending",
      creditType: "pending",
    };
  }, //Fin de data
  methods: {}, //Fin fr mrthods
  computed: {
    credits() {
      let credits = [];
      if (this.customer) {
        switch (this.creditType) {
          case "pending":
            {
              credits = this.customer.credits.filter((c) => c.balance > 0);
            }
            break;
          case "all": {
            credits = this.customer.credits;
          }
        }
      }

      return credits;
    },
    creditsData() {
      let data = [];
      //Ahora construyo los datos
      this.credits.forEach((c) => {
        let id = c.id;
        let title = c.description;
        let date = `${moment(c.date).calendar()} (${moment(c.date).fromNow()})`;
        let amount = formatCurrencyLite(c.amount, 0);
        let balance = formatCurrencyLite(c.balance, 0);
        data.push({
          id,
          title,
          date,
          amount,
          balance,
        });
      });
      return data;
    },
    totalAmount() {
      let amount = 0;
      this.credits.forEach((c) => {
        amount += c.amount;
      });

      return formatCurrencyLite(amount, 0);
    },
    deliquentBalance() {
      let balance = 0;
      this.credits.forEach((c) => {
        balance += c.balance;
      });
      return formatCurrencyLite(balance, 0);
    },
  }, //Fin de computed
  template: `
  <div class="card-container">
    <h2 class="card-container__title text-bold">Historial de Creditos</h2>
    <div class="card-container__options">
      <div class="form__group-flex">
        <!-- Seleccion de los creditos a mostar-->
        <div class="form__radio-group">
          <input
            type="radio"
            :name="id + 'crediType'"
            :id="id + 'Credit'"
            class="form__radio"
            value="all"
            v-model="creditType"
          />
          <label :for="id + 'Credit'" class="form__radio">Todos</label>
        </div>  
        <!-- Seleccion de pago -->
        <div class="form__radio-group">
          <input
            type="radio"
            :name="id + 'crediType'"
            :id="id + 'Pending'"
            value="pending"
            v-model="creditType"
            class="form__radio"
          />
          <label :for="id + 'Pending'" class="form__radio">Pendientes</label>
        </div>
      </div>
    </div>
    <div class="card-container__box scroll">
      <div class="debt-card" v-for="data in creditsData" :key="data.id">
        <p class="debt-card__title">{{data.title}}</p>
        <p class="debt-card__date">{{data.date}}</p>
        <p class="debt-card__label">Valor Inicial</p>
        <p class="debt-card__label">Saldo pendiente</p>
        <p class="debt-card__money">{{data.amount}}</p>
        <p class="debt-card__money debt-card__money--bold">{{data.balance}}</p>
      </div>
    </div>
    <div class="card-container__footer">
      <p>Creditos({{credits.length}}): <span class="text-bold">{{totalAmount}}</span></p>
      <p>Pendiente: <span class="text-bold">{{deliquentBalance}}</span></p>
    </div>
  </div>`,
});

Vue.component("customer-history", {
  props: ["customer"],
  data: function () {
    return {};
  }, //Fin de data
  methods: {
    historyCompareByDate(history1, history2) {
      if (history1.date.isBefore(history2.date)) {
        return -1;
      } else if (history1.date.isSame(history2.date)) {
        return 0;
      } else {
        return 1;
      }

      return 0;
    },
  }, //Fin de methods
  computed: {
    creditData() {
      let result = [];
      if (this.customer && this.customer instanceof Customer) {
        let credits = this.customer.credits;
        credits.forEach((credit) => {
          let date = moment(credit.date);
          let creditAmount = credit.amount;
          let paymentAmount = 0;
          let balance = 0;
          result.push({ date, creditAmount, paymentAmount, balance });
        });
      } //Fin de if
      return result;
    },
    paymentData() {
      let result = [];
      if (this.customer && this.customer instanceof Customer) {
        let payments = this.customer.payments;
        payments.forEach((payment) => {
          let date = moment(payment.date);
          let creditAmount = 0;
          let paymentAmount = payment.amount;
          let balance = 0;
          result.push({ date, creditAmount, paymentAmount, balance });
        });
      }
      return result;
    },
    historyData() {
      let credits = this.creditData;
      let payments = this.paymentData;
      let historyData = credits.concat(payments);
      //Ahora se ordena por orden cronologico
      historyData.sort(this.historyCompareByDate);

      //Ahora se calcula el saldo
      let balance = 0;
      historyData.forEach((data) => {
        balance += data.creditAmount - data.paymentAmount;
        data.balance = balance;
      });

      //Ahora se retrnan los datos
      return historyData;
    },
    viewData() {
      let history = this.historyData;
      let data = [];
      history.forEach((h) => {
        let date = h.date.format("DD/MMM/YY");
        let credit =
          h.creditAmount > 0 ? formatCurrencyLite(h.creditAmount, 0) : "";
        let payment =
          h.paymentAmount > 0 ? formatCurrencyLite(h.paymentAmount, 0) : "";
        let balance = formatCurrencyLite(h.balance, 0);
        data.push({ date, credit, payment, balance });
      });
      return data;
    },
  }, //Fin de computed
  template: `
  <div class="m-b-1">
    <div class="history__header">
      <h2 class="history__title">Historial</h2>
    </div>
    <div class="history__head">
      <table class="table">
        <thead>
          <tr class="table__row-header">
            <th class="table__header table--25 text-center">Fecha</th>
            <th class="table__header table--25 text-center">Credito</th>
            <th class="table__header table--25 text-center">Abono</th>
            <th class="table__header table--25 text-center">Saldo</th>
          </tr>
        </thead>
      </table>
    </div>
    <div class="history__body scroll">
      <table class="table">
        <tbody class="table__body">
          <template v-for="(data, index) in viewData">
            <tr class="table__row" :key="index">
              <td class="table__data table--25 text-center">{{data.date}}</td>
              <td class="table__data table--25 text-right">{{data.credit}}</td>
              <td class="table__data table--25 text-right">{{data.payment}}</td>
              <td class="table__data table--25 text-right">{{data.balance}}</td>
            </tr>
          </template>        
        </tbody>
      </table>
    </div>
    <div class="history__footer">
      <p></p>
      <p class="history__info">Operaciones: {{viewData.length}}</p>
    </div>
  </div>`,
});

Vue.component("operation-register", {
  props: ["id"],
  data: function () {
    return {
      customerSelected: undefined,
      waiting: false,
      processResult: { visible: false, hasError: false, message: "" },
    };
  },
  methods: {
    onCustomerSelected(customer) {
      this.customerSelected = customer;
    },
    onCustomerDeleted() {
      if (this.customerSelected) {
        console.log(this.customers.length);
        console.log(
          this.customers.some((c) => c.id === this.customerSelected.id)
        );
        if (!this.customers.some((c) => c.id === this.customerSelected.id)) {
          this.customerSelected = undefined;
        }
      }
    },
  },
  computed: {
    ...Vuex.mapState(["customers", "eventHub"]),
  },
  mounted() {
    this.eventHub.$on("customer-was-deleted", this.onCustomerDeleted);
  },
  template: /*html*/ `
  <div class="view" :id="id">
    <section class="view__section">
      <div class="container">
        <div class="container__header container__header--success">
          <h1 class="container__title">Sistema de Clientes</h1>
          <p class="container__subtitle">Registrar Operaciones</p>
        </div>
        <!-- Modulo para la busqueda de cliente -->
        <search-box @customer-selected="onCustomerSelected"></search-box>
        <!-- FORMULARIO DE REGISTRO O ACTUALIZACIÓN -->
        
        <transition name="fade">
          <new-operation-form 
            v-if="customerSelected" 
            :customer="customerSelected" 
            :id="id +'Form'"            
            @new-credit="$emit('new-credit', $event)"
            @new-payment="$emit('new-payment', $event)"
          >
          </new-operation-form>
        </transition>
        
        <!-- Historial del cliente -->
        <transition name="fade">
          <customer-history :customer="customerSelected" v-if="customerSelected" class="view-desktop-colapse"></customer-history>
        </transition>

        <!-- Contenedor con las tarjetas de creditos -->
        <transition name="fade">
          <customer-credits :customer="customerSelected" :id="id + 'creditHistoryMovil'" v-if="customerSelected" class="view-desktop-colapse"></customer-credits>
        </transition>
        
      </div>
    </section>
    <aside class="view__sidebar">
      <!-- Contenedor con las tarjetas de creditos -->
      <customer-history :customer="customerSelected"></customer-history>
      <customer-credits :customer="customerSelected" :id="id + 'creditHistoryDesktop'"></customer-credits>
    </aside>
  </div>`,
});

Vue.component("history-view", {
  data(){
    return {
      historyList: [
        {id:0, value: "credits", name:"Creditos"},
        {id:1, value: "payments", name:"Abonos"},
        {id:2, value: "updates", name:"Actualizaciones"},
      ],
      historyName: "credits",
    }
  },
  computed:{
    ...Vuex.mapState(['customers', 'history']),
    cards(){
      let cards = [];
      switch (this.historyName) {
        case 'credits':
          cards = this.history.filter(record => record.newCredit);
          break;
        case 'payments':
          cards = this.history.filter(record => record.newPayment);
          break;
        case 'updates':
          cards = this.history.filter(record => record.updateData || record.updateCredit || record.updatePayment);
          break;

      
        default:
          break;
      }
      return cards;
    },
    info(){
      let message = "";
      switch (this.historyName) {
        case 'credits':
          message = "Se registró un crédito por valor de ";
          break;
        case 'payments':
          message = "Se registró un pago por valor de ";
          break;
        case 'updates':
          message = "Se modificaron los datos personales ";
          break;
        default:
          break;
      }

      return message;
    }
  },
  methods:{
    formatCurrency: formatCurrencyLite,
  },
  template:
  /*html*/`
  <div class="view">
    <section class="view__section">
      <div class="container">
        <div class="container__header container__header--success">
          <h1 class="container__title">Sistema de Clientes</h1>
          <p class="container__subtitle">Historial de operaciones</p>
        </div>
          
        <div class="card-container">
          <h2 class="card-container__title">Historial de operaciones</h2>
          <select  class="form__input" v-model="historyName">
            <option v-for="item of historyList" :key="item.id" :value="item.value">{{item.name}}</option>
          </select>
          <div class="card-container__box scroll">
            <div 
              v-for="(card, index) of cards"
              :key="index"
              class="history__card" 
              :class="{'history__card--recently': card.recently}"
            >
              <p class="history__card__title">
                {{card.customer}}
              </p>
              <p class="history__card__date">
                {{card.historyDate.calendar()}}
              </p>
              <p class="history__card__info">
                {{info}} <span class="history__card__bold">{{card.amount ? formatCurrency(card.amount, 0) : ''}}</span>
              </p>
              <p class="history__card__author">Responsable: <span class="history__card__bold">{{card.author}}</span></p>
            </div>
          </div>
        </div>
      </div>

    </section>
    <aside class="view__sidebar">
    </aside>
  </div>
  `
})