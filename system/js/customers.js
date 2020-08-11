window.addEventListener('load', () => {
  //Se configura la librería de moment
  moment.locale('es-do');
  moment().format('DD/MM/YYYY hh:mm a');
  document.getElementById("preload").classList.remove("show");
})
//--------------------------------------------------------------------------
//	INTANCIAS DE VUE Y COMPONENTES
//--------------------------------------------------------------------------

//---------------------------------------------
//  CLASES
//---------------------------------------------
/**
 * Utilizado para agrupar las propiedades de un campo que debe ser validado
 */
class DataInput {
  /**
   * @constructor
   * @param {*} value Valor del campo
   * @param {bool} hasError Si el campo tiene algun error
   * @param {string} message El mensaje a mostar producto de la validacion
   */
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

class RequesProcess {
  constructor() {
    this.visible = false;
    this.hasError = false;
    this.message = '';
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

class Customer {
	/**
	 * @constructor
	 * @param {number} id El identificador del cliente
	 * @param {string} firstName Nombres del cliente
	 * @param {string} lastName Apellido del cliente
	 * @param {string} nit Cedula de ciudadanía o DNI
	 * @param {string} phone Numero de telefono celular
	 * @param {string} email Correo electronico
	 * @param {number} points Puntos de fiabilidad del cliente
	 */
  constructor(id = 0, firstName, lastName = '', nit = '', phone = '', email = '', points = 0, archived = false) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.nit = nit;
    this.phone = phone;
    this.email = email;
    this.points = points;
    this.credits = [];
    this.payments = [];
    this.balance = 0;
    this.state = '';
    this.inactive = false;
    this.archived = archived;
    this.deliquentBalance = false;
    this.paymentFrecuency = 0;
  }

	/**
	 * Este metodo crea una instancia de Credito y lo agrega al arreglo de creditos,
	 * tambien aumenta el saldo del cliente
	 * @param {number} id Identificador del credito
	 * @param {string} creditDate La fecha del credito en formato fecha
	 * @param {string} description La descripcion del credito
	 * @param {number} amount Es el monto del credito
	 * @param {number} balance Es saldo del credito actual
	 */
  addCredit(id, creditDate, description, amount, balance) {
    let credit = new Credit(id, creditDate, description, amount, balance);
    this.credits.push(credit);
    this.balance += amount;
  }

	/**
	 * Este metodo crea una instancia de Abono y lo agrega al arreglo de pagos,
	 * tambien modifica el saldo del cliente disminuyendolo.
	 * @param {number} id Identifcado de abono
	 * @param {string} paymentDate Es la fecha del abono en formato texto
	 * @param {float} amount Es el importe total del cliente
	 * @param {bool} cash Si el pago fue en efectivo
	 */
  addPayment(id, paymentDate, amount, cash) {
    let payment = new Payment(id, paymentDate, amount, cash);
    this.payments.push(payment);
    this.balance -= amount;
  }

	/**
	 * Este metodo modifica los datos del cliente que por lo general sucede al hacer un abono,
	 * un pago o se actualiza la tarjeta del cliente.
	 * @param {JSON} customerData El el objeto devuelto cuando se modifican datos de un solo cliente 
	 */
  update(customerData) {
    this.credits = [];
    this.payments = [];
    this.balance = 0;

    //Actualizo los datos basicos
    this.id = customerData.id;
    this.firstName = customerData.firstName;
    this.lastName = customerData.lastName;
    this.nit = customerData.nit;
    this.phone = customerData.phone;
    this.email = customerData.email;
    this.points = customerData.points;

    //Agrego los creditos y los abonos
    customerData.credits.forEach(credit => {
      this.addCredit(credit.id, credit.creditDate, credit.description, credit.amount, credit.balance);
    })

    customerData.payments.forEach(payment => {
      this.addPayment(payment.id, payment.paymentDate, payment.amount, payment.cash);
    })

    //Se actualiza el estado del cliente
    this.defineState();
  }

	/**
	 * Define si el cliente tiene saldo en mora o si esta inactivo y escribe un estado para
	 * mostrar en patalla basandose en el hsitorial de pago y de credito
	 */
  defineState() {
    //Se resetean las propiedades criticas
    this.inactive = false;
    this.deliquentBalance = false;
    this.state = '';

    //Se inicializan las variables temporales
    let lastDate = '';
    let lastDateIsAPayment = false;
    let balance = 0;

    //Si el cliente no tiene creditos automaticamente se define como inactivo
    if (this.credits.length > 0) {
      //La fecha de partida es la fecha del primer credito
      lastDate = this.credits[0].date;

      //Se inicializan los indices para recorrer las listas
      let indexCredit = 0;
      let indexPayment = 0;

      do {
        //Se recupera el credito y el abono del indice actual
        let credit = indexCredit < this.credits.length
          ? this.credits[indexCredit]
          : null;

        let payment = indexPayment < this.payments.length
          ? this.payments[indexPayment]
          : null;

				/**
				 * Con las siguientes instrucciones se va actualizando la lastDate
				 * y segun sea el saldo se va defininiendo si esa fecha es de un pago o
				 * de un credito para tenerlo en cuenta al escribir el estado
				 */
        if (credit && payment) {
          if (credit.date <= payment.date) {
            if (balance === 0) {
              lastDate = credit.date;
              lastDateIsAPayment = false;
            }//Fin de if

            balance += credit.amount;
            indexCredit++;
          } else {
            //Se va actualizando la frecuencia de pago
            this.paymentFrecuency += moment(payment.date).diff(moment(lastDate), 'days');
            lastDate = payment.date;
            lastDateIsAPayment = true;
            balance -= payment.amount;
            indexPayment++;
          }//Fin de if else
        } else {
          if (credit) {
            if (balance === 0) {
              lastDate = credit.date;
              lastDateIsAPayment = false;
            }//Fin de if

            balance += credit.amount;
            indexCredit++;
          } else {
            this.paymentFrecuency += moment(payment.date).diff(moment(lastDate), 'days');
            lastDate = payment.date;
            lastDateIsAPayment = true;
            balance -= payment.amount;
            indexPayment++;
          }
        }//Fin de if-else

        //El proceso debe terminar cuando no hayan mas creditos o abonos
      } while (indexCredit < this.credits.length || indexPayment < this.payments.length);

      //Se utiliza la librería moment.js para convertir la fecha y poder manipularla
      lastDate = moment(lastDate);

      if (balance > 0) {
        //Se recupera la hora actual para poder definir si está en mora
        let now = moment();
        //Todos los clientes con saldo están activos
        this.inactive = false;

        //Sdependiendo de esta variable se cambia la legenda del estado
        if (lastDateIsAPayment) {
          this.state = `Ultimo abono ${lastDate.fromNow()}`;
        } else {
          this.state = `Con un saldo ${lastDate.fromNow()}`;
        }

        //Se define si el cliente está en mora
        let diff = now.diff(moment(lastDate), 'days');
        if (diff > 30) {
          this.deliquentBalance = true;
        }

        this.paymentFrecuency += diff;
        if (this.payments.length > 0) {
          this.paymentFrecuency = this.paymentFrecuency / (this.payments.length + 1);
        }
      } else {
        this.inactive = true;
        this.state = `Ultima operacion ${lastDate.fromNow()}`;
        this.deliquentBalance = false;
        if (this.payments.length > 0) {
          this.paymentFrecuency = this.paymentFrecuency / this.payments.length;
        }
      }

    } else {
      this.inactive = true;
      this.deliquentBalance = false;
      this.state = 'Desde el origen de los tiempos';
    }//Fin de if else

    this.setScore();

  }//Fin del metodo

  setScore() {
    const utility = 0.1;
    let iea = utility * (55.0 / 20.0);
    let iep = Math.pow((1 + iea), (1 / 365)) - 1;
    let creditVpn = 0;
    let paymentVpn = 0;
    let now = moment();

    if (this.credits.length > 0) {
      //Se calcula el vpn de los creditos
      this.credits.forEach(credit => {
        let capital = credit.amount / (1 + utility);
        let days = now.diff(moment(credit.date), 'days');
        creditVpn += capital * Math.pow((1 + iep), days);
      });

      //Se calcula el vpn de los pagos
      this.payments.forEach(payment => {
        let days = now.diff(moment(payment.date), 'days');
        paymentVpn += payment.amount * Math.pow((1 + iep), days);
      })
    }

    this.points = Math.round((this.balance + paymentVpn - creditVpn) / 1000);
  }

  toString() {
    return this.firstName;
  }
}

/**
 * Una super clase para los creditos y abonos
 */
class Transaction {
	/**
	 * @constructor
	 * @param {number} id Es el identificador de la transaccion
	 * @param {string} transactionDate La fecha de la transaccion en texto
	 * @param {number} amount El valor de la transaccion
	 */
  constructor(id, transactionDate, amount) {
    this.id = id;
    this.date = transactionDate;
    this.amount = amount;
  }
}

/**
 * Es un credito que un cliente contrae con la empresa
 */
class Credit extends Transaction {
	/**
	 * @constructor
	 * @param {number} id Identificador unico
	 * @param {string} creditDate Fecha del credito en texto
	 * @param {string} description Descripcion del credito
	 * @param {number} amount Es el valor del credito
	 * @param {number} balance Es el saldo pendiente de este credito
	 */
  constructor(id, creditDate, description, amount, balance) {
    super(id, creditDate, amount);
    this.balance = balance;
    this.description = description;
  }
}

/**
 * Un abono por parte del cliente
 */
class Payment extends Transaction {
	/**
	 * @constructor
	 * @param {number} id Indentificador unico del pago
	 * @param {string} paymentDate Fecha del abono en formato texto
	 * @param {number} amount Valor del abono realizado
	 * @param {bool} cash Si el pago se realizó en efectivo
	 */
  constructor(id, paymentDate, amount, cash) {
    super(id, paymentDate, amount);
    this.cash = cash;
  }
}
//---------------------------------------------
//  COMPONENTES
//---------------------------------------------
/**
 * Componente reutilizable para notoficarle al usuario
 * que la peticion fue enviada al servidor y se está esperando
 * una respuestas. Requiere que se le pasa la propiedad visible
 */
Vue.component('waiting-modal', {
  props: ['visible'],
  template: `
  <div :class="['modal', {show:visible}]">
    <div class="modal__content" style="padding-top: 140px;">
      <div class="loader"></div>
        <p class="modal__info" style="text-align: center;">Procesando Solicitud</p>
      </div>
    </div>
  </div>    `
})

/**
 * Componente reutilizable para notificar al usuario el 
 * resultado de la peticion al servidor. Requiere un objeto
 * process-result con los resultados de la peiicion.
 * Este componente emite un evento hidden-modal para que el estado visible
 * pueda ser cambiado desde la raiz
 */
Vue.component('process-result', {
  props: ['processResult'],
  template: `
  <div
    class="modal"
    :class="{show: processResult.visible}"
    @click.self="$emit('hidden-modal')"
  >
    <div class="modal__content">
      <div class="modal__close" @click="$emit('hidden-modal')">
        <i class="fas fa-times-circle"></i>
      </div>

      <div class="modal__icon">
        <img :src="'../icon/'+ (processResult.hasError ? 'error' : 'success') +'.svg'" class="modal__icon__img">
        <p class="modal__icon__caption">{{processResult.message}}</p>
      </div>

    </div>
  </div>
  `
})

/**
 * Componente no reutilizable de momento con la vista 
 * para agregar nuevos clientes o actualizar los datos
 */
Vue.component('customer-register', {
  props: ['customers', 'id'],
  data: function () {
    return {
      customerSelected: undefined,
      updatingCustomer: false,
      typeList: "active",
      waiting: false,
      processResult: { visible: false, hasError: false, message: '' },
      //los campos para el formulario
      firstName: new DataInput(),
      lastName: new DataInput(),
      nit: new DataInput(),
      phone: new DataInput(),
      email: new DataInput(),
    }
  },
  computed: {
    inactiveCustomers() {
      const result = this.customers.filter(c => c.inactive && !c.archived);
      return result;
    },
    activeCustomers() {
      const result = this.customers.filter(c => !c.inactive && !c.archived);
      return result;
    },
    archivedCustomers() {
      const result = this.customers.filter(c => c.archived);
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
    }
  },
  methods: {
    validateFirstName() {
      let firstName = this.firstName;
      if (firstName.value && typeof firstName.value === 'string') {
        firstName.isCorrect();
        return true;
      } else {
        firstName.isIncorrect("Este campo es obligatorio");
      }

      return false;
    },
    validateNit() {
      let nit = this.nit;
      if (nit.value && typeof nit.value === 'string') {
        let isAssigned = false;
        if (this.updatingCustomer) {
          isAssigned = this.customers.some(c => c.nit === nit.value && c.id !== this.customerSelected.id);
        } else {
          isAssigned = this.customers.some(c => c.nit === nit.value);
        }

        if (isAssigned) {
          nit.isIncorrect('Esta identificación ya fue asignada')
          return false;
        } else {
          nit.isCorrect()
        }
      } else {
        nit.isCorrect();
      }

      return true;
    },
    validatePhone() {
      let phone = this.phone;
      if (phone.value && typeof phone.value === 'string') {
        let isAssigned = false;
        if (this.updatingCustomer) {
          isAssigned = this.customers.some(c => c.phone === phone.value && c.id !== this.customerSelected.id);
        } else {
          isAssigned = this.customers.some(c => c.phone === phone.value);
        }

        if (isAssigned) {
          phone.isIncorrect('Este número ya fue asignado');
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
      if (email.value && typeof email.value === 'string') {
        console.log(email.value)
        if (/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<ul>()[\]\.,;:\s@\"]{2,})$/i.test(email.value)) {
          let isAssigned = false;

          if (this.updatingCustomer) {
            isAssigned = this.customers.some(c => c.email === email.value && c.id !== this.customerSelected.id);
          } else {
            isAssigned = this.customers.some(c => c.email === email.value);
          }

          if (isAssigned) {
            email.isIncorrect('Esta dirección de correo ya fue asignada');
            return false;
          } else {
            email.isCorrect();
          }
        } else {
          email.isIncorrect('Ingresa una dirección de correo valida');
          return false;
        }
      } else {
        email.isCorrect();
      }

      return true;
    },
    async onSubmit() {
      let firstNameVal = this.validateFirstName();
      let nitVal = this.validateNit();
      let phoneVal = this.validatePhone();
      let emailVal = this.validateEmail();

      if (firstNameVal && nitVal && phoneVal && emailVal) {
        const body = new FormData();
        body.append('first_name', this.firstName.value);
        body.append('last_name', this.lastName.value);
        body.append('nit', this.nit.value);
        body.append('phone', this.phone.value);
        body.append('email', this.email.value);
        this.waiting = true;

        if (this.updatingCustomer) {
          body.append('customer_id', this.customerSelected.id);
          try {
            const res = await fetch('./api/update_customer.php', {
              method: 'POST',
              body: body,
            });
            const data = await res.json();

            if (data.sessionActive) {
              if (data.request) {
                this.waiting = false;
                this.processResult.visible = true;
                this.processResult.hasError = false;
                this.processResult.message = "Cliente actualizado";

                this.$emit('update-customer', data.customer);
                this.discardUpdate();
              } else {
                this.waiting = false;
                this.processResult.visible = true;
                this.processResult.hasError = true;
                this.processResult.message = "No se pudo actualizar";
              }
            } else {
              location.reload();
            }
          } catch (error) {
            console.log(res.text);
            this.waiting = false;
            this.processResult.visible = true;
            this.processResult.hasError = true;
            this.processResult.message = "Solicitud Rechazada";
          }
        } else {
          try {
            const res = await fetch('./api/new_customer.php', {
              method: 'POST',
              body: body
            })

            const data = await res.json();

            if (data.sessionActive) {
              if (data.request) {
                let actualCount = this.customers.length;
                this.$emit('new-customer');
                let timerId = setInterval(() => {
                  if (actualCount < this.customers.length) {
                    this.waiting = false;
                    this.processResult.visible = true;
                    this.processResult.hasError = false;
                    this.processResult.message = "Cliente Agregado satisfactoriamente";
                    this.resetForm();
                    clearInterval(timerId);
                  }
                  console.log('Repitiendo: ' + actualCount)
                }, 1000);


              } else {
                this.processResult.visible = true;
                this.processResult.hasError = true;
                this.processResult.message = "No se pudo crear al cliente";
              }
            } else {
              location.reload();
            }

          } catch (error) {
            console.log(res.text);
            this.waiting = false;
            this.processResult.visible = true;
            this.processResult.hasError = true;
            this.processResult.message = "Solicitud Rechazada";
          }
        }//Fin de if-else
      }//Fin de if
    },//Fin del metodo
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
  },//Fin de methods
  template: `
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
      <div class="history__header">
        <h2 class="history__title">Listado de clientes</h2>
      </div>
      <div class="history__head">
        <table class="table">
          <thead>
            <tr class="table__row-header">
              <th class="table__header table--25">Nombres</th>
              <th class="table__header table--25">Apellidos</th>
              <th class="table__header table--25">Telefono</th>
              <th class="table__header table--25">Archivado</th>
            </tr>
          </thead>
        </table>
      </div>
      <div class="history__body scroll">
        <table class="table">
          <tbody class="table__body">
            <template v-for="customer in customers">
              <tr class="table__row" :class="{selected: customerSelected && customerSelected.id === customer.id}" :key="customer.id"  @click="loadCustomer(customer)">
                <td class="table__data table--25">{{customer.firstName}}</td>
                <td class="table__data table--25">{{customer.lastName}}</td>
                <td class="table__data table--25 text-center">{{customer.phone}}</td>
                <td class="table__data table--25 text-center" @click.stop="">
                  <input type="checkbox" name="" id="" style="zoom: 2;" />
                </td>
              </tr>
            </template v-for="customer">
          </tbody>
        </table>
      </div>
      <div class="history__footer">
        <p class="history__info">Activos: <span class="text-bold">{{activeCustomers.length}}</span></p>
        <p class="history__info">Inactivos: <span class="text-bold">{{inactiveCustomers.length}}</span></p>
        <p class="history__info">Archivados: <span class="text-bold">{{archivedCustomers.length}}</span></p>
        <p class="history__info">Total: <span class="text-bold">{{customers.length}}</span></p>
      </div>
    </aside>  
    <waiting-modal v-bind:visible="waiting"></waiting-modal>
    <process-result v-bind:process-result="processResult" @hidden-modal="processResult.visible = false"></process-result>
  </div>
	`,

})

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

Vue.component('customer-card', {
  props: ['customer'],
  methods: {
    formatCurrency(value) {
      var formatted = new Intl.NumberFormat("es-Co", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
      }).format(value);
      return formatted;
    }, //Fin del metodo,
  },
  computed: {
    classState() {
      if (this.customer.inactive) {
        return { 'customer-card--inactive': true };
      } else if (this.customer.deliquentBalance) {
        return { 'customer-card--late': true };
      }

      return { success: false };
    },
    fullName() {
      return this.customer.firstName + ' ' + this.customer.lastName;
    }
  },
  template: `
  <div class="customer-card" :class="classState" v-if="customer" @click="$emit('click')">
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
  </div>`
})

Vue.component('search-box', {
  props: ['customers'],
  data: function () {
    return {
      customerSelected: undefined,
      showBox: false,
      customerName: '',
    }
  },//Fin de data
  methods: {
    onCustomerSelected(customer) {
      this.customerSelected = customer;
      this.$emit('customer-selected', customer);
    }
  },//Fin de methods
  computed: {
    customerResult() {
      let result = [];
      if (this.customerName) {
        result = this.customers.filter(c => textInclude(`${c.firstName} ${c.lastName}`, this.customerName));
      } else {
        result = this.customers;
      }
      return result;
    }
  },
  template: `
  <div class="search-box">
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
      <p class="search-box__count" :class="{show: showBox}">Clientes: <span class="text-bold">{{customerResult.length}}</span></p>
    </div>
    <div class="search-box__selected" v-show="customerSelected">
      <customer-card :customer="customerSelected"></customer-card>
    </div>
  </div>`
})

Vue.component('new-operation-form', {
  props: ['customer', 'id'],
  data: function () {
    return {
      operationType: 'payment',
      operationMoment: 'now',
      maxDate: moment().subtract(1, 'd').format('YYYY-MM-DD'),
      date: new DataInput(),
      description: new DataInput(),
      paymentType: 'cash',
      amount: new DataInput(),
      exceedsTheQuota: false,
    }
  },//Fin de data
  methods: {
    validateDate() {
      let isOk = false;
      let value = this.date.value;
      let message = ';'
      if (this.operationMoment !== 'now') {
        if (value && typeof value === 'string') {
          if (moment(value).isValid()) {
            let date = moment(value);
            if (date.isAfter(this.minDate) && date.isBefore(moment().startOf('day'))) {
              isOk = true;
            } else {
              message = "Está fecha no está permitida";
            }
          } else {
            message = 'Ingresa una fecha valida';
          }
        } else {
          message = "Selecciona o escribe una fecha valida";
        }
      } else {
        isOk = true;
        message = '';
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
            this.description.isIncorrect('Descripción demasiado larga');
          }
        } else {
          this.description.isIncorrect('Este campo no puede estar en blanco');
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
      let message = '';
      if (value) {
        value = parseFloat(deleteCurrencyFormater(value));
        if (!isNaN(value) && value > 0) {
          if (value >= 1000) {
            if(this.operationType === 'payment'){
              this.exceedsTheQuota = false;
              if(this.customer.balance >= value){
                isOk = true;
              }else{
                message = "El abono supera la deuda";
              }
            }else{
              this.verifyQuota(value);
              isOk = true;
            }
          } else {
            message = 'La cifra es muy pequeña';
          }
        } else {
          message = 'Ingresa un valor válido';
        }
      } else {
        message = 'Este campo es requerído';
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
        if ((customerBalance + value) > 250000) {
          this.exceedsTheQuota = true;
        } else {
          this.exceedsTheQuota = false;
        }
      } else {
        this.exceedsTheQuota = false;
      }
    },
    onClick() {
      console.log(this.date)
    },
    onSubmit() {
      let dateIsOk = this.validateDate();
      let descriptionIsOk = this.validateDescription();
      let amountIsOk = this.validateAmount();

      if (this.customer && this.customer instanceof Customer && dateIsOk && descriptionIsOk && amountIsOk) {
        let customerId = this.customer.id;
        let isNow = this.operationMoment === 'now' ? true : false;
        let date = this.date.value;
        let description = this.description.value;
        let cash = this.paymentType === 'cash' ? true : false;
        let amount = parseFloat(deleteCurrencyFormater(this.amount.value));

        let data = new FormData();
        data.append('customer_id', customerId);
        data.append('date', date);
        data.append('description', description);
        data.append('cash', cash);
        data.append('amount', amount);

        switch (this.operationType) {
          case 'credit':
            this.$emit('new-credit', data)
            break;
          case 'payment':
            this.$emit('new-payment', data);
            break;
          default:
            break;
        }
      }
    },
    resetFields() {
      this.operationType = 'payment';
      this.paymentType = 'cash';
      this.operationMoment = 'now';
      this.description.resetInput();
      this.amount.resetInput();
      this.date.resetInput();
    }
  },//Fin de methods
  computed: {
    formTitle() {
      let title = '';
      switch (this.operationType) {
        case 'payment': title = "Registrar Abono";
          break;
        case 'credit': title = "Registar Credito";
          break;
        default: title = "Selecciona una opción";
      }

      return title;
    },
    isCredit() {
      return this.operationType === 'credit';
    },
    minDate() {
      let minDate = moment().startOf('year');
      //Si el cliente no tiene credito la fecha minima
      if (this.customer) {
        let creditCount = this.customer.credits.length;
        console.log(creditCount);
        if (creditCount > 0) {
          let maxCreditDate = moment(this.customer.credits[creditCount - 1].date);
          minDate = maxCreditDate;
          let paymentCount = this.customer.payments.length;
          if (paymentCount > 0) {
            let maxPaymentDate = moment(this.customer.payments[paymentCount - 1].date);
            minDate = maxPaymentDate.isSameOrAfter(maxCreditDate) ? maxPaymentDate : maxCreditDate;
          }
        }
      }
      return minDate;
    },
    disabledSubmit(){
      //by default the button is activated
      let result = false;
      if(this.customer){
        if(this.operationType === 'payment' && this.customer.balance <= 0){
          /**
           * The button is disabled when 
           * the customer's balance is zero 
           */
          result = true;
        }
      }else{
        /**
         * The button is disables in all case when a
         * customer has not been selected
         */
        result = true;
      }

      return result;
    }
  },//Fin de computed,
  mounted() {
    this.$root.$on('credit-was-created', this.resetFields);
    this.$root.$on('payment-was-created', this.resetFields);
  },
  template: `
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
  </form>`
})

Vue.component('customer-credits', {
  props: ['customer', 'id'],
  data: function () {
    return {
      // creditType:"pending",
      creditType: "pending",
    }
  },//Fin de data
  methods: {

  },//Fin fr mrthods
  computed: {
    credits() {
      let credits = [];
      if (this.customer) {
        switch (this.creditType) {
          case 'pending': {
            credits = this.customer.credits.filter(c => c.balance > 0);
          } break;
          case 'all': {
            credits = this.customer.credits;
          }
        }
      }

      return credits;
    },
    creditsData() {
      let data = [];
      //Ahora construyo los datos
      this.credits.forEach(c => {
        let id = c.id
        let title = c.description;
        let date = `${moment(c.date).calendar()} (${moment(c.date).fromNow()})`;
        let amount = formatCurrencyLite(c.amount, 0);
        let balance = formatCurrencyLite(c.balance, 0);
        data.push({
          id,
          title,
          date,
          amount,
          balance
        })
      })
      return data
    },
    totalAmount() {
      let amount = 0;
      this.credits.forEach(c => {
        amount += c.amount;
      })

      return formatCurrencyLite(amount, 0);
    },
    deliquentBalance() {
      let balance = 0;
      this.credits.forEach(c => {
        balance += c.balance;
      })
      return formatCurrencyLite(balance, 0);
    }
  },//Fin de computed
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
  </div>`
})

Vue.component('customer-history', {
  props: ['customer'],
  data: function () {
    return {

    }
  },//Fin de data
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

  },//Fin de methods
  computed: {
    creditData() {
      let result = [];
      if (this.customer && this.customer instanceof Customer) {
        let credits = this.customer.credits;
        credits.forEach(credit => {
          let date = moment(credit.date);
          let creditAmount = credit.amount;
          let paymentAmount = 0;
          let balance = 0;
          result.push({ date, creditAmount, paymentAmount, balance });
        })
      }//Fin de if
      return result;
    },
    paymentData() {
      let result = [];
      if (this.customer && this.customer instanceof Customer) {
        let payments = this.customer.payments;
        payments.forEach(payment => {
          let date = moment(payment.date);
          let creditAmount = 0;
          let paymentAmount = payment.amount;
          let balance = 0;
          result.push({ date, creditAmount, paymentAmount, balance });
        })
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
      historyData.forEach(data => {
        balance += (data.creditAmount - data.paymentAmount);
        data.balance = balance;
      })

      //Ahora se retrnan los datos
      return historyData;
    },
    viewData() {
      let history = this.historyData;
      let data = [];
      history.forEach(h => {
        let date = h.date.format('DD/MMM/YY');
        let credit = h.creditAmount > 0 ? formatCurrencyLite(h.creditAmount, 0) : '';
        let payment = h.paymentAmount > 0 ? formatCurrencyLite(h.paymentAmount, 0) : '';
        let balance = formatCurrencyLite(h.balance, 0);
        data.push({ date, credit, payment, balance });
      })
      return data;
    }
  },//Fin de computed
  template: `
  <div>
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
  </div>`
})

Vue.component('operation-register', {
  props: ['customers', 'id'],
  data: function () {
    return {
      customerSelected: undefined,
      waiting: false,
      processResult: { visible: false, hasError: false, message: '' },
    }
  },
  methods: {
    onCustomerSelected(customer) {
      this.customerSelected = customer;
    },
  },
  computed: {

  },
  template: `
  <div class="view" :id="id">
    <section class="view__section">
      <div class="container">
        <div class="container__header container__header--success">
          <h1 class="container__title">Sistema de Clientes</h1>
          <p class="container__subtitle">Registrar Operaciones</p>
        </div>
        <!-- Modulo para la busqueda de cliente -->
        <search-box :customers="customers" @customer-selected="onCustomerSelected"></search-box>
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

        <!-- Contenedor con las tarjetas de creditos -->
        <transition name="fade">
          <customer-credits :customer="customerSelected" :id="id + 'creditHistoryMovil'" v-if="customerSelected" class="view-desktop-colapse"></customer-credits>
        </transition>
        
        <!-- Historial del cliente -->
        <transition name="fade">
          <customer-history :customer="customerSelected" v-if="customerSelected" class="view-desktop-colapse"></customer-history>
        </transition>
      </div>
    </section>
    <aside class="view__sidebar">
      <!-- Contenedor con las tarjetas de creditos -->
      <customer-credits :customer="customerSelected" :id="id + 'creditHistoryDesktop'"></customer-credits>

      <customer-history :customer="customerSelected"></customer-history>
    </aside>
    <waiting-modal v-bind:visible="waiting"></waiting-modal>
    <process-result v-bind:process-result="processResult" @hidden-modal="processResult.visible = false"></process-result>
  </div>`
})

//---------------------------------------------
//  RAIZ DE LA APLICACION
//---------------------------------------------
const app = new Vue({
  el: '#app',
  data: {
    customers: [],
    modals: {
      waiting: new WaitingModal(),
    },
    // propiedades temporales
    waiting: false,
    processResult: new RequesProcess(),
  },
  methods: {
    /**
     * Este metodo se ejecuta cuando se recibe el evento emitido por el modulo
     * para crear y actualizar clientes y se encarga de actualizar los
     * datos del cliente que el servidor ya procesó
     * @param {object} data Objeto devuelto por l servidor con los datos del cliente actualizado
     */
    updateCustomer(data) {
      if (this.customers.some(c => c.id === data.id)) {
        let customer = this.customers.filter(c => c.id === data.id)[0];
        customer.update(data);
      }
    },
    /**
     * Cuando se recibe el evento de customer-update se encarga de vomver a peidor los datos
     * del cliente al servidor. 
     */
    newCustomer() {
      this.updateModel();
    },
    async onNewCredit(formData) {
      console.log(formData);
      //Se monta la espera
      this.waiting = true;
      try {
        const res = await fetch('./api/new_credit.php', { method: 'POST', body: formData });
        const data = await res.json();
        console.log(data);
        if (data.sessionActive) {
          if (data.request) {
            this.updateCustomer(data.customer);
            this.waiting = false;
            this.processResult.isSuccess('Credito registrado con exito');
            this.$root.$emit('credit-was-created');
          } else {
            this.waiting = false;
            this.processResult.isDanger('No se pudo registrar el credito');
          }
        } else {
          location.reload();
        }
      } catch (error) {
        console.log(error)
      }
      
    },
    async onNewPayment(formData) {
      const res = await fetch('./api/new_payment.php', { method: 'POST', body: formData });
      const data = await res.json();
      console.log(data);
      if (data.sessionActive) {
        if (data.request) {
          this.updateCustomer(data.customer);
          this.waiting = false;
          this.processResult.isSuccess('Abono registrado con exito');
          this.$root.$emit('payment-was-created');
        } else {
          this.waiting = false;
          this.processResult.isDanger('No se pudo registrar el abono');
        }
      } else {
        location.reload();
      }
    },
		/**
		 * Solicita al servidor la informacion de todos los clientes
		 */
    async updateModel() {
      try {
        const res = await fetch('./api/all_customers.php');
        const data = await res.json();
        if (data.sessionActive) {
          this.customers = [];
          data.customers.forEach(c => {
            const customer = new Customer(c.id, c.firstName, c.lastName, c.nit, c.phone, c.email, c.points);
            //Ahora agrego los creditos del cliente
            c.credits.forEach(credit => {
              customer.addCredit(credit.id, credit.creditDate, credit.description, credit.amount, credit.balance);
            })
            //Se agregan los abonos
            c.payments.forEach(payment => {
              customer.addPayment(payment.id, payment.paymentDate, payment.amount, payment.cash);
            })

            customer.defineState();
            this.customers.push(customer);
          })
        } else {
          location.reload();
        }
      } catch (error) {
        console.log(error)
      }
    },//Fin del metodo

  },//Fin de methods
  computed: {
  },//Fin de compute
  created() {
    this.updateModel();
  },//Fin de create
});

