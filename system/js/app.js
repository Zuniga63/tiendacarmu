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
    //---------------------------------------
    //  Estado de la vista de ventas
    //---------------------------------------
    categories: [],
    sales: [],
    confirmSaleModal: new NewSaleModal(),
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
    //---------------------------------------
    //  Mutaciones de las ventas
    //---------------------------------------
    showConfirmSaleModal(state, payload) {
      state.confirmSaleModal.visible = true;
      state.confirmSaleModal.formData = payload;
    },
    hiddenConfirmSaleModal(state) {
      state.confirmSaleModal.visible = false;
      state.confirmSaleModal.formData = undefined;
    },
    updateCategoryList(state, list) {
      state.categories = list.sort((c1, c2) => c2.totalAmount - c1.totalAmount);
    },
    updateSaleList(state, list) {
      state.sales = list;
    },
  },
  actions: {
    /**
     * Se encarga de hacer la peticion al servidor para recuperar los
     * datos de las ventas y las categorías
     */
    async getSalesAndCategories({ commit }) {
      commit("showWaitingRequest", "Recuperando ventas y categorías");
      try {
        const res = await fetch("./api/sales_api.php");
        const data = await res.json();

        if (data.sessionActive) {
          let categoriesTemporal = [];
          let salesTemporal = [];

          //Se crean las categorías
          data.categories.forEach((c) => {
            //Se crea la instancia de categoría
            let category = new Category(
              c.id,
              c.name,
              c.totalAmount,
              c.averageSale
            );
            //Se agregan las ventas asociadas a esta categoría
            c.sales.forEach((s) => {
              category.addSale(s.id, s.saleDate, s.description, s.amount);
            });
            //Finalmente se agrega al arreglo temporal
            categoriesTemporal.push(category);
          });

          //Ahora se crean las ventas
          let totalAmount = 0;
          data.sales.forEach((s) => {
            // console.log(s.saleDate);
            let sale = new Sale(s.id, s.saleDate, s.description, s.amount);
            salesTemporal.push(sale);
            totalAmount += sale.amount;
          });

          commit("updateCategoryList", categoriesTemporal);
          commit("updateSaleList", salesTemporal);
          commit("hiddenWaitingRequest");
        } else {
          location.reload();
        }
      } catch (error) {
        console.log(error);
      }
    },
    async addNewCategory({ commit, dispatch }, formData) {
      let isSuccess = false;
      let message = "";
      let eventName = "category-was-created";
      commit("showWaitingRequest", "Realizando registro...");
      try {
        const res = await fetch("./api/new_sale_category.php", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();

        if (data.sessionActive) {
          commit("hiddenWaitingRequest");
          if (data.request) {
            await dispatch("getSalesAndCategories");
            message = "Categoría creada con exito";
            isSuccess = true;
            commit("emitEvent", eventName);
          } else {
            message = "No se pudo crear la nueva categoría";
          }
        } else {
          location.reload();
        }
      } catch (error) {
        commit("hiddenWaitingRequest");
        message = "Error en la petición";
      }

      commit("requestResult", { isSuccess, message });
    },
    async addNewSale({ commit, dispatch }, formData) {
      let isSuccess = false;
      let message = "";
      let eventName = "sale-was-created";
      commit("showWaitingRequest", "Registrando nueva venta...");
      try {
        const res = await fetch("./api/new_sale.php", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();

        if (data.sessionActive) {
          commit("hiddenWaitingRequest");
          if (data.request) {
            await dispatch("getSalesAndCategories");
            message = "¡Venta creada con exito!";
            isSuccess = true;
            commit("emitEvent", eventName);
          } else {
            message = "¡No se pudo registrar la venta!";
          }
        } else {
          location.reload();
        }
      } catch (error) {
        commit("hiddenWaitingRequest");
        message = "Error en la petición";
      }
      commit("requestResult", { isSuccess, message });
    },
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
  computed: {
    ...Vuex.mapState(['actualView', 'rootView']),
  },
  methods: {
    ...Vuex.mapActions(['getSalesAndCategories']),
    onLoadingResource() {
      this.loadingResource = false;
    },
  },
  created() {
    moment.locale("es-do");
    this.getSalesAndCategories();
  },
  mounted() {
    
  },
  //TODO
});
