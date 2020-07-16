console.log("sale.js está funcionando");
const vm = new Vue({
  el: "#app",
  data: {
    title: "Sistema de ventas",
    subtitle: "Gestion de categorías",
    categories: [
      {
        id: 1,
        name: "Categoría 1",
        totalAmount: 1345200,
        averageSale: 123546.34,
        sales: [
          {
            id: 1,
            saleDate: "2020-01-01",
            description: "Una descriptcion",
            amount: 100000,
          },
          {
            id: 1,
            saleDate: "2020-01-01",
            description: "Una descriptcion",
            amount: 1000000,
          },
          {
            id: 1,
            saleDate: "2020-01-01",
            description: "Una descriptcion",
            amount: 10000000,
          },
        ],
      },
      {
        id: 2,
        name: "Categoría 2",
        totalAmount: 1345200,
        averageSale: 123546.34,
        sales: [
          {
            id: 1,
            saleDate: "2020-01-01",
            description: "Una descriptcion",
            amount: 100000,
          },
          {
            id: 1,
            saleDate: "2020-01-01",
            description: "Una descriptcion",
            amount: 1000000,
          },
          {
            id: 1,
            saleDate: "2020-01-01",
            description: "Una descriptcion",
            amount: 10000000,
          },
        ],
      },
    ], //Fin de categories
    views: {
      newCategory: {
        visible: true,
        categoryName: "",
        categoryNameError: false,
        errorMessage: "",
        requestStart: false,
        response: true,
        responseMessage: "",
        responseMessageShow: false,
        buttomMessage: "Registrar categoría",
      }, //Fin de newCategory
      newSale:{
        visibility: false,
        now: true,
        otherDate: false,
        saleDescription: "",
        saleDescriptionError: "",
        amount: "",
      }
    }, //Fin de views
  }, //Fin de data
  methods: {
    /**
     * Verifica que el nombre de usuario no esté en uso, no este en blanco
     * y cambia el estado de las alertas
     */
    validateCategoryName() {
      let view = this.views.newCategory;
      let name = view.categoryName.trim();

      if (name) {
        if (name.length > 4 && name.length <= 45) {
          let coincidence = this.categories.some(
            (c) => c.name.toUpperCase() === name.toUpperCase()
          );

          //Retorna true unicamente cuando no hay coincidencias
          if (!coincidence) {
            view.categoryNameError = false;
            view.errorMessage = "";
            return true;
          } else {
            view.categoryNameError = true;
            view.errorMessage = "Ya está en uso";
          } //Fin de if-else
        } else {
          //Entrar aquí significa que el campo está vacio
          view.categoryNameError = true;
          if (name.length > 45) {
            view.errorMessage = "Supera el maximo permitido";
          } else {
            view.errorMessage = "Nombre demasiado corto";
          }
        } //Fin de if-else
      } else {
        view.categoryNameError = true;
        view.errorMessage = "Este campo es obligatorio";
      } //Fin de if-else

      return false;
    }, //Fin del metodo validateCategoryname,
    formatCurrency: formatCurrencyLite,
    /**
     * Lo que se debe hace cuando se le da a enviar el formulario
     */
    onNewCategorySudmit() {
      let view = this.views.newCategory;
      if (this.validateCategoryName() && !view.requestStart) {
        view.requestStart = true;
        view.buttomMessage = "Procesando solicitud";
        console.log("No se puede enviar aun");
        setTimeout(() => {
          let category = {
            id: this.categories.length + 1,
            name: view.categoryName,
            totalAmount: 0,
            averageSale: 0,
            sales: [],
          };

          this.categories.push(category);
          view.requestStart = false;
          view.buttomMessage = "Registrar categoría";
          view.response = true;
          view.responseMessage = "Proceso satisfactorio";
          view.responseMessageShow = true;
          setTimeout(() => {
            responseMessage = "";
            view.responseMessageShow = false;
          }, 3000);
        }, 3000);
      } //Fin de if
    }, //Fin del metodo
    deleteFormaterOfAmount(text) {
      let value = text.replace("$", "");
      value = value.split(".");
      value = value.join("");

      return value;
    },
  }, //Fin de methods
  computed: {
    newCategoryNameLength() {
      let categoryLength = this.views.newCategory.categoryName.length;

      let maxLength = 45;
      if (categoryLength > maxLength) {
        maxLength = 0;
        this.validateCategoryName();
      } else {
        maxLength -= categoryLength;
      }

      return maxLength;
    }, //Fin del metodo
  }, //Fin de computed
});
