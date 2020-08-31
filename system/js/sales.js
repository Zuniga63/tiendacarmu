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
  red: "rgb(255, 99, 132)",
  orange: "rgb(255, 159, 64)",
  yellow: "rgb(255, 205, 86)",
  green: "rgb(75, 192, 192)",
  blue: "rgb(54, 162, 235)",
  purple: "rgb(153, 102, 255)",
  grey: "rgb(201, 203, 207)",
};

class RequesProcess {
  constructor() {
    this.visible = false;
    this.hasError = false;
    this.message = "";
  }

  isSuccess(message) {
    this.visible = true;
    this.hasError = false;
    this.message = message;
  }

  isDanger(message) {
    this.visible = true;
    this.hasError = true;
    this.message = message;
  }
}

class DataInput {
  constructor(value = "", hasError = false, message = "") {
    this.value = value;
    this.hasError = hasError;
    this.message = message;
  }

  isCorrect(message = "") {
    this.hasError = false;
    this.message = message;
  }

  isIncorrect(message = "") {
    this.hasError = true;
    this.message = message;
  }

  resetInput() {
    this.value = "";
    this.isCorrect("");
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
    this.formData = undefined;
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

Vue.component("confirm-new-sale", {
  data(){
    return{
      title: "Registrar Venta",
    }
  },
  computed:{
    ...Vuex.mapState(['confirmSaleModal', 'categories']),
    date(){
      let value = "";
      if(this.confirmSaleModal.formData){
        value = this.confirmSaleModal.formData.get('date');
        if(value){
          value = moment(value).format('ll');
        }else{
          value = moment().format('lll');
        }
      }
      return value;
    },
    description(){
      let value = "";
      if(this.confirmSaleModal.formData){
        value = this.confirmSaleModal.formData.get('description');
      }
      return value;
    },
    category(){
      let value = "";
      if(this.confirmSaleModal.formData){
        value = this.confirmSaleModal.formData.get('category_id');
        value = parseInt(value);
        value = this.categories.filter(c => c.id === value);
        value = value[0].name;
      }
      return value;
    },
    amount(){
      let value = "";
      if(this.confirmSaleModal.formData){
        value = this.confirmSaleModal.formData.get('amount');
        value = parseFloat(value);
        value = formatCurrencyLite(value, 0);
      }
      return value;
    }

  },
  methods:{
    ...Vuex.mapMutations(['hiddenConfirmSaleModal']),
    ...Vuex.mapActions(['addNewSale']),
    onClick(){
      this.addNewSale(this.confirmSaleModal.formData);
      this.hiddenConfirmSaleModal();
    }
  },
  template: /*template*/`
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
  `
})

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
      if(categoryNameIsOk){
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
    resetFields(){
      this.categoryName.resetInput();
    }
  },
  mounted(){
    this.eventHub.$on("category-was-created", this.resetFields);
  },
  template: /*html*/`
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
  props: ["subtitle", "id"],
  data(){
    return{
      periods: [
        {id: 0, value: "thisMonth", name: "Este mes"},
        {id: 1, value: "thisBiweekly", name: "Esta quincena"},
        {id: 2, value: "thisWeek", name: "Esta semana"},
        {id: 3, value: "thisYear", name: "Este año"},
        {id: 4, value: "fromTheOriginOfTheTime", name: "Desde el origen de los tiempos"},
      ],
      period: "thisMonth",

    }
  },
  computed:{
    ...Vuex.mapState(['sales']),
    salesList(){
      let list = [];
      let start, end;
      switch (this.period) {
        case "thisMonth":
          start = moment().startOf('month');
          end = moment().endOf('month');
          list = this.getSales(start, end);
          break;
        case "thisWeek":
          start = moment().startOf('week');
          end = moment().endOf('week');
          list = this.getSales(start, end);
          break;
        case "thisYear":
          start = moment().startOf('year');
          end = moment().endOf('year');
          list = this.getSales(start, end);
          break;
        case "thisBiweekly":
          let now = moment();
          let year = now.year();
          let month = now.month();
          let dayOfMonth = now.date();
          if(dayOfMonth > 15){
            start = moment([year, month, 16]);
            end = moment().endOf('month');
          }else{
            start = moment().startOf('month');
            end = moment([year, month, 15]).endOf('day');
          }
          console.log(start.format('ll'));
          list = this.getSales(start, end);
          break;
        default:
          list = this.sales;
          break;
      }//Fin de swith

      return list;
    },
    saleListAmount(){
      let amount = 0;
      this.salesList.forEach(sale => {
        amount += sale.amount;
      });

      return amount;
    }
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
    getSales(since, until){
      let list = [];
      for (let index = 0; index < this.sales.length; index++) {
        const sale = this.sales[index];
        if(sale.saleDate.isSameOrAfter(since) && sale.saleDate.isSameOrBefore(until)){
          list.push(sale);
        }
      }
      return list;
    }
  },
  template: 
  /*html*/`
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
      <p class="history__info">Ventas: <span class="text-bold">{{salesList.length}}</span></p>
    </footer>
  </div>
  `,
  
});

Vue.component("new-sale-form", {
  props:['id'],
  data(){
    return{
      saleMoment: "now",
      saleDate: new DataInput(),
      maxDate: moment().format("yyyy-MM-DD"),
      categoryID: new DataInput(),
      description: new DataInput(),
      amount: new DataInput(),
    }
  },
  computed:{
    ...Vuex.mapState(['categories', 'eventHub']),
    newSaleDescriptionLength() {
      let length = this.description.value.length;
      const maxLength = 45;
      let availableLength = maxLength - length;

      return availableLength;
    },
  },
  methods:{
    ...Vuex.mapMutations(['showConfirmSaleModal']),
    onSubmit(){
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
    validateSaleDate(){
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
    validateSaleCategory(){
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
    validateSaleDescription(){
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
    validateSaleAmount(){
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
    resetFields(){
      this.saleMoment = "now";
      this.saleDate.resetInput();
      this.categoryID.resetInput();
      this.description.resetInput();
      this.amount.resetInput();
    }
  },
  mounted(){
    this.eventHub.$on('sale-was-created', this.resetFields);
  },
  template:
  /*html*/`
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
  `
})

const store = new Vuex.Store({
  state: {
    categories: [],
    sales: [],
    waiting: false,
    waitingMessage: "Procesando solicitud",
    confirmSaleModal: new NewSaleModal(),
    processResult: new RequesProcess(),
    eventHub: new Vue(),
  },
  getters: {},
  mutations: {
    showWaitingRequest(state, message) {
      state.waiting = true;
      state.waitingMessage = message;
    },
    hiddenWaitingRequest(state) {
      state.waiting = false;
      state.waitingMessage = "";
    },
    showConfirmSaleModal(state, payload){
      state.confirmSaleModal.visible = true;
      state.confirmSaleModal.formData = payload;
    },
    hiddenConfirmSaleModal(state){
      state.confirmSaleModal.visible = false;
      state.confirmSaleModal.formData = undefined;
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
    async getModel({ commit }) {
      commit("showWaitingRequest", "Descargando datos, espera un momento!");
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
            await dispatch("getModel");
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
    async addNewSale({commit, dispatch}, formData){
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

        if(data.sessionActive){
          commit("hiddenWaitingRequest");
          if(data.request){
            await dispatch("getModel");
            message = "¡Venta creada con exito!";
            isSuccess = true;
            commit("emitEvent", eventName);
          }else{
            message = "¡No se pudo registrar la venta!";
          }
        }else{
          location.reload();
        }
      } catch (error) {
        commit("hiddenWaitingRequest");
        message = "Error en la petición";
      }
      commit("requestResult", { isSuccess, message });
    },
  },
});

const vm = new Vue({
  el: "#app",
  store,
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
    ...Vuex.mapActions(["getModel"]),
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
      let categoryID = this.views.newSale.categoryID;
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
      let description = this.views.newSale.description;

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
      let amount = this.views.newSale.amount;

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
      let displayTitle = typeof title === "string" && title.length > 0;
      let myBar = new Chart(ctx, {
        type: "bar",
        data: data,
        options: {
          responsive: true,
          legend: {
            position: "top",
          }, //Fin de legend
          title: {
            display: displayTitle,
            text: title,
          }, //Fin de title
          tooltips: {
            callbacks: {
              label: (tooltipItem, data) => {
                let label = data.datasets[tooltipItem.datasetIndex].label || "";

                if (label) {
                  label += ": ";

                  if (money) {
                    label += this.formatCurrency(tooltipItem.yLabel);
                  } else {
                    label += tooltipItem.yLabel;
                  }
                  return label;
                } //Fin de if
              }, //Fin de ()=>{}
            }, //Fin de callbacks
          }, //Fin de tooltips
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  callback: (value, index, values) => {
                    if (money) {
                      return this.formatCurrency(value);
                    } else {
                      return value;
                    } //Fin de if-else
                  }, //Fin de callback
                }, //Fin de ticks
              },
            ], //Fin de yAxes
          }, //Fin de scales
        }, //Fin de options
      }); //Fin del constructor

      return myBar;
    },
    updateBiweeklyChart() {
      if (this.views.biweeklyChart) {
        let datasets = [this.lastWeekDataset, this.thisWeekDataset];
        this.views.newSale.biweeklyChart.data.datasets = datasets;
        this.views.newSale.biweeklyChart.update();
      } else {
        let ctx = document.getElementById("biweeklyChart");
        let labels = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];
        let datasets = [this.lastWeekDataset, this.thisWeekDataset];
        let barCharData = {
          labels,
          datasets,
        };
        this.views.newSale.biweeklyChart = this.createBarChart(
          ctx,
          barCharData,
          "",
          true
        );
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
      let thisWeekStart = moment().startOf("week").startOf("day");
      let thisWeekEnd = moment().endOf("week").endOf("days");
      let lasWeekStart = moment(thisWeekStart).subtract(7, "days");
      let lasWeekEnd = moment(thisWeekEnd).subtract(7, "days");
      let saleOfThisWeek = [];
      let salesOfLastWeek = [];
      let lastWeekReport = undefined;
      let thisWeekReport = undefined;

      //En primer lugar procedo a recuperar las ventas de la ultimas dos semanas
      for (let index = 0; index < this.sales.length; index++) {
        const sale = this.sales[index];
        if (
          sale.saleDate.isSameOrBefore(thisWeekEnd) &&
          sale.saleDate.isSameOrAfter(thisWeekStart)
        ) {
          saleOfThisWeek.push(sale);
        } else if (
          sale.saleDate.isSameOrBefore(lasWeekEnd) &&
          sale.saleDate.isSameOrAfter(lasWeekStart)
        ) {
          salesOfLastWeek.push(sale);
        } else {
          break;
        }
      } //Fin de for

      //Ahora se crean los dos reportes
      lastWeekReport = new WeeklyReport(
        1,
        salesOfLastWeek,
        lasWeekStart,
        lasWeekEnd
      );
      lastWeekReport.calculateStatistics();
      thisWeekReport = new WeeklyReport(
        2,
        saleOfThisWeek,
        thisWeekStart,
        thisWeekEnd
      );
      thisWeekReport.calculateStatistics();

      return { lastWeekReport, thisWeekReport, thisWeekStart };
    },
    thisWeekDataset() {
      let report = this.biweeklyReports;
      let data = [];
      report.thisWeekReport.dailyReports.forEach((r) => {
        data.push(r.amount);
      });

      return {
        label: "Esta Semana",
        backgroundColor: color(chartColors.green).alpha(0.5).rgbString(),
        borderColor: chartColors.green,
        borderWidth: 1,
        data: data,
      };
    },
    lastWeekDataset() {
      let report = this.biweeklyReports;
      let data = [];
      report.lastWeekReport.dailyReports.forEach((r) => {
        data.push(r.amount);
      });

      return {
        label: "Semana Pasada",
        backgroundColor: color(chartColors.orange).alpha(0.5).rgbString(),
        borderColor: chartColors.orange,
        borderWidth: 1,
        data: data,
      };
    },
  }, //Fin de computed
  created() {
    moment.locale("es-do");
    this.updateModel();
    this.getModel();
  },
});
