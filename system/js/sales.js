window.addEventListener("load", () => {
  document.getElementById("preload").classList.remove("show");
  vm.updateBiweeklyChart();
});

//---------------------------------------------------------------------------
//               HERRAMIENTAS PARA PINTAR GRAFICAS
//---------------------------------------------------------------------------
/**
 * Herramienta de ChartJs para gestionar el color
 */
let color = Chart.helpers.color;

let chartColors = {
  red: 'rgb(255, 99, 132)',
  orange: 'rgb(255, 159, 64)',
  yellow: 'rgb(255, 205, 86)',
  green: 'rgb(75, 192, 192)',
  blue: 'rgb(54, 162, 235)',
  purple: 'rgb(153, 102, 255)',
  grey: 'rgb(201, 203, 207)'
}

class DataInput {
  constructor(value = "", hasError = false, message = "") {
    this.value = value;
    this.hasError = hasError;
    this.message = message;
  }

  isCorret(message = "") {
    this.hasError = false;
    this.message = message;
  }

  isIncorrect(message = "") {
    this.hasError = true;
    this.message = message;
  }

  resetInput() {
    this.value = "";
    this.isCorret("");
  }
}

class NewSaleView {
  constructor() {
    this.visible = true;
    this.saleMoment = "now";
    this.saleDate = new DataInput();
    this.maxDate = moment().format("yyyy-MM-DD");
    this.categoryID = new DataInput();
    this.description = new DataInput();
    this.amount = new DataInput();
    this.showAlert = false;
    this.alertMessage = "";
    this.processSuccess = false;
    this.biweeklyChart = undefined;
  }

  resetView() {
    this.saleMoment = "now";
    this.saleDate.resetInput();
    this.categoryID.resetInput();
    this.description.resetInput();
    this.amount.resetInput();
  }
}

class NewSaleModal {
  constructor() {
    this.visible = false;
    this.date = "";
    this.description = "";
    this.amount = "";
  }

  showModal(date, description, amount) {
    this.visible = true;
    this.date = date;
    this.description = description;
    this.amount = amount;
  }

  hiddenModal() {
    this.visible = false;
    this.date = "";
    this.description = "";
    this.amount = "";
  }
}
class WaitingModal {
  constructor() {
    this.visible = false;
  }

  showModal() {
    this.visible = true;
  }

  hiddenModal() {
    this.visible = false;
  }
}

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

Vue.component("category-module", {
  props: ["categories"],
  template: `
  <div class="sumary">
    <h3 class="sumary__title">Listado de categorías</h3>
    <div class="sumary__box scroll">
      <div class="category-card" :class="{selected : category.selected}" v-for="category in categories" :key="category.id" @click="$emit('category-selected', category)">
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
  methods: {
    formatCurrency(value) {
      var formatted = new Intl.NumberFormat("es-Co", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
      }).format(value);
      return formatted;
    }, //Fin del metodo
  },
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
  props: ["sales", "amount", "subtitle"],
  template: `
  <div class="history">
    <div class="history__header">
      <h2 class="history__title">Historial de ventas</h2>
      <p class="history__subtitle">{{subtitle}}</p>
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
          <template v-for="sale in sales">
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
      <p class="history__info">Total: <span class="text-bold">{{formatCurrency(amount)}}</span></p>
      <p class="history__info">Ventas: <span class="text-bold">{{sales.length}}</span></p>
    </footer>
  </div>
  `,
  methods: {
    formatCurrency(value) {
      var formatted = new Intl.NumberFormat("es-Co", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
      }).format(value);
      return formatted;
    }, //Fin del metodo
  },
});

const vm = new Vue({
  el: "#app",
  data: {
    title: "Sistema de ventas",
    subtitle: "Gestion de categorías",
    categories: [], //Fin de categories
    sales: [],
    salesAmount: 0,
    views: {
      newCategory: {
        visible: false,
        categoryName: "",
        categoryNameError: false,
        errorMessage: "",
        requestStart: false,
        response: true,
        responseMessage: "",
        responseMessageShow: false,
        buttomMessage: "Registrar categoría",
        categorySelected: null,
        categorySales: [],
      }, //Fin de newCategory
      newSale: new NewSaleView(),
    }, //Fin de views
    modals: {
      newSale: new NewSaleModal(),
      waiting: new WaitingModal(),
    },
    actualView: "newSale",
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
        if (name.length >= 4 && name.length <= 45) {
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
    /**
     * Lo que se debe hace cuando se le da a enviar el formulario
     */
    onNewCategorySubmit() {
      let view = this.views.newCategory;
      if (this.validateCategoryName() && !view.requestStart) {
        view.requestStart = true;
        view.buttomMessage = "Procesando solicitud";
        const data = new FormData();
        data.append("category_name", view.categoryName);

        fetch("./api/new_sale_category.php", {
          method: "POST",
          body: data,
        })
          .then((res) => res.json())
          .then((res) => {
            if (res.sessionActive) {
              if (res.request) {
                let categories = res.categories;
                let temporal = [];

                categories.forEach((data) => {
                  let category = new Category(
                    data.id,
                    data.name,
                    data.totalAmount,
                    data.averageSale
                  );
                  data.sales.forEach((dataSale) => {
                    category.addSale(
                      dataSale.id,
                      dataSale.date,
                      dataSale.description,
                      dataSale.amount
                    );
                  });

                  temporal.push(category);
                });

                this.categories = temporal;

                view.requestStart = false;
                view.buttomMessage = "Registrar categoría";
                view.response = true;
                view.responseMessage = "Proceso satisfactorio";
                view.responseMessageShow = true;
                view.categoryName = "";
              } else {
                view.response = false;
                view.responseMessage = "No se pudo agregar la categoría";
                view.responseMessageShow = true;
              }

              setTimeout(() => {
                responseMessage = "";
                view.responseMessageShow = false;
              }, 3000);
            } else {
              location.reload();
            }
          });
        // setTimeout(() => {
        //   let category = {
        //     id: this.categories.length + 1,
        //     name: view.categoryName,
        //     totalAmount: 0,
        //     averageSale: 0,
        //     sales: [],
        //   };

        //   this.categories.push(category);
        //   view.requestStart = false;
        //   view.buttomMessage = "Registrar categoría";
        //   view.response = true;
        //   view.responseMessage = "Proceso satisfactorio";
        //   view.responseMessageShow = true;
        //   setTimeout(() => {
        //     responseMessage = "";
        //     view.responseMessageShow = false;
        //   }, 3000);
        // }, 3000);
      } //Fin de if
    }, //Fin del metodo
    //----------------------------------------------------------
    //METODOS PARA CREAR UNA NUEVA VENTA
    //----------------------------------------------------------
    validateSaleDate() {
      let isOk = false;
      let date = this.views.newSale.saleDate;

      if (this.views.newSale.saleMoment === "now") {
        isOk = true;
      } else {
        if (moment(date.value).isValid()) {
          if (date.value <= this.views.newSale.maxDate) {
            date.isCorret();
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
      let categoryID = this.views.newSale.categoryID;
      let categoryExist = this.categories.some(
        (c) => c.id === categoryID.value
      );

      if (categoryExist) {
        categoryID.isCorret();
        isOk = true;
      } else {
        categoryID.isIncorrect("Selecciona una categoría valida");
      }

      return isOk;
    },
    validateSaleDescription() {
      let description = this.views.newSale.description;

      if (description.value) {
        if (description.value.length >= 5) {
          description.isCorret();
        } else {
          description.isIncorrect("Descripción demasiado corta");
        }
      } else {
        description.isIncorrect("Campo obligatorio");
      }

      return !description.hasError;
    },
    validateSaleAmount() {
      let amount = this.views.newSale.amount;

      //Elimino el formato de moneda y trato de convertir a numero
      let amountValue = parseFloat(this.deleteFormaterOfAmount(amount.value));

      if (!isNaN(amountValue)) {
        if (amountValue > 0) {
          amount.isCorret();
        } else {
          amount.isIncorrect("Debe ser mayor que cero (0)");
        }
      } else {
        amount.isIncorrect("Ingresa un valor valido");
      }

      return !amount.hasError;
    },
    validateNewSale() {
      let dateVal = this.validateSaleDate();
      let categoryVal = this.validateSaleCategory();
      let descriptionVal = this.validateSaleDescription();
      let amountVal = this.validateSaleAmount();

      if (dateVal && categoryVal && descriptionVal & amountVal) {
        let view = this.views.newSale;
        let date = moment().format("dddd LL");
        if (view.saleMoment !== "now") {
          date = moment(view.saleDate.value).format("dddd LL");
        }
        let description = view.description.value;
        let amount = view.amount.value;

        this.modals.newSale.showModal(date, description, amount);
      }
    },
    registerNewSale() {
      let view = this.views.newSale;
      let moment = view.saleMoment;
      let date = view.saleDate.value;
      let categoryID = view.categoryID.value;
      let description = view.description.value;
      let amount = parseFloat(this.deleteFormaterOfAmount(view.amount.value));

      const data = new FormData();
      data.append("moment", moment);
      data.append("date", date);
      data.append("category_id", categoryID);
      data.append("description", description);
      data.append("amount", amount);

      //Ahora oculto el modal de confirmacion y se muestra el de carga
      this.modals.newSale.hiddenModal();
      this.modals.waiting.showModal();

      //Se realiza la peticion al servidor
      fetch("./api/new_sale.php", {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
          if (res.sessionActive) {
            view.showAlert = true;
            if (res.request) {
              view.resetView();
              //Metodo que recargue las vantas
              view.alertMessage = "Proceso exitoso";
              view.processSuccess = true;
              this.updateModel();
            } else {
              view.alertMessage = res.message;
              view.processSuccess = false;
            }

            this.modals.waiting.hiddenModal();

            setTimeout(() => {
              view.showAlert = false;
              view.alertMessage = "";
              view.processSuccess = true;
            }, 3000);
          } else {
            location.reload();
          }
        });
    },
    //----------------------------------------------------------
    //MANEJO DE EVENTOS PERSONALIZADOS
    //----------------------------------------------------------
    onCategorySelected(category) {
      let view = this.views.newCategory;

      if (view.categorySelected) {
        view.categorySelected.selected = false;
        view.categorySelected = category;
        category.selected = true;
        view.categorySales = category.sales;
      } else {
        view.categorySelected = category;
        category.selected = true;
        view.categorySales = category.sales;
      }

    },
    //----------------------------------------------------------
    //UTILIDADES
    //----------------------------------------------------------
    formatCurrency(value) {
      var formatted = new Intl.NumberFormat("es-Co", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
      }).format(value);
      return formatted;
    }, //Fin del metodo
    deleteFormaterOfAmount(text) {
      let value = text.replace("$", "");
      value = value.split(".");
      value = value.join("");

      return value;
    },
    async updateModel() {
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

          //Se agregan a los arreglos principales
          this.categories = categoriesTemporal.sort(
            (c1, c2) => c2.totalAmount - c1.totalAmount
          );
          this.sales = salesTemporal;
          this.salesAmount = totalAmount;

          //Se actualizan las graficas
          this.updateBiweeklyChart();
        } else {
          location.reload();
        }
      } catch (error) {
        console.log(error);
      }
    },
    showView(viewName) {
      if (this.actualView != viewName) {
        //En primer lugar oculto todas las vistas
        for (const key in this.views) {
          if (this.views.hasOwnProperty(key)) {
            const view = this.views[key];
            view.visible = false;
          }
        } //Fin de for in

        switch (viewName) {
          case "newCategory":
            {
              this.views.newCategory.visible = true;
              this.actualView = viewName;
              showMenu(document.getElementById("navbar-collapse"));
            }
            break;
          case "newSale":
            {
              this.views.newSale.visible = true;
              this.actualView = viewName;
              showMenu(document.getElementById("navbar-collapse"));
            }
            break;
          default:
            {
              this.views.newSale.visible = true;
              this.actualView = "newSale";
            }
            break;
        } //Fin de swith
      } //Fin de if
    }, //Fin del metoo
    createBarChart(ctx, data, title, money = false) {
      let displayTitle = typeof title === 'string' && title.length > 0;
      let myBar = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
          responsive: true,
          legend: {
            position: 'top',
          },//Fin de legend
          title: {
            display: displayTitle,
            text: title
          },//Fin de title
          tooltips: {
            callbacks: {
              label: (tooltipItem, data) => {
                let label = data.datasets[tooltipItem.datasetIndex].label || '';

                if (label) {
                  label += ': ';

                  if (money) {
                    label += this.formatCurrency(tooltipItem.yLabel);
                  } else {
                    label += tooltipItem.yLabel;
                  }
                  return label;
                }//Fin de if

              }//Fin de ()=>{}
            },//Fin de callbacks
          }, //Fin de tooltips
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true,
                callback: (value, index, values) => {
                  if (money) {
                    return this.formatCurrency(value);
                  } else {
                    return value;
                  }//Fin de if-else
                }//Fin de callback
              }//Fin de ticks
            }],//Fin de yAxes
          },//Fin de scales
        }, //Fin de options
      })//Fin del constructor

      return myBar;
    },
    updateBiweeklyChart() {
      if(this.views.biweeklyChart){
        let datasets = [this.lastWeekDataset, this.thisWeekDataset];
        this.views.newSale.biweeklyChart.data.datasets = datasets;
        this.views.newSale.biweeklyChart.update();

      }else{
        let ctx = document.getElementById('biweeklyChart');
        let labels = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];
        let datasets = [this.lastWeekDataset, this.thisWeekDataset];
        let barCharData = {
          labels,
          datasets
        }
        this.views.newSale.biweeklyChart = this.createBarChart(ctx, barCharData, '', true);
      }

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

    newSaleDescriptionLength() {
      let length = this.views.newSale.description.value.length;
      const maxLength = 45;
      let availableLength = maxLength - length;

      return availableLength;
    },
    biweeklyReports() {
      let thisWeekStart = moment().startOf('week').startOf('day');
      let thisWeekEnd = moment().endOf('week').endOf('days');
      let lasWeekStart = moment(thisWeekStart).subtract(7, 'days');
      let lasWeekEnd = moment(thisWeekEnd).subtract(7, 'days');
      let saleOfThisWeek = [];
      let salesOfLastWeek = [];
      let lastWeekReport = undefined;
      let thisWeekReport = undefined;

      //En primer lugar procedo a recuperar las ventas de la ultimas dos semanas
      for (let index = 0; index < this.sales.length; index++) {
        const sale = this.sales[index];
        if (sale.saleDate.isSameOrBefore(thisWeekEnd) && sale.saleDate.isSameOrAfter(thisWeekStart)) {
          saleOfThisWeek.push(sale);
        } else if (sale.saleDate.isSameOrBefore(lasWeekEnd) && sale.saleDate.isSameOrAfter(lasWeekStart)) {
          salesOfLastWeek.push(sale);
        } else {
          break;
        }
      }//Fin de for

      //Ahora se crean los dos reportes
      lastWeekReport = new WeeklyReport(1, salesOfLastWeek, lasWeekStart, lasWeekEnd);
      lastWeekReport.calculateStatistics();
      thisWeekReport = new WeeklyReport(2, saleOfThisWeek, thisWeekStart, thisWeekEnd);
      thisWeekReport.calculateStatistics();


      return { lastWeekReport, thisWeekReport, thisWeekStart };
    },
    thisWeekDataset() {
      let report = this.biweeklyReports;
      let data = [];
      report.thisWeekReport.dailyReports.forEach(r => {
        data.push(r.amount);
      });

      return {
        label: "Esta Semana",
        backgroundColor: color(chartColors.green).alpha(0.5).rgbString(),
        borderColor: chartColors.green,
        borderWidth: 1,
        data: data
      }
    },
    lastWeekDataset() {
      let report = this.biweeklyReports;
      let data = [];
      report.lastWeekReport.dailyReports.forEach(r => {
        data.push(r.amount);
      });

      return {
        label: "Semana Pasada",
        backgroundColor: color(chartColors.orange).alpha(0.5).rgbString(),
        borderColor: chartColors.orange,
        borderWidth: 1,
        data: data
      }
    }
  }, //Fin de computed
  created() {
    moment.locale("es-do");
    this.updateModel();
  },
});
