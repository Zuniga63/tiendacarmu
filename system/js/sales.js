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
      }, //Fin de newCategory
    }, //Fin de views
  }, //Fin de data
  methods: {
    validateCategoryName() {
      let view = this.views.newCategory;
      let name = view.categoryName.trim();
      if (name) {
        if (name.length > 4 && name.length <= 45) {
          let coincidence = this.categories.some(
            (c) => c.name.toUpperCase() === name.toUpperCase()
          );
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
          if(name.length > 45){
            view.errorMessage = "Supera el maximo permitido";
          }else{
            view.errorMessage = "Nombre demasiado corto";
          }
        } //Fin de if-else
      } else {
        //Entrar aquí significa que el campo está vacio
        view.categoryNameError = true;
        view.errorMessage = "Este campo es obligatorio";
      } //Fin de if-else

      return false;
    }, //Fin del metodo validateCategoryname
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
