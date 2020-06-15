const ACTIVE_LINK = 'dropdown__link--active';
const VIEW_SHOW = 'show';

/**
 * Es la etiqueta que aparece debajo del titulo
 */
const systemLegend = document.getElementById('systemLegend');

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

const VIEWS = {
    sumary: new View('sumary', 'sumaryLink', 'sumary'),
    newCustomer: new View('newCustomer', 'newCustomerLink', 'newCustomer'),
    newPayment: new View('newPayment', 'newPaymentLink', 'newPayment'),
    newDebt: new View('newDebt', 'newDebtLink', 'newDebt'),
    customerUpdate: new View('customerUpdate', 'customerUpdateLink', 'customerUpdate'),
    consultDebts: new View('consultDebts', 'consultDebtsLink', 'consultDebts')

};

window.addEventListener('load', () => {
    viewController();
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

    //El link que muestra el resumen
    VIEWS.sumary.link.addEventListener('click', () => {
        showView();
    });

    //El link que muestra el formulario para nuevo clientes
    VIEWS.newCustomer.link.addEventListener('click', () => {
        showView('newCustomer');
    })

    VIEWS.newPayment.link.addEventListener('click', () => {
        showView('newPayment');
    })

    VIEWS.newDebt.link.addEventListener('click', () => {
        showView('newDebt');
    })

    VIEWS.customerUpdate.link.addEventListener('click', () => {
        showView('customerUpdate');
    })

    VIEWS.consultDebts.link.addEventListener('click', () => {
        showView('consultDebts');
    })
}
