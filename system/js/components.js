//---------------------------------------------------------------------------
//  UTILIDADES
//---------------------------------------------------------------------------
/**
 * Sirve como modelo para guardar los datos de los link del
 * panel de navegación
 */
class Link {
  /**
   * @constructor
   * @param {number} id Identificador del link
   * @param {string} name El nombre del link que se muestra en la vista
   * @param {string} viewName Es el nombre de la view que sirve para mostrar las vistas
   * @param {bool} isDropdown Si este link en especifico es un dropdown
   * @param {object} dropdownList Listado con instacia de link para mostrar en pantalla
   */
  constructor(id, name, viewName, disabled = false, prependIcon = '', isDropdown = false, dropdownList = []) {
    this.id = id;
    this.name = name;
    this.viewName = viewName;
    this.disabled = disabled;
    this.prependIcon = prependIcon;
    this.isDropdown = isDropdown;
    this.dropdownList = dropdownList;
  }
}
//---------------------------------------------------------------------------
//  COMPONENTES DEL PANEL DE NAVEGACION
//---------------------------------------------------------------------------
Vue.component('nav-bar', {
  data() {
    return {
      actualView: '',
      rootView:'',
      links: [],
      mainMenuHeight: 203,//Ojo: Este valor de momento está sujeto al numero de elementos actuales
    }
  },
  methods: {
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
    onTogglerClick() {
      let mainMenu = document.getElementById("navbar-collapse");
      this.showMenu(mainMenu);
    },
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
    onRootLinkClick(viewName){
      this.rootView = viewName;
      this.viewName = viewName;
      this.closeAllDropdown();
      this.onTogglerClick();
    },
    onDropdownClick(viewName, target){
      if(this.rootView != viewName){
        this.closeAllDropdown();
      }

      this.rootView = viewName;
      while(!target.classList.contains('dropdown')){
        target = target.parentElement;
      }
      let dropdownMenu = target.querySelector(".dropdown__nav");
      if(dropdownMenu.classList.contains('show')){
        this.dropdownController(target, false);
      }else{
        this.dropdownController(target);
      }
    },//Fin del metodo
    closeAllDropdown(){
      const dropdowns = document.querySelectorAll(".main-navbar .dropdown");
      dropdowns.forEach(dropdown => {
        this.dropdownController(dropdown, false);
      });
    },
    dropdownController(dropdown, open = "true"){
      let mainMenu = document.getElementById("navbar-collapse");
      let dropdownMenu = dropdown.querySelector(".dropdown__nav");
      let dropdownIcon = dropdown.querySelector(".dropdown__icon");

      if(dropdownMenu){
        if(open && !dropdownMenu.classList.contains("show")){
          dropdownIcon.classList.add("rotate");
          this.showMenu(dropdownMenu, mainMenu);
        }else if(!open && dropdownMenu.classList.contains("show")){
          dropdownIcon.classList.remove("rotate");
          this.showMenu(dropdownMenu, mainMenu);
          console.log('cerrando!')
        }
      }
    },
    onDropdownItemClick(viewName, rootViewName){
      this.rootView = rootViewName;
      this.actualView = viewName;
      console.log(viewName, rootViewName);
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