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
    //---------------------------------------
    //  Estado relacionado a los clientes
    //---------------------------------------
    customers: [],
    history: [],
  },
  getters: {
    //---------------------------------------
    //  CLIENTES
    //---------------------------------------
    inactiveCustomerList: (state) => {
      return state.customers.filter((c) => c.inactive && !c.archived);
    },
    activeCustomerList: (state) => {
      return state.customers.filter((c) => !c.inactive && !c.archived);
    },
    archivedCustomerList: (state) => {
      return state.customers.filter((c) => c.archived);
    },
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
    //---------------------------------------
    //  Mutaciones los clientes
    //---------------------------------------
    updateCustomer(state, data) {
      if (state.customers.some((c) => c.id === data.id)) {
        let customer = state.customers.filter((c) => c.id === data.id)[0];
        customer.update(data);
      }
    },
    updateCustomerList(state, data) {
      // this.commit("waitingRequest", true);
      if (data.sessionActive) {
        state.customers = [];
        data.customers.forEach((c) => {
          const customer = new Customer(
            c.id,
            c.firstName,
            c.lastName,
            c.nit,
            c.phone,
            c.email,
            c.points,
            c.archived
          );
          //Ahora agrego los creditos del cliente
          c.credits.forEach((credit) => {
            customer.addCredit(
              credit.id,
              credit.creditDate,
              credit.description,
              credit.amount,
              credit.balance
            );
          });
          //Se agregan los abonos
          c.payments.forEach((payment) => {
            customer.addPayment(
              payment.id,
              payment.paymentDate,
              payment.amount,
              payment.cash
            );
          });

          customer.defineState();
          state.customers.push(customer);
        });
      } else {
        location.reload();
      }
      // this.commit("waitingRequest", false);
    },
    updateHistory(state, data){
      state.history = [];
      data.history.forEach(record => {
        let history = new CustomerHistory(record.author, record.customer, record.historyDate, record.newCustomer, record.updateData, record.updateCredit, record.updatePayment, record.newPayment, record.newCredit, record.amount);
        state.history.push(history);
      })
    },
    archiveCustomer(state, customerId) {
      let customerExist = state.customers.some((c) => c.id === customerId);
      if (customerExist) {
        const customer = state.customers.filter((c) => c.id === customerId)[0];
        customer.archived = true;
      }
    },
    unarchiveCustomer(state, customerId) {
      let customerExist = state.customers.some((c) => c.id === customerId);
      if (customerExist) {
        const customer = state.customers.filter((c) => c.id === customerId)[0];
        customer.archived = false;
      }
    },
  },
  actions: {
    //---------------------------------------
    //  Acciones de las ventas
    //---------------------------------------
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
    //---------------------------------------
    //  Acciones de los clientes
    //---------------------------------------
    async getCustomers({ commit }) {
      // commit("waitingRequest", true);
      commit("showWaitingRequest", "Recuperando clientes");
      try {
        const res = await fetch("./api/all_customers.php");
        const data = await res.json();
        commit("updateCustomerList", data);
        // commit("waitingRequest", false);
        commit("hiddenWaitingRequest");
      } catch (error) {
        console.log(error);
        // commit("waitingRequest", false);
        commit("hiddenWaitingRequest");
        commit(
          "requestResult",
          false,
          "No se pudo recuperar los datos de los clientes"
        );
      }
    },
    async getHistory({commit}){
      // commit("waitingRequest", true);
      commit("showWaitingRequest", "Recuperando historial");
      try {
        const res = await fetch("./api/customer_history.php");
        const data = await res.json();
        // commit("waitingRequest", false);
        commit("updateHistory", data);
        commit("hiddenWaitingRequest");
      } catch (error) {
        console.log(error);
        // commit("waitingRequest", true);
        commit("hiddenWaitingRequest");
        commit(
          "requestResult",
          false,
          "No se pudo recuperar los datos de los clientes"
        );
      }
    },
    async updateCustomer({ commit }, formData) {
      // commit("waitingRequest", true);
      commit("showWaitingRequest", "Actualizando cliente...");
      isSuccess = false;
      let eventName = "customer-was-updated";
      message = "";
      try {
        const res = await fetch("./api/update_customer.php", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        console.log(data);
        if (data.sessionActive) {
          if (data.request) {
            //Customer data is updated
            commit("updateCustomer", data.customer);
            isSuccess = true;
            message = "Cliente actualizado";
            commit("emitEvent", eventName);
          } else {
            message = "No se pudo actualizar";
          }
        } else {
          location.reload();
        }
      } catch (error) {
        console.log(error);
        message = "Error al conectar!";
      }
      // commit("waitingRequest", false);
      commit("hiddenWaitingRequest");
      commit("requestResult", { isSuccess, message });
      // return false;
    },
    async newCustomer({ commit, dispatch }, formData) {
      // commit("waitingRequest", true);
      commit("showWaitingRequest", "Registrando cliente");
      isSuccess = false;
      message = "";
      let eventName = "customer-was-created";

      try {
        const res = await fetch("./api/new_customer.php", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();

        if (data.sessionActive) {
          if (data.request) {
            await dispatch("getCustomers");
            isSuccess = true;
            message = "Cliente agregado";
            commit("emitEvent", eventName);
          } else {
            message = "No se pudo agregar el cliente";
          }
        } else {
          location.reload();
        }
      } catch (error) {
        console.log(error);
        message = "No se pudo hacer la petición";
      }
      // commit("waitingRequest", false);
      commit("hiddenWaitingRequest");
      commit("requestResult", { isSuccess, message });
    },
    async newPayment({ commit }, formData) {
      // commit("waitingRequest", true);
      commit("showWaitingRequest", "Registrando Pago...");
      let isSuccess = false;
      let message = "";
      let eventName = "payment-was-created";
      try {
        const res = await fetch("./api/new_payment.php", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();

        if (data.sessionActive) {
          if (data.request) {
            commit("updateCustomer", data.customer);
            commit("emitEvent", eventName);
            message = "Abono registrado con exito";
            isSuccess = true;
          } else {
            message = "No se pudo registrar el abono";
          }
        } else {
          location.reload();
        }
      } catch (error) {
        message = "La petición falló";
        console.log(error);
      }
      // commit("waitingRequest", false);
      commit("hiddenWaitingRequest");
      commit("requestResult", { isSuccess, message });
    },
    async newCredit({ commit }, formData) {
      // commit("waitingRequest", true);
      commit("showWaitingRequest", "Registrando credito...");
      let isSuccess = false;
      let message = "";
      let eventName = "credit-was-created";
      try {
        const res = await fetch("./api/new_credit.php", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.sessionActive) {
          if (data.request) {
            commit("updateCustomer", data.customer);
            commit("emitEvent", eventName);
            message = "Credito registrado con exito";
            isSuccess = true;
          } else {
            message = "No se pudo registrar el credito";
          }
        } else {
          location.reload();
        }
      } catch (error) {
        message = "La petición falló";
        console.log(error);
      }
      // commit("waitingRequest", false);
      commit("hiddenWaitingRequest");
      commit("requestResult", { isSuccess, message });
    },
    async archiveUnarchiveCustomer({ commit }, formData) {
      // commit("waitingRequest", true);
      commit("showWaitingRequest", "Procesando solicitud...");
      let isSuccess = false;
      let message = "";
      let customerId = parseInt(formData.get("customer_id"));
      try {
        const res = await fetch(
          "./api/customers/archived_unarchived_customer.php",
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await res.json();
        if (data.sessionActive) {
          if (data.request) {
            isSuccess = true;
            if (formData.get("archive") === "true") {
              commit("archiveCustomer", customerId);
              message = "Cliente archivado";
            } else {
              commit("unarchiveCustomer", customerId);
              message = "Cliente desarchivado";
            }
          } else {
            if (formData.get("archive")) {
              message = "No se pudo archivar el cliente";
            } else {
              message = "No se pudo desarchviar el cliente";
            }
          }
        } else {
          location.reload();
        }
      } catch (error) {
        console.log(error);
        message = "No se pudo hacer la petición";
      }
      // commit("waitingRequest", false);
      commit("hiddenWaitingRequest");
      commit("requestResult", { isSuccess, message });
    },
    async deleteCustomer({ commit, dispatch }, formData) {
      // commit("waitingRequest", true);
      commit("showWaitingRequest", "Eliminando cliente");
      isSuccess = false;
      message = "";
      eventName = "customer-was-deleted";
      try {
        const res = await fetch("./api/customers/delete_customer.php", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.sessionActive) {
          if (data.request) {
            await dispatch("getCustomers");
            commit("emitEvent", eventName);
            isSuccess = true;
            message = "Cliente Eliminado";
          } else {
            message = "No se pudo eliminar";
          }
        } else {
          location.reload();
        }
      } catch (error) {
        console.log(error);
        message = "No se pudo hacer la peticion";
      }
      // commit("waitingRequest", false);
      commit("hiddenWaitingRequest");
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
    ...Vuex.mapActions(['getSalesAndCategories', 'getCustomers', 'getHistory']),
    onLoadingResource() {
      this.loadingResource = false;
    },
  },
  created() {
    moment.locale("es-do");
    this.getSalesAndCategories();
    this.getCustomers();
    this.getHistory();
  },
  mounted() {
    
  },
  //TODO
});
