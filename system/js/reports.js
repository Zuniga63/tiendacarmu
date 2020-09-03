/**
 * @fileoverview Objetos para facilitar la creacion de los reportes
 * @author Andrés Zuñiga <andres.zuniga.063@gmail.com>
 * @version 1.0
 * Este archivo requiere la librería de moment.js
 * --History
 *  2020-07-29: Se inicia la construccion del documento
 */

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

    this.sales.forEach(sale => {
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
    });//Fin de forEach
  }//Fin del metodo
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
  }//Fin del metodo

  /**
   * Se encarga de verificar que las ventas se encuentren dentro de 
   * la fecha del día.
   */
  __validateSales() {
    if (this.date instanceof Moment) {
      let startDay = moment(this.date).startOf('day');
      let endDay = moment(this.date).endOf('day');
      let temporal = [];
      this.sales.forEach(sale => {
        if (sale.saleDate.isSameOrAfter(startDay) && sale.saleDate.isSameOrBefore(endDay)) {
          temporal.push(sale);
        } else {
          this.salesWithError.push(sale);
        }
      });//Fin de forEach

      this.sales = temporal;
    } else { //Fin de if
      this.sales = [];
    }//Fin de else
  }//Fin del metodo
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
    this.dayInWhite = 0;
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
    this.sales.forEach(sale => {
      if (sale instanceof Sale) {
        if(sale.saleDate.isSameOrAfter(this.since) && sale.saleDate.isSameOrBefore(this.until)){
          temporal.push(sale);
        }else{
          errors.push(sale);
        }
      }else{
        errors.push(sale);
      }//Fin de if-else
    });//Fin de forEach
    this.sales = temporal;
    this.salesWithError = errors;
  }//Fin del metodo
  /**
   * Se encarga de definir las estadisticas diarias
   */
  calculateDailyStats() {
    //TODO
  }

  /**
   * Verifica que sean instancia de moment y que la fecha inicial
   * sea menor que la fecha final, ademas pone las fechas la inicio y al final de
   * sus días
   * @param {object} since Intancia de moment con la fecha inicial
   * @param {object} until Intancia de moment con la fecha final
   */
  __validatePeriod(since, until) {
    if (since instanceof Moment && until instanceof Moment) {
      since.startOf('day');
      until.endOf('day');
      //Se verifica que since sea menor que until
      if (since.isBefore(until)) {
        this.since = since.startOf("day");
        this.until = until.endOf("day");
      }
    }
  } //Fin del metodo

  /**
   * Se verifica que las ventas esten dentro del periodo
   * y se muta el array original de ventas. 
   * OJO: ESTE METODO REVIERTE EL ARREGLO DE VENTAS YA QUE POR DEFECTO
   * EN EL SERVIDOR ESTAS SON ENVIADAS EN ORDEN INVERSO
   */
  __validateSales() {
    let salescorrect = [];
    let salesIncorrect = [];

    this.sales.forEach((sale) => {
      if (
        sale.saleDate.isSameOrAfter(this.since) &&
        sale.saleDate.isSameOrBefore(this.until)
      ) {
        salescorrect.push(sale);
      } else {
        salesIncorrect.push(sale);
      }
    });

    this.sales = salescorrect.reverse();
    //TODO: Metodo que grantice un ordenamineto de fechas correcto siempre
    this.salesWithError = salesIncorrect;
  }

  __calculateDailyStatistics() {
    let actualSaleIndex = 0;
    let lastID = 0;
    let startDate = this.since; //La fecha inicial del reporte periodico
    let endDate = this.until; //La fecha limite del repote periodico
    let since = undefined;
    let until = undefined;
    let amount = 0;
    let dailySales = [];
    let dailyReports = [];
    let dayInWhite = 0;
    let maxDailySale = undefined;
    let minDailySale = undefined;
    let averageDailySale = 0;

    //Se define la fecha del primer reporte diario
    since = moment(startDate).startOf("day");
    until = moment(since).endOf("day");

    //Se inicia el cilo que va verificando la fechas de las ventas
    while (since.isBefore(endDate)) {
      //Empieza el bucle que recorre las ventas
      for (let index = actualSaleIndex; index < this.sales.length; index++) {
        const sale = this.sales[index];
        actualSaleIndex = index;

        if (
          sale.saleDate.isSameOrAfter(since) &&
          sale.saleDate.isSameOrBefore(until)
        ) {
          dailySales.push(sale);
        } else {
          break;
        } //Fin de if-else
      } //Fin de for

      //En este punto o no hay mas ventas o se rompio el bucle
      // alert('Ojo');
      const dailyReport = new DailyReport(lastID + 1, dailySales, since);
      dailyReport.calculateStatistics();
      dailyReports.push(dailyReport);
      amount += dailyReport.amount;
      //Se limpian los datos para la siguiente vuelta
      dailySales = [];
      lastID++;

      //Se asigna el rporte maximo y el minimo
      if (dailyReport.amount > 0) {
        if (
          typeof minDailySale === "undefined" &&
          typeof maxDailySale === "undefined"
        ) {
          minDailySale = dailyReport;
          maxDailySale = dailyReport;
        } else {
          minDailySale =
            minDailySale.amount <= dailyReport.amount
              ? minDailySale
              : dailyReport;
          maxDailySale =
            maxDailySale.amount >= dailyReport.amount
              ? maxDailySale
              : dailyReport;
        } //fin de else
      } else {
        dayInWhite++;
      } //Fin de else


      //Se aumenta en un día las fecha limitantes
      since.add(1, "day");
      until.add(1, "day");
    } //Fin de while

    if (dailyReports.length > 0) {
      averageDailySale = amount / dailyReports.length;
    }

    //Se actualiza la ifnormacion del objeto
    this.dailyReports = dailyReports;
    this.maxDailySale = maxDailySale;
    this.minDailySale = minDailySale;
    this.averageDailySale = averageDailySale;
    this.dayInWhite = dayInWhite;
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
      this.since = this.since.startOf('week');
      this.until = this.until.endOf('week');
    } else {
      this.since = moment().startOf('week');
      this.until = moment().endOf('week');
    }
  }
}

class MonthlyReport extends PeriodicReport {
  constructor(id, sales, since, until) {
    //TODO
  }

  calculateStats() {
    //TODO
  }

  /**
   * Se encarga de verifica y corregir las fechas
   * de los limites de este mes
   */
  validateMonth() {
    //TODO
  }

  /**
   * Encargado de crear las estadisticas correspondientes a las dos 
   * quincenas del mes
   */
  calculateFortnigthsStats() {
    //TODO
  }
}

class AnnualReport extends PeriodicReport {
  constructor(id, sales, since, until) {
    //TODO
  }

  calculateStats() {
    //TODO
  }

  calculateMonthlyStats() {
    //TODO
  }
}
