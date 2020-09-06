window.addEventListener('load', () => {
  document.getElementById('preload').classList.remove('show');
})

//--------------------------------------------------------
//  STORE DE VUEX
//--------------------------------------------------------
const store = new Vuex.Store({
  state: {
    //---------------------------------------
    //  Estado del navbar
    //---------------------------------------
    rootView: 'sales',
    actualView: 'categories',
    links: [],
    //---------------------------------------
    //  Estado de los modales globales
    //---------------------------------------
    waiting: false,
    waitingMessage: "Procesando solicitud",
    processResult: new RequesProcess(),
    //---------------------------------------
    //  Controlador de eventos globales
    //---------------------------------------
    eventHub: new Vue(),
  },
  getters: {
    //TODO
  },
  mutations: {
    //---------------------------------------
    //  Mutaciones del navbar
    //---------------------------------------
    /**
     * Metodo encargado de crear los links y los 
     * dropdown de la aplicación
     */
    createLinks(state) {
      state.links.push(new Link(1, 'Home', 'home', false, 'fas fa-home'));
      state.links.push(new Link(
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
      state.links.push(new Link(
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
      state.links.push(new Link(5, 'Mi cuenta', 'myAcount', true, 'fas fa-user'));
    },
    changeRootView(state, viewName) {
      state.rootView = viewName;
    },
    changeActualView(state, viewName) {
      state.actualView = viewName;
    },
    //---------------------------------------
    //  Mutaciones relacionados a los modales
    //  globales
    //---------------------------------------
    showWaitingRequest(state, message) {
      state.waiting = true;
      state.waitingMessage = message;
    },
    hiddenWaitingRequest(state) {
      state.waiting = false;
      state.waitingMessage = "";
    },
    requestResult(state, { isSuccess, message }) {
      if (isSuccess) {
        state.processResult.isSuccess(message);
      } else {
        state.processResult.isDanger(message);
      }
    },
    hiddenRequest(state) {
      state.processResult.visible = false;
    },
    emitEvent(state, eventName) {
      state.eventHub.$emit(eventName);
    },
  },
  actions: {
    //TODO
  }
})
//--------------------------------------------------------
//  RAiZ DE LA APLICACION
//--------------------------------------------------------
const app = new Vue({
  el: '#app',
  store,
  data: {
    loadingResource: true,
  },
  methods: {
    onLoadingResource() {
      this.loadingResource = false;
    },
  },
  mounted() {
    window.addEventListener('load', this.onLoadingResource);
  },
  //TODO
});
