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
        this.balance = 0;
    }

    addCredit(id, creditDate, description, amount, balance) {
        let credit = new Credit(id, creditDate, description, amount, balance);
        this.credits.push(credit);
        this.balance += amount;
    }

    addPayment(id, paymentDate, amount, cash) {
        let payment = new Payment(id, paymentDate, amount, cash);
        this.payments.push(payment);
        this.balance -= amount;
    }

    /**
     * Actualiza los datos del cliente despues de hacer modificaciones en la base de datos
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
    constructor(id, creditDate, description, amount, balance) {
        super(id, creditDate, amount);
        this.balance = balance;
        this.description = description;
    }
}

class Payment extends Transaction {
    constructor(id, paymentDate, amount, cash) {
        super(id, paymentDate, amount);
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
    newCreditController();
    newPaymentController();
    consultDebtsController();
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

            printCustomerHistory();
        } break;//Fin del caso 5
        default: {
            // VIEWS.sumary.show();
            // systemLegend.innerText = 'Resumen';

            // //Se cargan los graficos
            // printCharts();
            // localStorage.actualView = 'sumary';

            //lo siguiente es codigo temporal
            VIEWS.consultDebts.show();
            systemLegend.innerText = 'Consultar Creditos';
            localStorage.actualView = viewName;

            printCustomerHistory();
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
        //Funcionalidad deshabilitada
        // showView();
        // await reloadCustomerList();
    });

    //El link que muestra el formulario para nuevo clientes
    VIEWS.newCustomer.link.addEventListener('click', async () => {
        showView('newCustomer');
        await reloadCustomerList();
    })

    VIEWS.newPayment.link.addEventListener('click', async () => {
        showView('newPayment');
        await reloadCustomerList();
        let searchBox = VIEWS.newPayment.view.querySelector('.search-box');
        updateSearchBoxResult(searchBox);
        updateCustomerCard(document.getElementById('newPaymentCustomer'));
    })

    VIEWS.newDebt.link.addEventListener('click', async () => {
        showView('newDebt');
        await reloadCustomerList();
        let searchBox = VIEWS.newDebt.view.querySelector('.search-box');
        updateSearchBoxResult(searchBox);
        updateCustomerCard(document.getElementById('newDebtCustomer'));
    })

    VIEWS.customerUpdate.link.addEventListener('click', async () => {
        //Funcionalidad deshabilitada
        // showView('customerUpdate');
        // await reloadCustomerList();
        // let searchBox = VIEWS.customerUpdate.view.querySelector('.search-box');
        // updateSearchBoxResult(searchBox);
    })

    VIEWS.consultDebts.link.addEventListener('click', async () => {
        showView('consultDebts');
        await reloadCustomerList();
        let searchBox = VIEWS.consultDebts.view.querySelector('.search-box');
        updateSearchBoxResult(searchBox);
        updateCustomerCard(document.getElementById('consultDebtsCustomer'));
    })
}

//---------------------------------------------------------------------------------------------
//                  CODIGOS PARA MODIFICAR DATOS EN EL SERVIDOR
//---------------------------------------------------------------------------------------------
let newCustomerProcessEnd = true;
let newCreditProcessEnd = true;
let newPaymentProcessEnd = true;

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

const newCreditController = () => {
    //Recupero el el formulario
    const newCreditForm = document.getElementById('newCreditForm');

    /**
     * Se agrega la funcionalidad a la caja de texto para la descripcion del credito:
     * Que se seleccione el texto al obtener el foco
     * Actualice la logitud disponible 
     * Muestre una alerta cuando el campo queda vacío al perder el foco
     */

    const creditDescription = document.getElementById('creditDescription');
    const creditDescriptionLength = document.getElementById('creditDescriptionLength');
    const creditDescriptionAlert = document.getElementById('creditDescriptionAlert');
    selectText(creditDescription);
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
     * 
     */
    const creditAmount = document.getElementById('creditAmount');
    const creditAmountAlert = document.getElementById('creditAmountAlert');
    selectText(creditAmount);
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
            creditAmount.value = originalValue;
            creditAmountAlert.innerText = 'No tiene formato valido';
            creditAmountAlert.classList.add('show');
        }
    });

    newCreditForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (validateCredit() && newCreditProcessEnd) {
            const newCreditBtn = document.getElementById('newCreditBtn');
            const newCreditAlert = document.getElementById('newCreditAlert');
            let message = `Se va registrar un credito por valor de ${creditAmount.value}`;

            if (confirm(message)) {
                newCreditProcessEnd = false;                //Se notifica que se inicia el proceso
                newCreditBtn.value = "Procesando solicitud";

                //Se recuperan los datos
                let customerId = customerSelected;
                let description = creditDescription.value.trim();
                let amount = parseFloat(deleteFormaterOfAmount(creditAmount.value));
                let data = new FormData();

                //Ahora agrego la informacion al formulario
                data.append('customer_id', customerId);
                data.append('description', description);
                data.append('amount', amount);
                // console.log(`id:${customerId}||amount:${amount}`);

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
                                newCreditAlert.innerText = "Solicitud procesada saticfactoriamente";
                                newCreditAlert.classList.add('alert--success');

                                //Se actualizan los datos del cliente seleccionado
                                updateCustomer(customerId, res.customer);
                                newCreditForm.reset();
                                updateAllCustomerCards();

                                //Se actualiza tambien la caja de resultados para que sea consistente
                                let searchBox = VIEWS.newDebt.view.querySelector('.search-box');
                                updateSearchBoxResult(searchBox);
                            } else {
                                //S notifica al usuario que no se pudo crear el credito
                                newCreditAlert.innerText = "No se pudo crear el credito";
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

const newPaymentController = () => {
    const paymentAmount = document.getElementById('newPaymentAmount');
    const newPaymentForm = document.getElementById('newPaymentForm');

    selectText(paymentAmount);
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

    newPaymentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validatePayment() && newPaymentProcessEnd) {
            const newPaymentBtn = document.getElementById('newPaymentBtn');
            const newPaymentAlert = document.getElementById('newPaymentAlert');
            const newPaymentCashPayment = document.getElementById('newPaymentCashPayment');

            let customer = customers.filter(c => c.id === customerSelected)[0];
            let message = `Se va a realizar un abono al cliente ${customer.firstName} por valor de ${paymentAmount.value}`;

            if (confirm(message)) {
                //Se muestra en pantalla que el proceso inició
                newPaymentProcessEnd = false;
                newPaymentBtn.value = "Procesando Solicitud";

                //Se recuperan los datos
                let cashPayment = newPaymentCashPayment.checked;
                let amount = parseFloat(deleteFormaterOfAmount(newPaymentAmount.value));
                let customerId = customerSelected;
                console.log(cashPayment);

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

const consultDebtsController = () => {
    document.getElementById('consultDebtsAll').addEventListener('click', ()=>{
        updateDebtHistory();
    });
    document.getElementById('consultDebtsOutstanding').addEventListener('click', ()=>{
        updateDebtHistory();
    });
    document.getElementById('consultDebtsPaid').addEventListener('click', ()=>{
        updateDebtHistory();
    });
}

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

const deleteFormaterOfAmount = text => {
    let value = text.replace('$', '');
    value = value.split(".");
    value = value.join('');

    return value;
}//Fin del metodo

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
            input.select();
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
        });



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

const updateSearchBoxResult = searchBox => {
    let input = searchBox.querySelector('.search-box__search');
    let container = searchBox.querySelector('.search-box__result');
    let footer = searchBox.querySelector('.search-box__count');

    if (input.value) {
        let result = customers.filter(c => textInclude(c.firstName, input.value));
        printCustomerResult(container, result);
        footer.innerText = `Clientes: ${result.length}`;
    } else {
        printCustomerResult(container, customers);
        footer.innerText = `Clientes: ${customers.length}`;
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

        customers.push(customer);
    });
}//Fin del metodo

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
            printCustomerHistory();
        });//Fin de addEventListener
    });//Fin de forEach
}//Fin del metodo


/**
 * Actualiza las tarjetas de cliente en los formularios de actualizacion o de
 * visualizacion de creditos
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

const printCustomerHistory = () => {
    updateDebtHistory();   
    updatePaymentsHistory();
}

const updateDebtHistory = ()=>{
    const consultDebtsOutstanding = document.getElementById('consultDebtsOutstanding');
    const consultDebtsPaid = document.getElementById('consultDebtsPaid');
    const debtsHistory = document.getElementById('debtsHistory');
    const debtSumary = document.getElementById('debtsSumary');
    let htmlCode = '';
    let creditSumary = '0 creditos | $ 0'

    if(customerSelected && customers.some(c => c.id === customerSelected)){
        let customer = customers.filter(c => c.id === customerSelected)[0];
        let credits = [];
        let totalAmount = 0;

        if(consultDebtsOutstanding.checked){
            customer.credits.forEach(credit =>{
                if(credit.balance > 0){
                    credits.push(credit);
                    totalAmount += credit.amount;
                }
            });//Fin de forEach
        }else if(consultDebtsPaid.checked){
            customer.credits.forEach(credit => {
                if(credit.balance === 0){
                    credits.push(credit);
                    totalAmount += credit.amount;
                }
            })//Fin de forEach
        }else{
            customer.credits.forEach(credit => {
                credits.push(credit);
                totalAmount += credit.amount;
            });//Fin de forEach
        }

        if(credits.length > 0){
            if(credits.length === 1){
                creditSumary = `1 credito | ${formatCurrencyLite(totalAmount, 0)}`;
            }else{
                creditSumary = `${credits.length} creditos | ${formatCurrencyLite(totalAmount,0)}`;
            }
        }

        credits.forEach(credit => {
            htmlCode += `
            <div class="debt-card">
                <p class="debt-card__title">${credit.description}</p>
                <p class="debt-card__date">${credit.date}</p>
                <p class="debt-card__label">Valor Inicial</p>
                <p class="debt-card__label">Saldo pendiente</p>
                <p class="debt-card__money">${formatCurrencyLite(credit.amount, 0)}</p>
                <p class="debt-card__money">${formatCurrencyLite(credit.balance, 0)}</p>
            </div>`
        })
    }//Fin de if

    debtsHistory.innerHTML = htmlCode;
    debtSumary.innerText = creditSumary;
}

const updatePaymentsHistory = () => {
    const paymentsHistory = document.getElementById('paymentsHistory');
    const paymentsSumary = document.getElementById('paymentsSumary');
    let htmlCode = '';
    let sumary = '0 abonos | $ 0';

    if(customerSelected && customers.some(c => c.id === customerSelected)){
        let customer = customers.filter(c => c.id === customerSelected)[0];
        let totalAmount = 0;

        customer.payments.forEach(payment => {
            htmlCode += `
            <div class="payment-row">
                <p class="paymen-row__date">${payment.date}</p>
                <p class="payment-row__amount">${formatCurrencyLite(payment.amount, 0)}</p>
            </div>`;

            totalAmount += payment.amount;
        });//Fin de forEach

        if(totalAmount > 0){
            if(customer.payments.length === 1){
                sumary = `1 abono | ${formatCurrencyLite(totalAmount, 0)}`;
            }else{
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