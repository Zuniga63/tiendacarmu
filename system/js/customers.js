const ACTIVE_LINK = 'dropdown__link--active';
const VIEW_SHOW = 'show';


/**
 * Es la etiqueta que aparece debajo del titulo
 */
const systemLegend = document.getElementById('systemLegend');


//---------------------------------------------------------------------------------------------
//                  OBJETOS DEL SISTEMA
//---------------------------------------------------------------------------------------------

/**
 * Clase view que permite cntrolar si las vista se pueden mostrar
 */
class View {
	/**
	 * @constructor
	 * @param {string} id La clave con las que accedo a este objeto
	 * @param {string} link Es el id del link de la vista
	 * @param {string} view Es el id de la vista en el DOM
	 */
  constructor(id, link, view) {
    this.id = id,
      this.link = document.getElementById(link),
      this.view = document.getElementById(view)
  }

	/**
	 * Agrega las clases ACTIVE_LINK y VIEW_SHOW
	 */
  show() {
    if ((this.link && this.link.classList) && (this.view && this.view.classList)) {
      this.link.classList.add(ACTIVE_LINK);
      this.view.classList.add(VIEW_SHOW);
    }
  }

	/**
	 * Elimina las clase que muestra la vista y la que marca al link de navegacion
	 */
  hidden() {
    if ((this.link && this.link.classList) && (this.view && this.view.classList)) {
      this.link.classList.remove(ACTIVE_LINK);
      this.view.classList.remove(VIEW_SHOW);
    }
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

/**
 * Instancia de una tupla de historial
 */
class CustomerHistory {
	/**
	 * @constructor
	 * @param {string} author Nombre completo del usuario que realizó la accion
	 * @param {string} customer Nombre complto del cliente asociado a este historial
	 * @param {string} historyDate Fecha del momento exacto en el que se creo el registro
	 * @param {bool} newCustomer Si fue un nuevo cliente
	 * @param {bool} updateData Si se actualizaron los datos del cliente
	 * @param {bool} updateCredit Si se actualizaron los datos de un credito
	 * @param {bool} updatePayment Si se actualizaron los datos de algun abono
	 * @param {bool} newPayment Si se agregó un nuevo abono al cliente
	 * @param {bool} newCredit Sis se agrego un nuevo credito al clienta
	 * @param {number} amount Diferente de cero para el caso de que se actualicen creditos o abonos
	 */
  constructor(author, customer, historyDate, newCustomer, updateData, updateCredit, updatePayment, newPayment, newCredit, amount) {
    this.author = author;
    this.customer = customer;
    this.historyDate = historyDate;
    this.recently = false;
    this.newCustomer = newCustomer;
    this.updateData = updateData;
    this.updateCredit = updateCredit;
    this.updatePayment = updatePayment;
    this.newPayment = newPayment;
    this.newCredit = newCredit;
    this.amount = amount;
    this.defineRecently();
  }

	/**
	 * Establece si este historial es reciente o antiguo
	 */
  defineRecently() {
    this.historyDate = moment(this.historyDate);
    let now = moment();
    let diff = now.diff(this.historyDate, 'days');
    if (diff <= 8) {
      this.recently = true;
    }
  }
}

/**
 * Encargado de controlar y gestionar la informacion del historial
 */
class HistoryController {
  constructor() {
    this.history = [];
    this.cards = {
      newCustomers: '',
      updates: '',
      credits: '',
      payments: ''
    };//Fin de cards
  }//Fin del constructor

	/**
	 * Metodo asincronico que actualiza los datos del historial
	 * y crea las plantillas html para pintar en pantalla
	 */
  async update() {
    await fetch("./api/customer_history.php")
      .then(res => res.json())
      .then(res => {
        this.createHistory(res.history);
        this.createCards();
      });//Fin de fetch
  }//Fin del metodo

	/**
	 * Este metodo crea las instancias de historial recuperadas de 
	 * la base de datos
	 * @param {array} customersHistory Datos del historial del clientes
	 */
  createHistory(customersHistory) {
    this.history = [];
    customersHistory.forEach(record => {
      let history = new CustomerHistory(record.author, record.customer, record.historyDate, record.newCustomer, record.updateData, record.updateCredit, record.updatePayment, record.newPayment, record.newCredit, record.amount);
      this.history.push(history);
    })//Fin de forEach
  }

	/**
	 * Filtra los historiales segun su caracteristicas y se ecarga de crear
	 * cada una de las tarjetas
	 */
  createCards() {
    let updates = [];
    let newCustomers = [];
    let newPayments = [];
    let newCredits = [];

    this.history.forEach(record => {
      if (record.newCustomer) {
        newCustomers.push(record);
      } else if (record.updateData || record.updateCredit || record.updatePayment) {
        updates.push(record);
      } else if (record.newPayment) {
        newPayments.push(record);
      } else if (record.newCredit) {
        newCredits.push(record);
      }
    })

    this.createUpdateCards(updates);
    this.createNewCustomersCards(newCustomers);
    this.createNewPaymentsCards(newPayments);
    this.createNewCreditsCards(newCredits);
  }

	/**
	 * Crea las tarjetas de los historiales de actualizaciones
	 * @param {array} records El historial de actualizaciones
	 */
  createUpdateCards(records) {
    let htmlCode = '';

    records.forEach(record => {
      let info = '';
      if (record.updateData) {
        info = "Se modificaron los datos personales";
      } else if (record.updatePayment) {
        //TODO
      } else if (record.updateCredit) {
        //TODO
      }

      htmlCode += this.createCard(record.author, record.customer, record.recently, record.historyDate, info);
    })

    this.cards.updates = htmlCode;
  }

	/**
	 * Crea las tarjetas de las creaciones de nuevos clientes en el sistema
	 * @param {array} records Historial de nuevos clientes
	 */
  createNewCustomersCards(records) {
    let htmlCode = '';
    records.forEach(record => {
      let info = '';

      htmlCode += this.createCard(record.author, record.customer, record.recently, record.historyDate, info);
    })

    this.cards.newCustomers = htmlCode;
  }//Fin del metodo

	/**
	 * Crea las tarjetas de nuevos abonos
	 * @param {array} records El historial de nuevos abonos
	 */
  createNewPaymentsCards(records) {
    let htmlCode = '';
    records.forEach(record => {
      let info = `Se registró un pago por valor de <span class="history__card__bold">${formatCurrencyLite(record.amount, 0)}</span>`;

      htmlCode += this.createCard(record.author, record.customer, record.recently, record.historyDate, info);
    })

    this.cards.payments = htmlCode;
  }

	/**
	 * Crea las tarjetas del historial de creditos
	 * @param {*} records El historial de ceditos
	 */
  createNewCreditsCards(records) {
    let htmlCode = '';
    records.forEach(record => {
      let info = `Se registró un crédito por valor de <span class="history__card__bold">${formatCurrencyLite(record.amount)}</span>`;

      htmlCode += this.createCard(record.author, record.customer, record.recently, record.historyDate, info);
    })

    this.cards.credits = htmlCode;
  }

	/**
	 * Es la plantilla para crear las tarjetas
	 * @param {string} author Nombre del usuario que hizo esta modificacion
	 * @param {string} customer Nombre del cliente al que se le hizo la modificación
	 * @param {boolean} recently Si es un hitorial reciente
	 * @param {string} date Fecha del historial
	 * @param {string} info Informacion importante del historial
	 */
  createCard(author, customer, recently, date, info) {
    recently = recently ? 'history__card--recently' : '';
    date = date.calendar();
    return `
		<div class="history__card ${recently}">
        <p class="history__card__title">${customer}</p>
        <p class="history__card__date">${date}</p>
        <p class="history__card__info">${info}</p>
        <p class="history__card__author">Responsable: <span class="history__card__bold">${author}</span></p>
      </div>`
  }
}//Fin de la clase


/**
 * Listado de clientes recuperados de la base de datos
 */
let customers = [];

/**
 * Corresponde al identificador del cliente seleccionado
 */
let customerSelected = undefined;

let reports = null;

/**
 * Instancia del controlador de historial
 */
let customersHistoryModel = new HistoryController();

//---------------------------------------------------------------------------------------------
//                  LOADING SECTION
//---------------------------------------------------------------------------------------------
window.addEventListener('load', async () => {
  //Se configura la librería de moment
  moment.locale('es-do');
  moment().format('DD/MM/YYYY hh:mm a');

  // await reloadCustomerList();

  viewController();
  newCustomerController();
  updateCustomerController();
  newCreditController();
  newPaymentController();
  consultDebtsController();
  searchBoxController();
  customerHistoryController();

  document.getElementById("preload").classList.remove("show");
})

//---------------------------------------------------------------------------------------------
//                  CODIGO PARA CONTROLAR LAS VSITAS
//---------------------------------------------------------------------------------------------

/**
 * Objeto con todas las vista disponible
 */
const VIEWS = {
  sumary: new View('sumary', 'sumaryLink', 'sumary'),
  newCustomer: new View('newCustomer', 'newCustomerLink', 'newCustomer'),
  newPayment: new View('newPayment', 'newPaymentLink', 'newPayment'),
  newDebt: new View('newDebt', 'newDebtLink', 'newDebt'),
  customerUpdate: new View('customerUpdate', 'customerUpdateLink', 'customerUpdate'),
  consultDebts: new View('consultDebts', 'consultDebtsLink', 'consultDebts'),
  customerHistory: new View('customerHistory', 'customerHistoryLink', 'customerHistory')

};

/**
 * Este metodo realiza todo lo requerido para mostrar una vista al clientes
 * cada vez que haga click en alguno de los enlaces
 * @param {string} viewName Nombre de la vista que se desea mostrar, por defecto muestra el resumen
 */
const showView = async (viewName = 'sumary') => {
  //Se oculta el menú
  const navbarCollapse = document.getElementById('navbar-collapse');
  if (navbarCollapse.classList.contains('show')) {
    showMenu(navbarCollapse);
  }

  //Se ocultan todas las vistas    
  let views = Object.values(VIEWS);
  views.forEach(view => {
    view.hidden();
  });

  //Se muestra la vista seleccionada
  switch (viewName) {
    case 'newCustomer': {
      VIEWS.newCustomer.show();
      systemLegend.innerText = 'Nuevo Cliente';
      //Se hace la peticion de datos
      await reloadCustomerList();


      //Se actualiza el localStorages
      localStorage.actualView = viewName;
    } break;//Fin del caso 1

    case 'newPayment': {
      VIEWS.newPayment.show();
      systemLegend.innerText = 'Registrar Abono'
      localStorage.actualView = viewName;
      //Se hace la peticion de datos
      await reloadCustomerList();

      let searchBox = VIEWS.newPayment.view.querySelector('.search-box');
      updateSearchBoxResult(searchBox);
      updateCustomerCard(document.getElementById('newPaymentCustomer'));
    } break;//Fin del caso 2

    case 'newDebt': {
      VIEWS.newDebt.show();
      systemLegend.innerText = 'Registrar Credito'
      localStorage.actualView = viewName;
      //Se hace la peticion de datos
      await reloadCustomerList();

      let searchBox = VIEWS.newDebt.view.querySelector('.search-box');
      updateSearchBoxResult(searchBox);
      updateCustomerCard(document.getElementById('newDebtCustomer'));
    } break;//Fin del caso 3

    case 'customerUpdate': {
      VIEWS.customerUpdate.show();
      systemLegend.innerText = 'Actulizar Clientes';
      localStorage.actualView = viewName;
      //Se hace la peticion de datos
      await reloadCustomerList();

      let searchBox = VIEWS.customerUpdate.view.querySelector('.search-box');
      updateSearchBoxResult(searchBox);
      loadCustomer();
    } break; //Fin del caso 4

    case 'consultDebts': {
      VIEWS.consultDebts.show();
      systemLegend.innerText = 'Consultar Creditos';
      localStorage.actualView = viewName;
      //Se hace la peticion de datos
      await reloadCustomerList();

      let searchBox = VIEWS.consultDebts.view.querySelector('.search-box');
      updateSearchBoxResult(searchBox);
      updateCustomerCard(document.getElementById('consultDebtsCustomer'));

      printCustomerHistory();

    } break;//Fin del caso 5

    case 'customerHistory': {
      VIEWS.customerHistory.show();
      systemLegend.innerText = 'Historial';
      localStorage.actualView = viewName;

      //Se actualiza el modelo
      await customersHistoryModel.update();
      updateHistory();

    } break;//Fin del caso 6

    default: {
      VIEWS.sumary.show();
      systemLegend.innerText = 'Resumen';
      localStorage.actualView = 'sumary';
      //Se hace la peticion de datos
      await reloadCustomerList();

      //Se cargan los graficos
      updateCharts();
    } break;//Fin de default
  }//Fin de switch


}//Fin de showView

/**
 * Agrega la funcionalidad a los link que se encuentran en la seccion de
 * clientes y que son los encargados de mostrar los distintos elementos de esta vista
 */
const viewController = () => {
  //Se muestra la vista guardada
  showView(localStorage.actualView);

  //Se actualizan las tarjetas
  updateCustomerCard(document.getElementById('newPaymentCustomer'));
  updateCustomerCard(document.getElementById('newDebtCustomer'));
  updateCustomerCard(document.getElementById('consultDebtsCustomer'));

  const searchBoxs = document.querySelectorAll('.search-box');

  //El link que muestra el resumen
  VIEWS.sumary.link.addEventListener('click', async () => {
    showView();
    // await reloadCustomerList();
    // updateCharts();
  });

  //El link que muestra el formulario para nuevo clientes
  VIEWS.newCustomer.link.addEventListener('click', async () => {
    showView('newCustomer');
    // await reloadCustomerList();
  })

  VIEWS.newPayment.link.addEventListener('click', async () => {
    showView('newPayment');

    // await reloadCustomerList();
    // let searchBox = VIEWS.newPayment.view.querySelector('.search-box');
    // updateSearchBoxResult(searchBox);
    // updateCustomerCard(document.getElementById('newPaymentCustomer'));
  })

  VIEWS.newDebt.link.addEventListener('click', async () => {
    showView('newDebt');
    // await reloadCustomerList();
    // let searchBox = VIEWS.newDebt.view.querySelector('.search-box');
    // updateSearchBoxResult(searchBox);
    // updateCustomerCard(document.getElementById('newDebtCustomer'));
  })

  VIEWS.customerUpdate.link.addEventListener('click', async () => {
    //Funcionalidad deshabilitada
    showView('customerUpdate');
    // await reloadCustomerList();
    // let searchBox = VIEWS.customerUpdate.view.querySelector('.search-box');
    // updateSearchBoxResult(searchBox);
  })

  VIEWS.consultDebts.link.addEventListener('click', async () => {
    showView('consultDebts');
    // await reloadCustomerList();
    // let searchBox = VIEWS.consultDebts.view.querySelector('.search-box');
    // updateSearchBoxResult(searchBox);
    // updateCustomerCard(document.getElementById('consultDebtsCustomer'));
  })

  VIEWS.customerHistory.link.addEventListener('click', () => {
    showView('customerHistory');
  });
}

//---------------------------------------------------------------------------------------------
//                  CODIGOS PARA MODIFICAR DATOS EN EL SERVIDOR
//---------------------------------------------------------------------------------------------
let newCustomerProcessEnd = true;
let newCreditProcessEnd = true;
let newPaymentProcessEnd = true;
let updateCustomerProcessEnd = true;
/**
 * Se encarga de agregar la funcionalidad de los elementos encargado de crear un
 * nuevo cliente
 */
const newCustomerController = () => {
  const newCustomerForm = document.getElementById('newCustomerForm');

	/**
	 * Los siguiente sirve para poder seleccionar el cuerpo de los
	 * formularios de maera automatica al obtener el foco
	 */
  selectText(document.getElementById('newCustomerFirstName'));
  selectText(document.getElementById('newCustomerLastName'));
  selectText(document.getElementById('newCustomerNit'));
  selectText(document.getElementById('newCustomerPhone'));
  selectText(document.getElementById('newCustomerEmail'));

	/**
	 * El siguiente codigo indica lo que se debe hacer 
	 * cuando se intenta enviar los datos del formulario
	 */
  newCustomerForm.addEventListener('submit', (e) => {
    //Se evita que el formulario recargue la pagina
    e.preventDefault();

    //Si el proceso anterior no ha terminado se evita hacer nuevas peticiones
    if (newCustomerProcessEnd) {
      //Se crea el objeto para el cuerpo de la peticion
      const data = new FormData(newCustomerForm);

      //Se recuperan los objetos que muestran los resultados al usuario
      const alert = document.getElementById('newCustomerAlert');  //Para mostrar el resultado
      const btn = document.getElementById('newCustomerBtn');      //Para hacer modificaciones al texto

			/**
			 * Se procede a hacer la solicitud si el nombre del nuevo cliente
			 * no se encuentra en blanco
			 */
      if (data.get('first_name').trim()) {
        //Lo siguiente es para evitar que se hagan nuevas solicitudes mientras se procesa
        btn.value = 'Procesando Solicitud';
        newCustomerProcessEnd = false;

				/**
				 * Queda pendiente el codigo que pregunta al usuario
				 * si desea agregar al cliente a pesar de que el nombre 
				 * se encuentra repetido o el telefono o el correo
				 * TODO:
				 */

        fetch('./api/new_customer.php', {
          method: 'POST',
          body: data
        })
          .then(res => res.json())
          .then(res => {
            //Se devuelve a la normalidad el boton
            btn.value = 'Registrar Cliente';
            newCustomerProcessEnd = true;

            if (res.request) {
              //Se notifica que todo ha ido correcto
              writeAlert(alert, 'success', 'Cliente agregado satisfactoriamente');
              newCustomerForm.reset();
            } else {
              //Se notifica que no se ha podido procesar la peticion
              writeAlert(alert, 'danger', 'No se ha podido crear el cliente');
            }

            //Tras 5 segundos desaparece la alerta
            setTimeout(() => {
              alert.classList.remove('show');
            }, 5000);
          })

      } else {
        writeAlert(alert, 'danger', 'El nombre del cliente es obligatorio');
        document.getElementById('newCustomerFirstName').focus();
        btn.blur();
      }//Fin de else
    }//Fin de if        
  })
}

const updateCustomerController = () => {
  const customerUpdateForm = document.getElementById('customerUpdateForm');
  const updateName = document.getElementById('updateName');
  const updateLastname = document.getElementById('updateLastname');
  const updateNit = document.getElementById('updateNit');
  const updatePhone = document.getElementById('updatePhone');
  const updateEmail = document.getElementById('updateEmail');
  const customerUpdateAlert = document.getElementById('customerUpdateAlert');
  const updateBtn = document.getElementById('updateBtn');

  //Se agrega la funcionalidad para seleccionar su contenido
  //al obtener el foco
  selectText(updateName);
  selectText(updateLastname);
  selectText(updateNit);
  selectText(updatePhone);
  selectText(updateEmail);

  customerUpdateForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let customerIsCorrert = customers.some(c => c.id === customerSelected);

    if (updateCustomerProcessEnd && customerIsCorrert && updateName.value.trim()) {
      //Se bloquean nuevas peticiones
      updateCustomerProcessEnd = false;

      //Se cambia el valor del boton
      updateBtn.value = 'Procesando Solicitud';

      //Se crea el cuerpo del de la peticion
      let data = new FormData(customerUpdateForm);
      data.append('customer_id', customerSelected);

      //Se realiza la peticion
      fetch('./api/update_customer.php', {
        method: 'POST',
        body: data
      })
        .then(res => res.json())
        .then(res => {
          //Si la session no está activa entonces se reinicia la pag
          if (res.sessionActive) {
            if (res.request) {
              //Se actualiza la alerta
              customerUpdateAlert.innerText = "Se actualizaron los datos";
              customerUpdateAlert.classList.remove('alert--danger');
              customerUpdateAlert.classList.add('alert--success');

              //Se actualizan los datos del cliente seleccionado
              updateCustomer(customerSelected, res.customer);
              updateAllCustomerCards();
              let searchBox = VIEWS.customerUpdate.view.querySelector('.search-box');
              updateSearchBoxResult(searchBox);

              //Se resetea el formulario
              customerUpdateForm.reset();
            } else {
              customerUpdateAlert.innerText = "No se actualizaron los datos del cliente";
              customerUpdateAlert.classList.add('alert--danger');
            }

            //Se restauran los parametros globales y se muestra la alerta
            updateCustomerProcessEnd = true;
            updateBtn.value = 'Actualizar Cliente';
            customerUpdateAlert.classList.add('show');

            //Pasado 5 segundo se oculta la alerta
            setTimeout(() => {
              customerUpdateAlert.classList.remove('show');
            }, 5000);
          } else {
            location.reload();
          }
        });

    }
  })
}

/**
 * Se encarga de agregar la funcionalidad de los elementos encargados de crear un
 * nuevo credito
 */
const newCreditController = () => {
  //Recupero el el formulario
  const newCreditForm = document.getElementById('newCreditForm');

	/**
	 * Se agrega la funcionalidad a la caja de texto para la descripcion del credito:
	 * Que se seleccione el texto al obtener el foco
	 * Actualice la logitud disponible 
	 */

  //Recupero los elementos del formulario
  const creditDescription = document.getElementById('creditDescription');
  const creditDescriptionLength = document.getElementById('creditDescriptionLength');
  const creditDescriptionAlert = document.getElementById('creditDescriptionAlert');

  //Se agrega la funcionalidad para seleccionar el texto
  selectText(creditDescription);

  //Se agrega la funcionalidad que muestra la longitud disponible al cambiar
  //el texto dentro del campo
  creditDescription.addEventListener('input', () => {
    // console.log(creditDescription.value);
    let maxLength = 50;
    let length = creditDescription.value.length;
    let disponible = maxLength - length;

    if (disponible >= 0) {
      creditDescriptionLength.removeAttribute('style');
      creditDescriptionAlert.classList.remove('show');
      creditDescriptionLength.innerText = disponible;
    } else {
      creditDescriptionLength.style.color = 'red';
      creditDescriptionLength.innerText = -disponible;
      creditDescriptionAlert.classList.add('show');
      creditDescriptionAlert.innerText = "Se supera el maximo permitido";
    }
  })

	/**
	 * Se agrega la funcionalidad a la caja de moneda
	 * Que seleccione su contendio al obtener el foco
	 * Que formatee el texto conforme se va introduciendo
	 */

  //Se recuperan los elementos
  const creditAmount = document.getElementById('creditAmount');
  const creditAmountAlert = document.getElementById('creditAmountAlert');

  //Se agrega la funcionalidad para seleccionar el texto
  selectText(creditAmount);

  //Se agrega la funcionalidad para formaterar el texto
  creditAmount.addEventListener('input', () => {
    let originalValue = creditAmount.value;
    //Elimino el signo moneda y el punto
    value = deleteFormaterOfAmount(originalValue);
    value = parseFloat(value);
    if (!isNaN(value) && value >= 0) {
      value = formatCurrencyLite(value, 0);
      creditAmount.value = value;
      creditAmountAlert.classList.remove('show');
    } else {
      creditAmount.value = 0;
      creditAmountAlert.innerText = 'No tiene formato valido';
      creditAmountAlert.classList.add('show');
    }
  });

  //Se agregan las intrucciones cuando se intenta enviar el formulario
  newCreditForm.addEventListener('submit', (e) => {
    //Se evita recargar la pagina
    e.preventDefault();

    //Se validan los datos del formulario
    if (validateCredit() && newCreditProcessEnd) {
      //Se recuperan los elementos que muestran el estado del proceso
      const newCreditBtn = document.getElementById('newCreditBtn');
      const newCreditAlert = document.getElementById('newCreditAlert');
      let customer = customers.filter(c => c.id === customerSelected)[0];
      let message = `Se va a registrar un crédito al cliente ${customer.firstName} `
      message += `por valor de ${creditAmount.value}`;

      //Se pide una confirmacion por parte del usuario
      if (confirm(message)) {
        //Se bloquean nuevas peticiones
        newCreditProcessEnd = false;                //Se notifica que se inicia el proceso
        newCreditBtn.value = "Procesando solicitud";

        //Se recuperan los datos del formulario
        let customerId = customerSelected;
        let description = creditDescription.value.trim();
        let amount = parseFloat(deleteFormaterOfAmount(creditAmount.value));

        //Se crea el cuerpo de la peticion
        let data = new FormData();
        data.append('customer_id', customerId);
        data.append('description', description);
        data.append('amount', amount);

        //Se realiza la peticion POST
        fetch('./api/new_credit.php', {
          method: 'POST',
          body: data
        })
          .then(res => res.json())
          .then(res => {
            //Si la sesion es inactiva recarga la página
            if (res.sessionActive) {
              if (res.request) {
                //Se notifica al usuario que todo fue correcto
                newCreditAlert.innerText = "Solicitud procesada satisfactoriamente";
                newCreditAlert.classList.add('alert--success');

                //Se actualizan los datos del cliente seleccionado
                updateCustomer(customerId, res.customer);
                updateAllCustomerCards();
                let searchBox = VIEWS.newDebt.view.querySelector('.search-box');
                updateSearchBoxResult(searchBox);

                //Se resetea el formulario
                newCreditForm.reset();
              } else {
                //S notifica al usuario que no se pudo crear el credito
                newCreditAlert.innerText = "No se pudo crear el crédito";
                newCreditAlert.classList.add('alert--danger');
              }

              //Se restauran los parametros globales y se muestra la alerta
              newCreditProcessEnd = true;
              newCreditBtn.value = 'Registrar Credito';
              newCreditAlert.classList.add('show');

              //Pasado 5 segundo se oculta la alerta
              setTimeout(() => {
                newCreditAlert.classList.remove('show');
              }, 5000);
            } else {
              location.reload();
            }
          })//Fin de fetch
      }//Fin de if

    }//Fin de if
  });//Fin de addEventListener
}//Fin del metodo

/**
 * Se encarga de agregar la funcionalidad de los elementos encargados de crear un nuevo pago
 */
const newPaymentController = () => {
  //Se recuperan los elementos involucrados 
  const paymentAmount = document.getElementById('newPaymentAmount');
  const newPaymentForm = document.getElementById('newPaymentForm');

  //Se agrega la funcionalidad para seleccionar al obtener el foco
  selectText(paymentAmount);

  //Se agrega la funcionalidad para formatear la caja de moneda
  paymentAmount.addEventListener('input', () => {
    let originalValue = paymentAmount.value;
    //Elimino el signo moneda y el punto
    value = deleteFormaterOfAmount(originalValue);
    value = parseFloat(value);
    if (!isNaN(value) && value >= 0) {
      value = formatCurrencyLite(value, 0);
      paymentAmount.value = value;
    } else {
      paymentAmount.value = 0;
    }
  });

  //Se agrega las instrucciones para agregar un nuevo abono
  newPaymentForm.addEventListener('submit', (e) => {
    //Se evitar recargar la pagina
    e.preventDefault();

    //Se validan los datos
    if (validatePayment() && newPaymentProcessEnd) {
      //Se recuperan los elementos que muestran el estado de la solicitud
      const newPaymentBtn = document.getElementById('newPaymentBtn');
      const newPaymentAlert = document.getElementById('newPaymentAlert');
      const newPaymentCashPayment = document.getElementById('newPaymentCashPayment');

      let customer = customers.filter(c => c.id === customerSelected)[0];
      let message = `Se va a realizar un abono al cliente ${customer.firstName} por valor de ${paymentAmount.value}`;

      //Se solicita la confirmacion al usuario
      if (confirm(message)) {
        //Se muestra en pantalla que el proceso inició
        newPaymentProcessEnd = false;
        newPaymentBtn.value = "Procesando Solicitud";

        //Se recuperan los datos
        let cashPayment = newPaymentCashPayment.checked;
        let amount = parseFloat(deleteFormaterOfAmount(newPaymentAmount.value));
        let customerId = customerSelected;

        //Se crea el cuerpo de la peticion
        let data = new FormData();
        data.append('customer_id', customerId);
        data.append('amount', amount);
        data.append('cash', cashPayment);

        //Ahora se hace la peticion
        fetch('./api/new_payment.php', {
          method: 'POST',
          body: data
        })
          .then(res => res.json())
          .then(res => {
            //Si la seccion no está activa se recarga la pagina
            if (res.sessionActive) {
              if (res.request) {
                //Se notifica al usuario que todo fue correcto
                newPaymentAlert.innerText = "El abono fue procesado correctamente";
                newPaymentAlert.classList.add('alert--success');
                newPaymentAlert.classList.remove('alert--danger');

                //Se actualiza al cliente en cuestion
                updateCustomer(customerId, res.customer);
                newPaymentForm.reset();
                updateAllCustomerCards();

                //Se actualiza tambien la caja de resultados para que sea consistente
                let searchBox = VIEWS.newPayment.view.querySelector('.search-box');
                updateSearchBoxResult(searchBox);
              } else {
                newPaymentAlert.innerText = "No se pudo procesar la solicitud";
                newPaymentAlert.classList.add('alert--danger');
                newPaymentAlert.classList.remove('alert--success');
              }

              //Se restauran los parametros globales y se muestra la alerta
              newPaymentProcessEnd = true;
              newPaymentBtn.value = 'Registrar Abono';
              newPaymentAlert.classList.add('show');

              //Pasado 5 segundo se oculta la alerta
              setTimeout(() => {
                newPaymentAlert.classList.remove('show');
              }, 5000);
            } else {
              location.reload();
            }
          });//Fin de la peticion

        console.log(`${cashPayment} => ${amount} => ${customerId}`);
      }//Fin de if
    }//Fin de if
  })//Fin de addEventListener
}//Fin del metodo

/**
 * Agrega la funcionalidad a los elementos contenidos en la vista
 * que muestra los creditos y los pagos del cliente
 */
const consultDebtsController = () => {
  document.getElementById('consultDebtsAll').addEventListener('click', () => {
    updateDebtHistory();
  });
  document.getElementById('consultDebtsOutstanding').addEventListener('click', () => {
    updateDebtHistory();
  });
  document.getElementById('consultDebtsPaid').addEventListener('click', () => {
    updateDebtHistory();
  });
}

const customerHistoryController = () => {
  historyNews.addEventListener('click', () => {
    updateHistory();
  })

  historyUpdates.addEventListener('click', () => {
    updateHistory();
  })

  creditHistory.addEventListener('click', () => {
    updateHistory();
  })

  paymentHistory.addEventListener('click', () => {
    updateHistory();
  })
}

const updateHistory = () => {
  const historyNews = document.getElementById('historyNews');
  const historyUpdates = document.getElementById('historyUpdates');
  const creditHistory = document.getElementById('creditHistory');
  const paymentHistory = document.getElementById('paymentHistory');
  const historyBox = document.getElementById('historyBox');

  if (historyNews.checked) {
    historyBox.innerHTML = customersHistoryModel.cards.newCustomers;
  } else if (historyUpdates.checked) {
    historyBox.innerHTML = customersHistoryModel.cards.updates;
  } else if (creditHistory.checked) {
    historyBox.innerHTML = customersHistoryModel.cards.credits;
  } else if (paymentHistory.checked) {
    historyBox.innerHTML = customersHistoryModel.cards.payments;
  } else {
    historyBox.innerHTML = '';
  }
}

/**
 * Se encarga de validar los datos del formulario para un nuevo credito y de
 * mostrar las alertas correspondientes para el usuario
 */
const validateCredit = () => {
  const creditDescription = document.getElementById('creditDescription');
  const creditDescriptionAlert = document.getElementById('creditDescriptionAlert');
  const creditAmount = document.getElementById('creditAmount');
  const creditAmountAlert = document.getElementById('creditAmountAlert');
  const newCreditAlert = document.getElementById('newCreditAlert');

  let descriptionIsCorrect = false;
  let amountIsCorrect = false;
  let customerIsCorrert = customers.some(c => c.id === customerSelected);

  let description = creditDescription.value;
  let amount = creditAmount.value;
  let customer = null;

  //Se recupera al cliente
  if (!customerIsCorrert) {
    newCreditAlert.innerText = "Se debe seleccionar un cliente";
    newCreditAlert.classList.add('show');
    newCreditAlert.classList.add('alert--danger');
  } else {
    newCreditAlert.classList.remove('show');
  }

  //Se valida la descripcion
  if (typeof description === 'string') {
    description = description.trim();
    if (description.length > 0) {
      descriptionIsCorrect = true;
      creditDescriptionAlert.classList.remove('show');
    } else {
      creditDescriptionAlert.classList.add('show');
      creditDescriptionAlert.innerText = "Este campo es obligatorio";
    }
  } else {
    creditDescriptionAlert.classList.add('show');
    creditDescriptionAlert.innerText = "El formato no es valido";
  }

  //Ahora se procede a validar el inporte
  amount = deleteFormaterOfAmount(amount);
  amount = parseFloat(amount);
  if (!isNaN(amount)) {
    if (amount > 0) {
      amountIsCorrect = true;
      creditAmountAlert.classList.remove('show');
    } else {
      creditAmountAlert.innerText = 'No puede ser menor o igual a cero';
      creditAmountAlert.classList.add('show');
    }
  } else {
    creditAmountAlert.innerText = 'No tiene el formato adecuado';
    creditAmountAlert.classList.add('show');
  }

  return (customerIsCorrert && descriptionIsCorrect && amountIsCorrect);

}

/**
 * Se encarga de hacer las validaciones correspondientes alformulario
 * para agregar un nuevo abono y de mostrar las alertas correspondientes
 */
const validatePayment = () => {
  //Recupero los elemento del DOM involucrados
  const newPaymentAmount = document.getElementById('newPaymentAmount');
  const newPaymentAmountAlert = document.getElementById('newPaymentAmountAlert');
  const newPaymentAlert = document.getElementById('newPaymentAlert');

  let amountIsCorrect = false;
  let customerIsCorrert = customers.some(c => c.id === customerSelected);

  if (customerIsCorrert) {
    newPaymentAlert.classList.remove('show');
    let customer = customers.filter(c => c.id === customerSelected)[0];

    let amount = deleteFormaterOfAmount(newPaymentAmount.value);
    amount = parseFloat(amount);
    if (!isNaN(amount) && amount > 0) {
      newPaymentAmountAlert.classList.remove('show');
      if (amount <= customer.balance) {
        amountIsCorrect = true;
      } else {
        newPaymentAmountAlert.innerText = 'No puede ser mayor a la deuda';
        newPaymentAmountAlert.classList.add('show');
      }
    } else {
      newPaymentAmountAlert.innerText = 'Debe ser mayor que cero';
      newPaymentAmountAlert.classList.add('show');
    }
  } else {
    newPaymentAlert.innerText = 'Se debe seleccionar un cliente';
    newPaymentAlert.classList.add('alert--danger');
    newPaymentAlert.classList.add('show');
  }

  return customerIsCorrert && amountIsCorrect;
}

/**
 * Se encarga de eliminar el signo peso y los puntos puestos por el formateador de
 * moneda
 * @param {string} text Es un texto numerico con formato de moneda
 */
const deleteFormaterOfAmount = text => {
  let value = text.replace('$', '');
  value = value.split(".");
  value = value.join('');

  return value;
}//Fin del metodo

//---------------------------------------------------------------------------------------------
//                  CODIGO PARA CONTROLAR LA BUSQUEDA DE CLIENTES
//---------------------------------------------------------------------------------------------
/**
 * Agrega la funcionalidad a todas las cajas de busqueda 
 */
const searchBoxController = () => {
  const searchBoxs = document.querySelectorAll('.search-box');

  //Se agrega la funcialidad de mostrar u ocultar la caja de resultados
  searchBoxs.forEach(searchBox => {
    let input = searchBox.querySelector('.search-box__search');
    let container = searchBox.querySelector('.search-box__result');
    let footer = searchBox.querySelector('.search-box__count');

    input.addEventListener('focus', () => {
      container.classList.add('show');
      footer.style.display = 'block';
      input.select();
    });

    input.addEventListener('blur', () => {
      container.classList.remove('show');
      footer.removeAttribute('style');
    })

    input.addEventListener('input', () => {
      if (input.value) {
        let result = customers.filter(c => textInclude(`${c.firstName} ${c.lastName}`, input.value));
        printCustomerResult(container, result);
        footer.innerText = `Clientes: ${result.length}`;
      } else {
        printCustomerResult(container, customers);
        footer.innerText = `Clientes: ${customers.length}`;
      }
    });



    printCustomerResult(container, customers);
    // footer.innerText = `Clientes: ${customers.length}`;
  });
}

/**
 * Se encarga de hacer la peticion al servidor sobre los datos de los clientes
 */
const reloadCustomerList = async () => {
  await fetch('./api/all_customers.php')
    .then(res => res.json())
    .then(res => {
      console.log('Procesando peticion');
      if (res.sessionActive) {
        createCustomers(res.customers);
        reports = res.reports;
      } else {
        location.reload();
      }//Fin de if-else
    });//Fin de fetch
}//Fin del metodo

/**
 * Este metodo actualiza la caja de resultado segun lo que está en en input de
 * la seccion
 * @param {JSON} searchBox Seccion para buscar y seleccionar cliente 
 */
const updateSearchBoxResult = searchBox => {
  let input = searchBox.querySelector('.search-box__search');
  let container = searchBox.querySelector('.search-box__result');
  let footer = searchBox.querySelector('.search-box__count');

  if (input.value) {
    let result = customers.filter(c => textInclude(c.firstName, input.value));
    printCustomerResult(container, result);
    footer.innerText = `Clientesd: ${result.length}`;
  } else {
    printCustomerResult(container, customers);
    footer.innerText = `Clientesd: ${customers.length}`;
  }
}

/**
 * Crear las instancias de Customer que luego son utilizadas por cada uno de los metodos
 * @param {array} customersData Los datos de los clientes
 */
const createCustomers = customersData => {
  customers = [];

  customersData.forEach(data => {
    let customer = new Customer(data.id, data.firstName, data.lastName, data.nit, data.phone, data.email, data.points);

    //Ahora agrego los creditos
    data.credits.forEach(credit => {
      customer.addCredit(credit.id, credit.creditDate, credit.description, credit.amount, credit.balance);
    })

    //Ahora agrego los abonos
    data.payments.forEach(payment => {
      customer.addPayment(payment.id, payment.paymentDate, payment.amount, payment.cash);
    })
    customer.defineState();
    customers.push(customer);
  });
}//Fin del metodo

/**
 * Actualiza los datos del cliente que han sido actualizados en el servidor
 * @param {number} customerId identificador del cliente a actualizar
 * @param {JSON} customerData Datos obtenidos por el servidor
 */
const updateCustomer = (customerId, customerData) => {
  if (customers.some(c => c.id === customerId)) {
    let customer = customers.filter(c => c.id === customerId)[0];
    customer.update(customerData);
  }
}

//---------------------------------------------------------------------------------------------
//                  CODIGOS PARA PINTAR EN PANTALLA
//---------------------------------------------------------------------------------------------
/**
 * Actualiza la caja de resultados que aparece cuando la caja de busqueda obtiene el foco.
 * @param {object} searchBoxResult Elemento del DOM en el que se van a agregar los resultados
 * @param {array} result Arreglo con los clientes producto de la busqueda
 */
const printCustomerResult = (searchBoxResult, result) => {
  let htmlCode = '';
  result.forEach(customer => {

    let cardState = '';
    if (customer.inactive) {
      cardState = 'customer-card--inactive';
    } else if (customer.deliquentBalance) {
      cardState = 'customer-card--late';
    }

    let colorPoint = customer.points < 0 ? 'style="color: red;"' : '';

    htmlCode += `
        <div class="customer-card ${cardState}" customer_id = "${customer.id}">
            <div class="customer-card__header">
                <h3 class="customer-card__name">${customer.firstName}  ${customer.lastName}</h3>
                <p class="customer-card__info">${customer.state}</p>
            </div>
            <p class="customer-card__balance">${formatCurrencyLite(customer.balance, 0)}</p>
            <div>
              <p class="customer-card__debts">Creditos: ${customer.credits.length}</p>
              <p class="customer-card__points">Abonos: ${customer.payments.length}</p>
              <p class="customer-card__points" ${colorPoint}>Puntos: ${customer.points}</p>
            </div>
        </div>`
  });

  searchBoxResult.innerHTML = htmlCode;

  //Ahora a cada una de esas tarjeta se agrega el evento para recuperar el id
  let cards = searchBoxResult.querySelectorAll('.customer-card');
  cards.forEach(card => {
    card.addEventListener('click', e => {
      //LLegado a este punto necesito recuperar el id del cliente asociado a la tarjeta
      let element = e.target; //Recupero el elemento que disparó el evento
      let counter = 0;
      let maxLength = e.path.length;
      // console.log(element)
      while (!element.getAttribute('customer_id')) {
        counter++;
        element = element.parentNode;
        if (counter === maxLength) {
          break;
        }
      }//Fin de while

      customerSelected = parseInt(element.getAttribute('customer_id'));
      // console.log(customerSelected);

      loadCustomer();
      updateAllCustomerCards();
      printCustomerHistory();
    });//Fin de addEventListener
  });//Fin de forEach
}//Fin del metodo

/**
 * Este metodo lo que hace es montar los datos del cliente en la vista 
 * para actualizar los datos
 */
const loadCustomer = () => {
  const updateName = document.getElementById('updateName');
  const updateLastname = document.getElementById('updateLastname');
  const updateNit = document.getElementById('updateNit');
  const updatePhone = document.getElementById('updatePhone');
  const updateEmail = document.getElementById('updateEmail');

  if (
    customerSelected
    && !isNaN(customerSelected)
    && customerSelected > 0
    && customers.some(c => c.id === customerSelected)) {
    let customer = customers.filter(c => c.id === customerSelected)[0];
    updateName.value = customer.firstName;
    updateLastname.value = customer.lastName;
    updateNit.value = customer.nit;
    updatePhone.value = customer.phone;
    updateEmail.value = customer.email;
  }
}

/**
 * Actualiza las tarjetas de cliente en los formularios de actualizacion o de
 * visualizacion de creditos
 * @param {object} card Nodo del DOM a Actualizar
 */
const updateCustomerCard = card => {
  let htmlCode = '';
  let cardState = '';
  if (
    customerSelected
    && !isNaN(customerSelected)
    && customerSelected > 0
    && customers.some(c => c.id === customerSelected)) {
    let customer = customers.filter(c => c.id === customerSelected)[0];

    if (customer.inactive) {
      cardState = 'customer-card--inactive';
    } else if (customer.deliquentBalance) {
      cardState = 'customer-card--late';
    }

    let colorPoint = customer.points < 0 ? 'style="color: red;"' : '';
    htmlCode = `
        <div class="customer-card__header">
            <h3 class="customer-card__name">${customer.firstName} ${customer.lastName}</h3>
            <p class="customer-card__info">${customer.state}</p>
        </div>
        <p class="customer-card__balance">${formatCurrencyLite(customer.balance, 0)}</p>
        <div>
            <p class="customer-card__debts">Creditos: ${customer.credits.length}</p>
            <p class="customer-card__points">Abonos: ${customer.payments.length}</p>
            <p class="customer-card__points" ${colorPoint}>Puntos: ${customer.points}</p>
        </div>`;
  } else {
    htmlCode = `
        <div class="customer-card__header">
            <h3 class="customer-card__name">Selecciona un cliente</h3>
            <p class="customer-card__info"></p>
        </div>
        <p class="customer-card__balance">$ 0</p>
        <div>
            <p class="customer-card__debts">Creditos: x</p>
            <p class="customer-card__points">Abonos: x</p>
            <p class="customer-card__points">Puntos: x</p>
        </div>`;
    customerSelected = undefined;
  }

  card.innerHTML = htmlCode;
  card.removeAttribute('class');
  card.classList.add('customer-card');

  if (cardState) {
    card.classList.add(cardState);
  }

}

const defineTime = (credits, payments) => {
  let lastDate = '';
  let state = '';
  let time = '';

  //En este punto se define la fecha anterior
  if (credits.length > 0) {
    lastDate = credits[0].date;
    if (payments.length > 0) {
      let indexCredit = 0;
      let indexPayment = 0;
      let balance = 0;
      do {
        let credit = credits[indexCredit];
        let payment = payments[indexPayment];
        if (credit.date <= payment.date) {
          balance += credits.amount;
        } else {
          balance -= payment.amount;
          indexPayment++;
          if (balance === 0) {
            lastDate = credit.date;
          } else {
            lastDate = payment.date;
          }
        }//Fin de if else

        indexCredit++;
      } while (indexCredit < credits.length && indexPayment < payments.length);
    }//Fin de if
  }//Fin de if

  if (lastDate) {

  } else {
    state = 'customer-card--inactive';
  }

  return lastDate;
}

/**
 * Metodo que se encarga de actualizar los datos del historial del cliente
 * en la vista de customerConsult
 */
const printCustomerHistory = () => {
  updateDebtHistory();
  updatePaymentsHistory();
}

/**
 * Se encarga de mostrar las tarjetas de las deudas: si todas, si solo las
 * pendientes o si solo las canceldas
 */
const updateDebtHistory = () => {
  const consultDebtsOutstanding = document.getElementById('consultDebtsOutstanding');
  const consultDebtsPaid = document.getElementById('consultDebtsPaid');
  const debtsHistory = document.getElementById('debtsHistory');
  const debtSumary = document.getElementById('debtsSumary');
  let htmlCode = '';
  let creditSumary = '0 creditos | $ 0'

  if (customerSelected && customers.some(c => c.id === customerSelected)) {
    let customer = customers.filter(c => c.id === customerSelected)[0];
    let credits = [];
    let totalAmount = 0;

    if (consultDebtsOutstanding.checked) {
      customer.credits.forEach(credit => {
        if (credit.balance > 0) {
          credits.push(credit);
          totalAmount += credit.amount;
        }
      });//Fin de forEach
    } else if (consultDebtsPaid.checked) {
      customer.credits.forEach(credit => {
        if (credit.balance === 0) {
          credits.push(credit);
          totalAmount += credit.amount;
        }
      })//Fin de forEach
    } else {
      customer.credits.forEach(credit => {
        credits.push(credit);
        totalAmount += credit.amount;
      });//Fin de forEach
    }

    if (credits.length > 0) {
      if (credits.length === 1) {
        creditSumary = `1 credito | ${formatCurrencyLite(totalAmount, 0)}`;
      } else {
        creditSumary = `${credits.length} creditos | ${formatCurrencyLite(totalAmount, 0)}`;
      }
    }

    credits.forEach(credit => {
      htmlCode += `
            <div class="debt-card">
                <p class="debt-card__title">${credit.description}</p>
                <p class="debt-card__date">${moment(credit.date).calendar()} (${moment(credit.date).fromNow()})</p>
                <p class="debt-card__label">Valor Inicial</p>
                <p class="debt-card__label">Saldo pendiente</p>
                <p class="debt-card__money">${formatCurrencyLite(credit.amount, 0)}</p>
                <p class="debt-card__money debt-card__money--bold">${formatCurrencyLite(credit.balance, 0)}</p>
            </div>`
    })
  }//Fin de if

  debtsHistory.innerHTML = htmlCode;
  debtSumary.innerText = creditSumary;
}

/**
 * Se encarga de imprimir en pantalla el historial de pago del cliente
 */
const updatePaymentsHistory = () => {
  const paymentsHistory = document.getElementById('paymentsHistory');
  const paymentsSumary = document.getElementById('paymentsSumary');
  let htmlCode = '';
  let sumary = '0 abonos | $ 0';

  if (customerSelected && customers.some(c => c.id === customerSelected)) {
    let customer = customers.filter(c => c.id === customerSelected)[0];
    let totalAmount = 0;

    customer.payments.forEach(payment => {
      htmlCode += `
            <div class="payment-row">
                <p class="paymen-row__date">${moment(payment.date).calendar()}</p>
                <p class="payment-row__amount">${formatCurrencyLite(payment.amount, 0)}</p>
            </div>`;

      totalAmount += payment.amount;
    });//Fin de forEach

    if (totalAmount > 0) {
      if (customer.payments.length === 1) {
        sumary = `1 abono | ${formatCurrencyLite(totalAmount, 0)}`;
      } else {
        sumary = `${customer.payments.length} abonos | ${formatCurrencyLite(totalAmount, 0)}`;
      }
    }
  }

  paymentsHistory.innerHTML = htmlCode;
  paymentsSumary.innerText = sumary;
}

/**
 * Actualiza las tarjeta con la informacion del cliente que aparece en los formularios
 * para nuevo credito o abono y la tarjeta que aparece en consulta de creditos
 */
const updateAllCustomerCards = () => {
  updateCustomerCard(document.getElementById('newPaymentCustomer'));
  updateCustomerCard(document.getElementById('newDebtCustomer'));
  updateCustomerCard(document.getElementById('consultDebtsCustomer'));
}

//---------------------------------------------------------------------------------------------
//                  CODIGO PARA CONTROLAR LA VISTA DE RESUMEN
//---------------------------------------------------------------------------------------------
const sumaryController = () => {
  fetch('./api/all_customers.php')
    .then(res => res.json())
    .then(res => {
      console.log('Procesando peticion');
      if (res.sessionActive) {
        createCustomers(res.customers);
        updateCharts();
      } else {
        location.reload();
      }//Fin de if-else
    });//Fin de fetch
}

const printCharts = () => {
  var ctx = document.getElementById('myChart');
  let bgColors = [
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 99, 132, 0.2)'
  ];

  let borderColor = [
    'rgba(54, 162, 235, 1)',
    'rgba(255, 99, 132, 1)'
  ];
  printDoughnutChart(ctx, 'Actividad de los clientes', [200, 79], ['Activos', 'Inactivos'], bgColors, borderColor);
  let ctx2 = document.getElementById('myChart2');
  printDoughnutChart(ctx2, 'Morosidad', [75, 125], ['Al día', 'Morosos'], bgColors, borderColor);
  let ctx3 = document.getElementById('myChart3');
  printDoughnutChart(ctx3, 'Morosidad', [9, 70], ['Al día', 'Con deudas'], bgColors, borderColor);
  let ctx4 = document.getElementById('myChart4');
  printBarChart(ctx4);
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
}

const updateCharts = () => {
  updateCustomerSumary();
}

/**
 * Este metodo actualiza los datos de los dos primeros graficos
 */
const updateCustomerSumary = () => {

  //Se recuperan los graficos
  const customerSumary = document.getElementById('customerSumary');
  const delinquentCustomers = document.getElementById('delinquentCustomers');
  const collectionDificulty = document.getElementById('collectionDificulty');
  const cashFlowQuinquenal = document.getElementById('cashFlowQuinquenal');

  //Se definen los colores
  let bgBlue = 'rgba(54, 162, 235, 0.2)';
  let borderBlue = 'rgba(54, 162, 235, 1)';

  let bgRed = 'rgba(255, 99, 132, 0.2)';
  let borderRed = 'rgba(255, 99, 132, 1)';

  let bgGreen = 'rgba(46, 204, 113,0.2)';
  let borderGreen = 'rgba(46, 204, 113,1)';

  let bgYellow = 'rgba(241, 196, 15,0.2)';
  let borderYellow = 'rgba(241, 196, 15,1.0)';

  let bgOrange = 'rgba(211, 84, 0, 0.2)'
  let borderOrange = 'rgba(211, 84, 0, 1)'

  let bgColors = [
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 99, 132, 0.2)'
  ];

  let borderColor = [
    'rgba(54, 162, 235, 1)',
    'rgba(255, 99, 132, 1)'
  ];

  //Se recuperan las variables
  let activeCustomers = 0;
  let activeAmount = 0;

  let inactiveCustomers = 0;

  let delinquentCustomersCount = 0;
  let delinquentAmount = 0;

  let correctCustomers = 0;
  let corretAmount = 0;

  let easyCollect = 0;
  let easyAmount = 0;

  let moderateCollect = 0;
  let moderateAmount = 0;

  let dificultCollect = 0;
  let dificultAmount = 0;

  let veryDificultColllect = 0;
  let veryDificultAmount = 0;

  customers.forEach(customer => {
    if (customer.inactive) {
      inactiveCustomers++;
    } else {
      activeCustomers++;
      activeAmount += customer.balance;
      if (customer.deliquentBalance) {
        delinquentCustomersCount++;
        delinquentAmount += customer.balance;
      } else {
        correctCustomers++;
        corretAmount += customer.balance;
      }

      if (customer.paymentFrecuency < 30) {
        easyCollect++;
        easyAmount += customer.balance;
      } else if (customer.paymentFrecuency < 60) {
        moderateCollect++;
        moderateAmount += customer.balance;
      } else if (customer.paymentFrecuency < 90) {
        dificultCollect++;
        dificultAmount += customer.balance;
      } else {
        veryDificultColllect++;
        veryDificultAmount += customer.balance;
      }
    }
  })//Fin de forEach

  //Se actualizan las graficas
  printDoughnutChart(customerSumary, '', [activeCustomers, inactiveCustomers], ['Activos', 'Inactivos'], bgColors, borderColor);

  printDoughnutChart(delinquentCustomers, '', [correctCustomers, delinquentCustomersCount], ['Al día', 'Morosos'], [bgGreen, bgRed], [borderGreen, borderRed]);

  printDoughnutChart(collectionDificulty, '', [easyCollect, moderateCollect, dificultCollect, veryDificultColllect], ['Facil', 'Moderado', 'Dificil', 'Muy dificil'], [bgGreen, bgYellow, bgOrange, bgRed], [borderGreen, borderYellow, borderOrange, borderRed]);


  //Ahora se actualiza el diagrama de barras
  let reportLength = reports.length;
  let labels = [];
  let credits = [];
  let payments = [];

  let lastReports = [reports[reportLength - 4], reports[reportLength - 3], reports[reportLength - 2], reports[reportLength - 1]];

  lastReports.forEach(r => {
    let until = moment(r.until, 'YYYY-M-DD').subtract(1, 'days');
    let label = `${until.format('MMMM DD')}`;

    labels.push(label);
    credits.push(r.creditAmount);
    payments.push(r.paymentAmount);
  })


  let barCharData = {
    labels,
    datasets: [{
      label: 'Abonos',
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1,
      data: payments
    }, {
      label: 'Creditos',
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1,
      data: credits
    }]
  }

  printBarChart(cashFlowQuinquenal, barCharData);

  //Se actualizan las leyendas de las graficas 
  let activePercentage = customers.length > 0
    ? Math.floor((activeCustomers / customers.length) * 100)
    : 0;

  let deliquentPercentage = activeCustomers > 0
    ? Math.floor((delinquentCustomersCount / activeCustomers) * 100)
    : 0;

  let correctPercentage = activeCustomers > 0
    ? Math.floor((correctCustomers / activeCustomers) * 100)
    : 0;

  let easyPercentage = activeCustomers > 0
    ? Math.floor((easyCollect / activeCustomers) * 100)
    : 0;

  let moderatePercentage = activeCustomers > 0
    ? Math.floor((moderateCollect / activeCustomers) * 100)
    : 0;

  let dificultPercentage = activeCustomers > 0
    ? Math.floor((dificultCollect / activeCustomers) * 100)
    : 0;

  let veryDificultPercentage = activeCustomers > 0
    ? Math.floor((veryDificultColllect / activeCustomers) * 100)
    : 0;

  document.getElementById('customerSumaryInfo').innerHTML = `El <span class="history__card__bold">${activePercentage}%</span> de los clientes del sistema se encuentran activos con un saldo deudor que asciende a <span class="history__card__bold">${formatCurrencyLite(activeAmount, 0)}</span>`;

  document.getElementById('delinquentCustomersInfo').innerHTML = `El <span class="history__card__bold">${correctPercentage}%</span> de los clientes activos se encuentran al día con un saldo pendiente total de <span class="history__card__bold">${formatCurrencyLite(corretAmount, 0)}</span>; mientras que el <span class="history__card__bold">${deliquentPercentage}%</span> presentan un saldo en mora de <span class="history__card__bold">${formatCurrencyLite(delinquentAmount, 0)}</span>`;

  document.getElementById('collectionDificultyInfo').innerHTML = `El <span class="history__card__bold">${easyPercentage}% (${formatCurrencyLite(easyAmount, 0)})</span> presentan una frecuencia de pago menor a 30 días;<br>El <span class="history__card__bold">${moderatePercentage}% (${formatCurrencyLite(moderateAmount, 0)})</span> presenta una frecuencia de pago entre 30 y 60 días;<br>El <span class="history__card__bold">${dificultPercentage}% (${formatCurrencyLite(dificultAmount, 0)})</span> presentan una frecuencia de pago entre 60 y 90 día.<br>El <span class="history__card__bold">${veryDificultPercentage}% (${formatCurrencyLite(veryDificultAmount, 0)})</span> presentan una frecuencia de pago superior a 90 días.`;
}//Fin del metodo

const printDoughnutChart = (ctx, title, data, labels, bgColors, borderColor) => {
  let displayTitle = false;
  if (title) {
    displayTitle = true;
  }
  myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: bgColors,
        borderColor,
        borderWidth: 1
      }]//Fin del datasets
    },
    options: {
      resposive: true,
      title: {
        display: displayTitle,
        text: title
      }
    }//Fin de option
  });//Fin de Chart
}

const printBarChart = (ctx, barCharData) => {

  let myBar = new Chart(ctx, {
    type: 'bar',
    data: barCharData,
    options: {
      resposive: true,
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Flujo de efectivo'
      },
      tooltips: {
        callbacks: {
          label: function (tooltipItem, data) {
            var label = data.datasets[tooltipItem.datasetIndex].label || '';

            if (label) {
              label += ': ';
            }
            // label += Math.round(tooltipItem.yLabel * 100) / 100;
            label += formatCurrencyLite(tooltipItem.yLabel);
            return label;
          }
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            // Include a dollar sign in the ticks
            callback: function (value, index, values) {
              return formatCurrencyLite(value, 0);
            }
          }
        }]
      }
    }
  })
}

//--------------------------------------------------------------------------
//	METODOS PRIVADOS PARA RECUPERAR DATOS DE CLIENTES
//--------------------------------------------------------------------------
const printCustomerInfo = () => {
  let text = "";
  customers.forEach(customer => {
    text += `${customer.id}\t${customer.firstName}\t`
    text += `${customer.lastName}\t${customer.nit}\t`
    text += `${customer.phone}\t${customer.email}\t`
    text += `${Math.ceil(customer.points)}\t${Math.ceil(customer.paymentFrecuency)}\n`
  })

  console.log(text);
}

const printDelinquentCustomers = () => {
  let text = "";
  let delinquent = customers.filter(c => c.balance > 0);
  delinquent.sort((c1, c2) => c2.balance - c1.balance);

  delinquent.forEach(c => {
    text += `${c.firstName} ${c.lastName}\t${c.balance}\t${c.state}\n`;
  })

  console.log(text);
}

const printCustomerOrderByPaymentFrecuency = () => {
  let text = "";
  customers.sort((c1, c2) => c2.paymentFrecuency - c1.paymentFrecuency);
  customers.forEach(c => {
    text += `${c.id}\t${c.firstName} ${c.lastName}\t${c.balance}\t${c.state}\n`;
  })

  console.log(text);
}

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

//---------------------------------------------
//  COMPONENTES
//---------------------------------------------
/**
 * Componente reutilizable para notoficarle al usuario
 * que la peticion fue enviada al servidor y se está esperando
 * una respuestas. Requiere que se le pasa la propiedad visible
 */
Vue.component('waiting-modal', {
  props:['visible'],
  template:`
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
  props:['processResult'],
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
      processResult: {visible: false, hasError:false, message:''},
      //los campos para el formulario
      firstName: new DataInput(),
      lastName: new DataInput(),
      nit: new DataInput(),
      phone: new DataInput(),
      email: new DataInput(),
    }
  },
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
                <td class="table__data table--25">{{customer.phone}}</td>
                <td class="table__data table--25" @click.stop="">
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
        firstName.isCorret();
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
          nit.isCorret()
        }
      } else {
        nit.isCorret();
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
          phone.isCorret();
        }
      } else {
        phone.isCorret();
      }

      return true;
    },
    validateEmail() {
      let email = this.email;
      if (email.value && typeof email.value === 'string') {
        console.log(email.value)
        if (/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(email.value)) {
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
            email.isCorret();
          }
        } else {
          email.isIncorrect('Ingresa una dirección de correo valida');
          return false;
        }
      } else {
        email.isCorret();
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

            if(data.sessionActive){
              if(data.request){
                this.waiting = false;
                this.processResult.visible = true;
                this.processResult.hasError = false;
                this.processResult.message = "Cliente actualizado";
                
                this.$emit('update-customer', data.customer);
                this.discardUpdate();
              }else{
                this.waiting = false;
                this.processResult.visible = true;
                this.processResult.hasError = true;
                this.processResult.message = "No se pudo actualizar";
              }
            }else{
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

            if(data.sessionActive){
              if(data.request){
                let actualCount = this.customers.length;       
                this.$emit('new-customer');   
                let timerId = setInterval(() => {
                  if(actualCount < this.customers.length){
                    this.waiting = false;
                    this.processResult.visible = true;
                    this.processResult.hasError = false;
                    this.processResult.message = "Cliente Agregado satisfactoriamente";
                    this.resetForm();
                    clearInterval(timerId);
                  }
                  console.log('Repitiendo: ' + actualCount )
                }, 1000);

                
              }else{
                this.processResult.visible = true;
                this.processResult.hasError = true;
                this.processResult.message = "No se pudo crear al cliente";
              }
            }else{
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
})

Vue.component('customer-card', {
  props:['customer'],
  methods:{
    formatCurrency(value) {
      var formatted = new Intl.NumberFormat("es-Co", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
      }).format(value);
      return formatted;
    }, //Fin del metodo,
  },
  computed:{
    classState(){
      if(this.customer.inactive){
        return{'customer-card--inactive': true};
      }else if(this.customer.deliquentBalance){
        return{'customer-card--late': true};
      }

      return {success:false};
    }
  },
  template:`
  <div class="customer-card" :class="classState">
    <div class="customer-card__header">
      <h3 class="customer-card__name">{{customer.firstName + ' ' + customer.lastName}}</h3>
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

Vue.component('search-box',{
  props:['customers'],
  data: function(){
    return {
      customerSelected: new Customer(0,''),
    }
  },//Fin de data
  methods:{

  },//Fin de methods
  template: `
  <div class="search-box">
    <input type="text" class="search-box__search" placeholder="Buscar Cliente por Nombre">
    <div class="search-box__content show">
      <div class="search-box__result scroll show">
        <customer-card v-for="customer in customers" :key="customer.id" :customer="customer"></customer-card>
      </div>
      <p class="search-box__count show">Clientes: <span class="text-bold">{{customers.length}}</span></p>
    </div>
    <div class="search-box__selected">
      <customer-card :customer="customerSelected"></customer-card>
    </div>
  </div>`
})

//---------------------------------------------
//  RAIZ DE LA APLICACION
//---------------------------------------------
const app = new Vue({
  el: '#app',
  data: {
    customers: [],
    modals:{
      waiting: new WaitingModal(),
    }
  },
  methods: {
    /**
     * Este metodo se ejecuta cuando se recibe el evento emitido por el modulo
     * para crear y actualizar clientes y se encarga de actualizar los
     * datos del cliente que el servidor ya procesó
     * @param {object} data Objeto devulto por l servidor con los datos del cliente actualizado
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

