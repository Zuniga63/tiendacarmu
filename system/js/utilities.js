/**
 * @fileoverview clases requeridas por los modulos y la app
 * @author Andrés Zuñiga <andres.zuniga.063@gmail.com>
 * @version 1.0
 * Este archivo requiere la librería de moment.js
 * --History
 *  2020-09-05: Primera version escrita por Andrés Zuñiga
 */
//---------------------------------------------------------------------------
//  FUNCIONES BASICAS
//---------------------------------------------------------------------------
/**
 * Esta funcion generica funciona para dar formato de moneda a los numeros pasados como parametros
 * @param {string} locales Es el leguaje Eje: es-CO
 * @param {string} currency Eltipo de moneda a utilizar ej: COP
 * @param {number} fractionDigits El numero de digitos decimales que se van a mostrar
 * @param {number} number Es la cantidad de dinero que se va a dar formato
 */
function formatCurrency(locales, currency, fractionDigits, number) {
  var formatted = new Intl.NumberFormat(locales, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: fractionDigits,
  }).format(number);
  return formatted;
}

/**
 * Esta es una version simplificada de formatCurreny para moneda colombiana
 * @param {number} number Numero para establecer formato
 * @param {number} fractionDigits Fracciones a mostrar
 */
function formatCurrencyLite(number, fractionDigits) {
  return formatCurrency("es-CO", "COP", fractionDigits, number);
}

/**
 * Elimina el simbolo de moneda y junta los puntos
 * @param {string} text Texto a eliminar formato
 */
const deleteCurrencyFormater = text => {
  let value = text.replace("$", "");
  value = value.split(".");
  value = value.join("");

  return value;
}

/**
 * Este metodo elimina los signos de puntuacion, cerifas, virguillas, dieresis, cedillas, etc
 * @param {string} text Texto a normalizar
 * @return {string} texto normalizado
 */
const normalizeText = (text) => {
  text = text.normalize("NFD");
  text = text.replace(
    /([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi,
    "$1"
  );
  text = text.normalize();
  return text;

  //FUENTE
  //https://es.stackoverflow.com/questions/62031/eliminar-signos-diacr%C3%ADticos-en-javascript-eliminar-tildes-acentos-ortogr%C3%A1ficos
};

/**
 * Este metodo normaliza las cadenas luego las cambia a mayusculas y verifica si el origen
 * contiene el texto buscado.
 * @param {string} originText Texto en el cual se utiliza como base para la busqueda
 * @param {string} searchTex Texto que se va a buscar en el origen
 * @returns {boolean} True si el origen lo contine
 */
const textInclude = (originText, searchTex) => {
  //Llevo a la forma descompuesta y se elimina el bloque con la marca

  originText = normalizeText(originText);
  searchTex = normalizeText(searchTex);

  originText = originText.toUpperCase();
  searchTex = searchTex.toUpperCase();

  return originText.includes(searchTex);
};
//---------------------------------------------------------------------------
//  CLASES
//---------------------------------------------------------------------------
/**
 * Sirve como modelo para guardar los datos de los link del
 * panel de navegación
 */
class Link {
  /**
   * @constructor
   * @param {number} id Identificador del link
   * @param {string} name El nombre del link que se muestra en la vista
   * @param {string} viewName Es el nombre de la view que sirve para mostrar las vistas
   * @param {bool} isDropdown Si este link en especifico es un dropdown
   * @param {object} dropdownList Listado con instacia de link para mostrar en pantalla
   */
  constructor(id, name, viewName, disabled = false, prependIcon = '', isDropdown = false, dropdownList = []) {
    this.id = id;
    this.name = name;
    this.viewName = viewName;
    this.disabled = disabled;
    this.prependIcon = prependIcon;
    this.isDropdown = isDropdown;
    this.dropdownList = dropdownList;
  }
}

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

class NewSaleModal {
  constructor() {
    this.visible = false;
    this.formData = undefined;
  }
}

//---------------------------------------------------------------------------
//  CLASES REALCIONADAS A LOS CLIENTES
//---------------------------------------------------------------------------
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
  constructor(
    id = 0,
    firstName,
    lastName = "",
    nit = "",
    phone = "",
    email = "",
    points = 0,
    archived = false
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.fullName = `${this.firstName} ${this.lastName}`;
    this.nit = nit;
    this.phone = phone;
    this.email = email;
    this.points = points;
    this.credits = [];
    this.payments = [];
    this.balance = 0;
    this.state = "";
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
    this.fullName = `${this.firstName} ${this.lastName}`;
    this.nit = customerData.nit;
    this.phone = customerData.phone;
    this.email = customerData.email;
    this.points = customerData.points;

    //Agrego los creditos y los abonos
    customerData.credits.forEach((credit) => {
      this.addCredit(
        credit.id,
        credit.creditDate,
        credit.description,
        credit.amount,
        credit.balance
      );
    });

    customerData.payments.forEach((payment) => {
      this.addPayment(
        payment.id,
        payment.paymentDate,
        payment.amount,
        payment.cash
      );
    });

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
    this.state = "";

    //Se inicializan las variables temporales
    let lastDate = "";
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
        let credit =
          indexCredit < this.credits.length ? this.credits[indexCredit] : null;

        let payment =
          indexPayment < this.payments.length
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
            } //Fin de if

            balance += credit.amount;
            indexCredit++;
          } else {
            //Se va actualizando la frecuencia de pago
            this.paymentFrecuency += moment(payment.date).diff(
              moment(lastDate),
              "days"
            );
            lastDate = payment.date;
            lastDateIsAPayment = true;
            balance -= payment.amount;
            indexPayment++;
          } //Fin de if else
        } else {
          if (credit) {
            if (balance === 0) {
              lastDate = credit.date;
              lastDateIsAPayment = false;
            } //Fin de if

            balance += credit.amount;
            indexCredit++;
          } else {
            this.paymentFrecuency += moment(payment.date).diff(
              moment(lastDate),
              "days"
            );
            lastDate = payment.date;
            lastDateIsAPayment = true;
            balance -= payment.amount;
            indexPayment++;
          }
        } //Fin de if-else

        //El proceso debe terminar cuando no hayan mas creditos o abonos
      } while (
        indexCredit < this.credits.length ||
        indexPayment < this.payments.length
      );

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
        let diff = now.diff(moment(lastDate), "days");
        if (diff > 30) {
          this.deliquentBalance = true;
        }

        this.paymentFrecuency += diff;
        if (this.payments.length > 0) {
          this.paymentFrecuency =
            this.paymentFrecuency / (this.payments.length + 1);
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
      this.state = "Desde el origen de los tiempos";
    } //Fin de if else

    this.setScore();
  } //Fin del metodo

  setScore() {
    const utility = 0.1;
    let iea = utility * (55.0 / 20.0);
    let iep = Math.pow(1 + iea, 1 / 365) - 1;
    let creditVpn = 0;
    let paymentVpn = 0;
    let now = moment();

    if (this.credits.length > 0) {
      //Se calcula el vpn de los creditos
      this.credits.forEach((credit) => {
        let capital = credit.amount / (1 + utility);
        let days = now.diff(moment(credit.date), "days");
        creditVpn += capital * Math.pow(1 + iep, days);
      });

      //Se calcula el vpn de los pagos
      this.payments.forEach((payment) => {
        let days = now.diff(moment(payment.date), "days");
        paymentVpn += payment.amount * Math.pow(1 + iep, days);
      });
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

//---------------------------------------------------------------------------
//  CLASES REALCIONADAS A LAS VENTAS
//---------------------------------------------------------------------------
/**
 * Estructura para una venta
 */
class Sale {
  /**
   * @constructor
   * @param {number} id Identificador unico de la venta
   * @param {string} saleDate Fecha de la transacción
   * @param {string} description Detalles de la venta
   * @param {number} amount Valor total de la venta
   */
  constructor(id, saleDate, description, amount) {
    this.id = id;
    this.categoryId = 0;
    this.saleDate = moment(saleDate);
    this.dateToString = this.saleDate.format("DD-MM-YYYY");
    this.description = description;
    this.amount = amount;
  }
}

/**
 * Molde para la creacion de las categorías
 */
class Category {
  /**
   * @constructor
   * @param {number} id Identificador unico de la categoría
   * @param {string} name Nombre de la categoria, tambien es unico
   * @param {number} totalAmount Sumatoria de los saldos de las ventas
   * @param {number} averageSale El es promedio por venta de la categoría
   */
  constructor(id, name, totalAmount, averageSale) {
    this.id = id;
    this.selected = false;
    this.name = name;
    this.totalAmount = totalAmount;
    this.averageSale = averageSale;
    this.sales = [];
  }

  /**
   * Agrga instancias deventas al array de objetos
   * @param {number} saleID Identificador de la venta
   * @param {string} saleDate La fecha de la venta
   * @param {string} saleDescription Descripcion de la venta
   * @param {number} saleAmount Valor neto de la venta
   */
  addSale(saleID, saleDate, saleDescription, saleAmount) {
    let sale = new Sale(saleID, saleDate, saleDescription, saleAmount);
    this.sales.push(sale);
  }
}

const DayOfWeek = Object.freeze({
  1: "Lunes",
  2: "Martes",
  3: "Miércoles",
  4: "Jueves",
  5: "Viernes",
  6: "Sábado",
  7: "Domingo",
});

const Month = Object.freeze({
  0: "Enero",
  1: "Febrero",
  2: "Marzo",
  3: "Abril",
  4: "Mayo",
  5: "Junio",
  6: "Julio",
  7: "Agosto",
  8: "Septiembre",
  9: "Octubre",
  10: "Noviembre",
  11: "Diciembre",
});

//---------------------------------------------------------------------------
//  CLASES REALCIONADAS A LOS REPORTES
//---------------------------------------------------------------------------
/**
 * Super clase para gestionar los reportes de ventas
 */
class ReportBase {
  /**
   * @constructor
   * @param {number} id identificador del reporte
   * @param {object} sales Arreglo con isntancias de Sale
   */
  constructor(id, sales) {
    this.id = id;
    this.sales = sales;
    this.salesWithError = [];
    this.amount = 0;
    this.average = 0;
    this.maxSale = undefined;
    this.minSale = undefined;
  }

  /**
   * Funcion que se encarga de calcular las estadisticas
   * relacionadas con las ventas.
   */
  calculateStats() {
    let amount = 0;
    let max = undefined;
    let min = undefined;
    let correctSales = [];
    let incorretSales = [];
    console.log('Llamada al metodo calculate Stats Base');

    this.sales.forEach((sale) => {
      //En primer lugar se verifica que sea una instancia de Sale
      if (sale instanceof Sale) {
        correctSales.push(sale);
        amount += sale.amount;
        //Ahora se define si es una venta minima o maxima
        if (!max && !min) {
          max = sale;
          min = sale;
        } else {
          max = max.amount >= sale.amount ? max : sale;
          min = min.amount <= sale.amount ? min : sale;
        }
      } else {
        incorretSales.push(sale);
      }

      //Finalmente se calcula el importe promedio y se asignan las variables
      this.sales = correctSales;
      this.amount = amount;
      this.minSale = min;
      this.maxSale = max;
      this.average = amount > 0 ? amount / correctSales.length : 0;
      this.salesWithError = incorretSales;
    }); //Fin de forEach
  } //Fin del metodo
}

/**
 * Es una clase ya de uso y sirve para ordenar las ventas de un día en especifico
 */
class DailyReport extends ReportBase {
  /**
   * Crea y gestiona los reportes diarios, verificando tambien
   * que las fechas de las ventas correspondan a la fecha del reporte
   * @param {number} id Identificador del reporte
   * @param {object} sales Arreglo con las ventas
   * @param {object} date Instancia moment para la fecha del reporte diario
   */
  constructor(id, sales, date) {
    super(id, sales);
    this.date = date;
    this.dayOfWeek = DayOfWeek[date.isoWeekday()]; //Obtengo el numero del día para luego obtener el nombre del día
    this.calculateStats();
  }

  calculateStats() {
    this.__validateSales();
    super.calculateStats();
  } //Fin del metodo

  /**
   * Se encarga de verificar que las ventas se encuentren dentro de
   * la fecha del día.
   */
  __validateSales() {
    if (this.date instanceof Moment) {
      let startDay = moment(this.date).startOf("day");
      let endDay = moment(this.date).endOf("day");
      let temporal = [];
      this.sales.forEach((sale) => {
        if (sale.saleDate.isBetween(startDay, endDay, undefined, "[]")) {
          temporal.push(sale);
        } else {
          this.salesWithError.push(sale);
        }
      }); //Fin de forEach

      this.sales = temporal;
    } else {
      //Fin de if
      this.sales = [];
    } //Fin de else
  } //Fin del metodo
}

/**
 * Super clase encargada de gestionar las ventas
 * que estan comprendidas entre dos fechas distintas
 */
class PeriodicReport extends Report {
  /**
   * @constructor
   * @param {number} id Identificador del reporte
   * @param {object} sales arreglo con instancias de ventas
   * @param {object} since Instancia de moment para la fecha inicial
   * @param {object} until Instancia de moment para la fecha final
   */
  constructor(id, sales, since, until) {
    super(id, sales);
    //Estos tres parametros se definen en la validacion del periodo
    this.since = moment();
    this.until = moment();
    this.dailyReports = [];
    this.maxDailySale = undefined;
    this.minDailySale = undefined;
    this.averageDailySale = 0;
    this.blankDays = [];
    this.__validatePeriod(since, until);
  }

  calculateStats() {
    this.__validateSales();
    super.calculateStats();
    this.calculateDailyStats();
  }

  /**
   * Se encarga de verificar que las ventas se encuentren
   * dentro del periodo establecido.
   */
  __validateSales() {
    let temporal = [];
    let errors = [];
    this.sales.forEach((sale) => {
      if (sale instanceof Sale) {
        if (sale.saleDate.isBetween(this.since, this.until, undefined, "[]")) {
          temporal.push(sale);
        } else {
          errors.push(sale);
        }
      } else {
        errors.push(sale);
      } //Fin de if-else
    }); //Fin de forEach
    this.sales = temporal;
    this.salesWithError = errors;
  } //Fin del metodo
  /**
   * Se encarga de definir las estadisticas diarias
   */
  calculateDailyStats() {
    //-----------------------------------------------------
    //  FECHAS
    //-----------------------------------------------------
    let minDate = moment(this.since);
    let maxDate = moment(this.until);
    let fromDate = moment(minDate);
    let toDate = moment(fromDate).endOf("day");
    //-----------------------------------------------------
    //  PARAMETROS
    //-----------------------------------------------------
    let sales = this.sales.sort((s1, s2) => s1.saleDate.diff(s2.saleDate));
    //-----------------------------------------------------
    //  VARIABLES
    //-----------------------------------------------------
    let id = 0;
    let actualIndex = 0;
    let blankDays = [];
    let maxSale = undefined;
    let minSale = undefined;
    //-----------------------------------------------------
    //  LISTADOS
    //-----------------------------------------------------
    let dailySales = [];
    let dailyReports = [];
    //-----------------------------------------------------
    //  LOGICA DEL METODO
    //-----------------------------------------------------
    while (fromDate.isBefore(maxDate)) {
      //cada que inicia un ciclo se debe limpiar la lista de ventas
      dailySales = [];
      //Se recorre la lista desde el punto anterior
      for (let index = actualIndex; index < sales.length; index++) {
        const sale = sales[index];
        if (sale.saleDate.isBetween(fromDate, toDate, undefined, "[]")) {
          dailySales.push(sale);
          actualIndex++;
        } else {
          break;
        }
      }

      //Aquí ya se tiene un listado oficial que se encuentra entre las dos fechas
      //Por lo que se procede a crear el reporte diario
      id++; //Se aumenta el contador antes con el fin de que no empiece en cero
      let dailyReport = new DailyReport(id, dailySales, fromDate);
      dailyReports.push(dailyReport);
      if (dailyReport.amount > 0) {
        //Ahora se define si es una venta maxima, minima o ninguna
        if (maxSale && minSale) {
          minSale =
            minSale.amount <= dailyReport.amount ? minSale : dailyReport;
          maxSale =
            maxSale.amount >= dailyReport.amount ? maxSale : dailyReport;
        } else {
          minSale = dailyReport;
          maxSale = dailyReport;
        } //Fin de if-else
      } else {
        blankDays.push(dailyReport);
      } //Fin de if-else

      //Se aumenta la fecha en un día
      fromDate.add(1, "day");
      toDate.add(1, "day");
    } //Fin de while

    //Finalmente se calcula el promedio diario y se asignan los valores
    this.dailyReports = dailyReports;
    this.blankDays = blankDays;
    this.maxDailySale = maxSale;
    this.minDailySale = minSale;
    this.averageDailySale =
      dailyReports.length > 0 ? this.amount / dailyReports.length : 0;
  } //Fin del metodo

  /**
   * Verifica que sean instancia de moment y que la fecha inicial
   * sea menor que la fecha final, ademas pone las fechas la inicio y al final de
   * sus días
   * @param {object} since Intancia de moment con la fecha inicial
   * @param {object} until Intancia de moment con la fecha final
   */
  __validatePeriod(since, until) {
    if (since instanceof Moment && until instanceof Moment) {
      since.startOf("day");
      until.endOf("day");
      //Se verifica que since sea menor que until
      if (since.isBefore(until)) {
        this.since = since.startOf("day");
        this.until = until.endOf("day");
      }
    }
  } //Fin del metodo
} //Fin de la clase

class WeeklyReport extends PeriodicReport {
  /**
   * @constructor
   * @param {number} id Identificador del reporte
   * @param {object} sales Arreglo con instancias de Sale
   * @param {object} since Intancia moment con la fecha del inicio de la semana
   * @param {object} until Instancia moment con la fecha del fin de la semana
   */
  constructor(id, sales, since, until) {
    super(id, sales, since, until);
    this.week = undefined;
    this.__validateWeek();
  }

  /**
   * Verifica que since y until sean instancias de momente y ubica las fechas
   * correctamente al inicio y al final de la semana de esa fecha
   */
  __validateWeek() {
    if (this.since instanceof moment && this.until instanceof moment) {
      //Primero se define el numero de la semna
      this.week = this.since.isoWeek();
      //Ahora se define el inicio y el fin de la semana
      this.since = this.since.startOf("week");
      this.until = this.until.endOf("week");
    } else {
      this.since = moment().startOf("week");
      this.until = moment().endOf("week");
    }
  }
}

class MonthlyReport extends PeriodicReport {
  constructor(id, sales, since, until) {
    super(id, sales, since, until);
    this.month = Month[since.month()];
    this.fortnights = [];
    this.calculateStats();
  }

  calculateStats() {
    this.__validateMonth();
    super.calculateStats();
    this.calculateFortnigthsStats();
  }

  /**
   * Se encarga de verifica y corregir las fechas
   * de los limites de este mes y verificar las ventas
   */
  __validateMonth() {
    this.since.startOf("month");
    this.until.endOf("month");
    this.__validateSales();
  } //Fin del metodo

  /**
   * Encargado de crear las estadisticas correspondientes a las dos
   * quincenas del mes
   */
  calculateFortnigthsStats() {
    //Se inicializan las variables y se crea la primera quincea
    let fromDate = moment(this.since).startOf("day");
    let toDate = moment(fromDate).add(14, "day").endOf("day");

    let fortnightSales = this.sales.filter((sale) =>
      sale.saleDate.isBetween(fromDate, toDate, undefined, "[]")
    );

    let firtsFortnight = new PeriodicReport(
      1,
      fortnightSales,
      fromDate,
      toDate
    );
    firtsFortnight.calculateStats();
    this.fortnights.push(firtsFortnight);

    //Se crea el reporte de la segunda quincena
    fromDate = moment(this.since).add(15, "days");
    toDate = moment(toDate).endOf("month");
    fortnightSales = this.sales.filter((sale) =>
      sale.saleDate.isBetween(fromDate, toDate, undefined, "[]")
    );
    let secondFortnight = new PeriodicReport(
      2,
      fortnightSales,
      fromDate,
      toDate
    );
    secondFortnight.calculateStats();
    this.fortnights.push(secondFortnight);
  }
}

class AnnualReport extends PeriodicReport {
  constructor(id, sales, since, until) {
    super(id, sales, since, until);
    this.year = undefined;
    this.blankMonths = [];
    this.monthlyReports = [];
    this.minMonthlySale = undefined;
    this.maxMonthlySale = undefined;
    this.averageMonthlySale = 0;
  }

  calculateStats() {
    this.__verifyDate();
    super.calculateStats();
    this.calculateMonthlyStats();
  }

  /**
   * this method select the sales for Each month 
   * and creates the reports.
   */
  calculateMonthlyStats() {
    let fromDate = moment(this.since);
    let toDate = moment(fromDate).endOf('month');
    let id = 0;
    let maxSale = undefined;
    let minSale = undefined;
    let montlyReports = [];
    let blankMonths = [];
    let actualIndex = 0;
    /**
     * The loop is broken when fromDate 
     * reaches january of the next year.
     */
    while (fromDate.isBefore(this.until)) {
      let monthlySales = [];
      /**
       * this loop is broken when there is no more item
       * or when the sale date excceds the maximum date
       */
      for (let index = actualIndex; index < this.sales; index++) {
        const sale = this.sales[index];
        if (sale.saleDate.isBetween(fromDate, toDate, undefined, '[]')) {
          monthlySales.push(sale);
        } else {
          break;
        }
        actualIndex++;
      }

      /**
       * Now we have the sales of the month
       */
      id++;
      let monthlyReport = new MonthlyReport(id, monthlySales, fromDate, toDate);
      montlyReports.push(monthlyReport);

      if (monthlyReport.amount > 0) {
        if (minSale && maxSale) {
          minSale = minSale.amount <= monthlyReport.amount ? minSale : monthlyReport;
          maxSale = maxSale.amount >= monthlyReport.amount ? maxSale : monthlyReport;
        } else {
          minSale = monthlyReport;
          maxSale = monthlyReport;
        }//end of if-else
      } else {
        blankMonths.push(monthlyReport);
      }//end of if-else

      fromDate = moment(fromDate).add(1, 'month');
      toDate = moment(fromDate).endOf('month');
    }//en of switch

    /**
     * finally the object fields are updated
     */
    this.monthlyReports = montlyReports;
    this.minMonthlySale = minSale;
    this.maxMonthlySale = maxSale;
    this.blankMonths = blankMonths;
    this.averageMonthlySale = monthlyReports.length > 0 ? this.amount / this.monthlyReports.length : 0;
  }//end of method

  __verifyDate() {
    if (this.since instanceof Moment && this.until instanceof Moment) {
      this.since.startOf('year');
      this.until.endOf('year');
      this.__validateSales();
    } else {
      //if the date isnt a instance of moment
      //this method reset sales to zero
      this.since = moment();
      this.until = moment();
      this.sale = [];
    }//end of if-else
  }//end of method

}