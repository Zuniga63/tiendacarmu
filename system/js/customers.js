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
 * Listado de clientes recuperados de la base de datos
 */
let customers = [];

/**
 * Corresponde al identificador del cliente seleccionado
 */
let customerSelected = undefined;

/**
 * Clase view que permite cntrolar las vistas
 */
class View {
    constructor(id, link, view) {
        this.id = id,
            this.link = document.getElementById(link),
            this.view = document.getElementById(view)
    }

    show() {
        if ((this.link && this.link.classList) && (this.view && this.view.classList)) {
            this.link.classList.add(ACTIVE_LINK);
            this.view.classList.add(VIEW_SHOW);
        }
    }

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
    constructor(id = 0, firstName, lastName = '', nit = '', phone = '', email = '', points = 0) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.nit = nit;
        this.phone = phone;
        this.email = email;
        this.points = points;
        this.credits = [];
        this.payments = [];
        this.balance = 0
    }

    addCredit(id, creditDate, amount, balance) {
        let credit = new Credit(id, creditDate, amount, balance);
        this.credits.push(credit);
        this.balance += amount;
    }

    addPayment(id, paymentDate, amount, cash) {
        let payment = new Payment(id, paymentDate, amount, cash);
        this.payments.push(payment);
        this.balance -= amount;
    }

    toString() {
        return this.firstName;
    }
}

class Transaction {
    constructor(id, transactionDate, amount) {
        this.id = id;
        this.date = transactionDate;
        this.amount = amount;
    }
}

class Credit extends Transaction {
    constructor(id, creditDate, amount, balance) {
        super(id, creditDate, amount);
        this.balance = balance;
    }
}

class Payment extends Transaction {
    constructor(id, paymentDate, amount, cash) {
        super(id, creditDate, amount);
        this.cash = cash;
    }
}



//---------------------------------------------------------------------------------------------
//                  LOADING SECTION
//---------------------------------------------------------------------------------------------
window.addEventListener('load', async () => {
    await reloadCustomerList();
    viewController();
    newCustomerController();
    searchBoxController();
})

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

const printDoughnutChart = (ctx, title, data, labels, bgColors, borderColor) => {
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
                display: true,
                text: title
            }
        }//Fin de option
    });//Fin de Chart
}

const printBarChart = (ctx) => {
    let labels = ['Enero', 'Febrero', 'Marzo'];
    let data1 = [1100000, 1200000, 3000000];
    let data2 = [900000, 500000, 3400000];

    let barCharData = {
        labels,
        datasets: [{
            label: 'Recaudos',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
            data: data1
        }, {
            label: 'Otorgados',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            data: data2
        }]
    }

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
            scales: {
                yAxes: [{
                    ticks: {
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

//---------------------------------------------------------------------------------------------
//                  CODIGO PARA CONTROLAR LAS VSITAS
//---------------------------------------------------------------------------------------------


const VIEWS = {
    sumary: new View('sumary', 'sumaryLink', 'sumary'),
    newCustomer: new View('newCustomer', 'newCustomerLink', 'newCustomer'),
    newPayment: new View('newPayment', 'newPaymentLink', 'newPayment'),
    newDebt: new View('newDebt', 'newDebtLink', 'newDebt'),
    customerUpdate: new View('customerUpdate', 'customerUpdateLink', 'customerUpdate'),
    consultDebts: new View('consultDebts', 'consultDebtsLink', 'consultDebts')

};

/**
 * Este metodo realiza todo lo requerido para mostrar una vista al clientes
 * cada vez que haga click en alguno de los enlaces
 * @param {string} viewName Nombre de la vista que se desea mostrar
 */
const showView = (viewName = 'sumary') => {
    //Antes que nada se ocultan todas las vistas
    let views = Object.values(VIEWS);
    views.forEach(view => {
        view.hidden();
    });

    switch (viewName) {
        case 'newCustomer': {
            VIEWS.newCustomer.show();
            systemLegend.innerText = 'Nuevo Cliente';

            //Se actualiza el localStorages
            localStorage.actualView = viewName;
        } break;//Fin del caso 1
        case 'newPayment': {
            VIEWS.newPayment.show();
            systemLegend.innerText = 'Registrar Abono'
            localStorage.actualView = viewName;
        } break;//Fin del caso 2
        case 'newDebt': {
            VIEWS.newDebt.show();
            systemLegend.innerText = 'Registrar Credito'
            localStorage.actualView = viewName;
        } break;//Fin del caso 3
        case 'customerUpdate': {
            VIEWS.customerUpdate.show();
            systemLegend.innerText = 'Actulizar Clientes';
            localStorage.actualView = viewName;
        } break; //Fin del caso 4
        case 'consultDebts': {
            VIEWS.consultDebts.show();
            systemLegend.innerText = 'Consultar Creditos';
            localStorage.actualView = viewName;
        } break;//Fin del caso 5
        default: {
            VIEWS.sumary.show();
            systemLegend.innerText = 'Resumen';

            //Se cargan los graficos
            printCharts();
            localStorage.actualView = 'sumary';
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

    //El link que muestra el resumen
    VIEWS.sumary.link.addEventListener('click', async () => {
        showView();
        await reloadCustomerList();
    });

    //El link que muestra el formulario para nuevo clientes
    VIEWS.newCustomer.link.addEventListener('click', async () => {
        showView('newCustomer');
        await reloadCustomerList();
    })

    VIEWS.newPayment.link.addEventListener('click', async () => {
        showView('newPayment');
        await reloadCustomerList();
        updateCustomerCard(document.getElementById('newPaymentCustomer'));
    })

    VIEWS.newDebt.link.addEventListener('click', async () => {
        showView('newDebt');
        await reloadCustomerList();
        updateCustomerCard(document.getElementById('newDebtCustomer'));
    })

    VIEWS.customerUpdate.link.addEventListener('click', async () => {
        showView('customerUpdate');
        await reloadCustomerList();
    })

    VIEWS.consultDebts.link.addEventListener('click', async () => {
        showView('consultDebts');
        await reloadCustomerList();
        updateCustomerCard(document.getElementById('consultDebtsCustomer'));
    })
}

//---------------------------------------------------------------------------------------------
//                  CODIGOS PARA CREAR NUEVOS CLIENTE
//---------------------------------------------------------------------------------------------
let newCustomerProcessEnd = true;

const newCustomerController = () => {
    const newCustomerForm = document.getElementById('newCustomerForm');

    //Agrego la funcionalidad para seleccionar el texto en su interior
    selectText(document.getElementById('newCustomerFirstName'));
    selectText(document.getElementById('newCustomerLastName'));
    selectText(document.getElementById('newCustomerNit'));
    selectText(document.getElementById('newCustomerPhone'));
    selectText(document.getElementById('newCustomerEmail'));

    //Ahora se agrega la funcionalidad al formulario
    newCustomerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (newCustomerProcessEnd) {
            const data = new FormData(newCustomerForm);                 //Para el cuerpo de la peticion
            const alert = document.getElementById('newCustomerAlert');  //Para mostrar el resultado
            const btn = document.getElementById('newCustomerBtn');      //Para hacer modificaciones al texto

            /**
             * Se procede a hacer la solicitud si el nombre del nuevo cliente
             * no se encuentra en blanco
             */
            if (data.get('first_name').trim()) {
                //Lo siguiente es para evitar que se hagan nuevas mientras se procesa
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
                            writeAlert(alert, 'success', 'Cliente agregado satisfactoriamente');
                            newCustomerForm.reset();
                        } else {
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

//---------------------------------------------------------------------------------------------
//                  CODIGO PARA CONTROLAR LA BUSQUEDA DE CLIENTES
//---------------------------------------------------------------------------------------------
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
        });

        input.addEventListener('blur', () => {
            container.classList.remove('show');
            footer.removeAttribute('style');
        })

        input.addEventListener('input', () => {
            if (input.value) {
                let result = customers.filter(c => textInclude(c.firstName, input.value));
                printCustomerResult(container, result);
                footer.innerText = `Clientes: ${result.length}`;
            } else {
                printCustomerResult(container, customers);
                footer.innerText = `Clientes: ${customers.length}`;
            }
        })

        printCustomerResult(container, customers);
        footer.innerText = `Clientes: ${customers.length}`;
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
            } else {
                location.reload();
            }//Fin de if-else
        });//Fin de fetch
}//Fin del metodo

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
            customer.addCredit(credit.id, credit.creditDate, credit.amount, credit.balance);
        })

        //Ahora agrego los abonos
        data.payments.forEach(payment => {
            customer.addPayment(payment.id, payment.paymentDate, payment.amount, payment.cash);
        })

        customers.push(customer);
    });
}//Fin del metodo



//---------------------------------------------------------------------------------------------
//                  CODIGOS PARA PINTAR EN PANTALLA
//---------------------------------------------------------------------------------------------
/**
 * Actualiza el elemento del DOM para que coincida con el parametro de busqueda
 * @param {object} searchBoxResult Elemento del DOM en el que se van a agregar los resultados
 * @param {array} result Arreglo con los clientes producto de la busqueda
 */
const printCustomerResult = (searchBoxResult, result) => {
    let htmlCode = '';
    result.forEach(customer => {
        htmlCode += `
        <div class="customer-card" customer_id = "${customer.id}">
            <h3 class="customer-card__name">${customer.firstName}</h3>
            <p class="customer-card__balance">${formatCurrencyLite(customer.balance, 0)}</p>
            <div>
              <p class="customer-card__debts">Creditos: ${customer.credits.length}</p>
              <p class="customer-card__points">Puntos: ${customer.points}</p>
            </div>
        </div>`
    });

    searchBoxResult.innerHTML = htmlCode;

    //Ahora a cada una de esas tarjeta se aagrega el evento para recuperar el id
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

            updateAllCustomerCards();
        });//Fin de addEventListener
    });//Fin de forEach
}//Fin del metodo

/**
 * Actualiza las tarjetas de cliente en los formularios de actualizacion o de
 * visualizacion
 * @param {object} card Nodo del DOM a Actualizar
 */
const updateCustomerCard = card => {
    let htmlCode = '';
    if (
        customerSelected
        && !isNaN(customerSelected)
        && customerSelected > 0
        && customers.some(c => c.id === customerSelected)) {
        let customer = customers.filter(c => c.id === customerSelected)[0];
        htmlCode = `
        <h3 class="customer-card__name">${customer.firstName}</h3>
        <p class="customer-card__balance">${formatCurrencyLite(customer.balance, 0)}</p>
        <div>
            <p class="customer-card__debts">Creditos: ${customer.credits.length}</p>
            <p class="customer-card__points">Puntos: ${customer.points}</p>
        </div>`;
    } else {
        htmlCode = `
        <h3 class="customer-card__name">Selecciona un cliente</h3>
        <p class="customer-card__balance">$ 0</p>
        <div>
            <p class="customer-card__debts">Creditos: x</p>
            <p class="customer-card__points">Puntos: x</p>
        </div>`;
        customerSelected = undefined;
    }

    card.innerHTML = htmlCode;

}

/**
 * Actualiza todas las tarjetas de clientes con los datos del cliente
 */
const updateAllCustomerCards = () => {
    updateCustomerCard(document.getElementById('newPaymentCustomer'));
    updateCustomerCard(document.getElementById('newDebtCustomer'));
    updateCustomerCard(document.getElementById('consultDebtsCustomer'));
}