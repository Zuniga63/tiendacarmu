console.log('sale.js está funcionando');
const vm = new Vue({
  el: '#app',
  data: {
    title: "Sistema de ventas",
    subtitle: "Gestion de categorías",
    categories: [
      {
        id: 1,
        name: "Categoría 1",
        sales: [
          { id: 1, saleDate: "2020-01-01", description: "Una descriptcion", amount: 100000 },
          { id: 1, saleDate: "2020-01-01", description: "Una descriptcion", amount: 1000000 },
          { id: 1, saleDate: "2020-01-01", description: "Una descriptcion", amount: 10000000 },
        ]
      },
      {
        id: 2,
        name: "Categoría 2",
        sales: [
          { id: 1, saleDate: "2020-01-01", description: "Una descriptcion", amount: 100000 },
          { id: 1, saleDate: "2020-01-01", description: "Una descriptcion", amount: 1000000 },
          { id: 1, saleDate: "2020-01-01", description: "Una descriptcion", amount: 10000000 },
        ]
      }
    ],//Fin de categories
    views: {
      newCategory: {
        visible: true,
        categoryName: "",
        categoryNameError: false,
        errorMessage: "",

      },//Fin de newCategory
    },//Fin de views
  }, //Fin de data
  computed:{
    newCategoryNameLength(){
      let categoryLength = this.views.newCategory.categoryName.length;
      let messageError = this.views.newCategory.errorMessage;
      let  = this.views.newCategory.categoryNameError;

      let maxLength = 45;
      if(categoryLength> maxLength){
        maxLength = 0;
        messageError = "Supera el maximo permitido";
        categoryNameError = true;
      }else{
        categoryNameError = false;
        maxLength -= categoryLength;
      }

      return maxLength;
    }
  }
})