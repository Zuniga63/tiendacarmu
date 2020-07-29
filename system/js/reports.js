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
    this.saleDate = moment(saleDate);
    this.dateToString = this.saleDate.format("DD-MM-yyyy");
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
 * Clase base para la generacion de reportes
 */
class Report {
  /**
   * @constructor
   * @param {number} id identificador del reporte
   * @param {object} sales Arreglo con isntancias de Sale
   */
  constructor(id, sales) {
    this.id = id;
    this.sales = sales;
    this.amount = 0;
    this.averageSale = 0;
    this.maxSale = undefined;
    this.minSale = undefined;
    this.upperBound = 0;
    this.lowerBound = 0;
  }

  /**
   * Segun los datos de ventas calcula las estadisticas
   * asociadas
   */
  calculateStatistics() {
    console.log("Llamando al objeto base");
    let saleCount = 0;
    let amount = 0;
    let averageSale = 0;
    let max = undefined;
    let min = undefined;
    let upperBound = 0;
    let lowerBound = 0;

    //Se calcula max, min y amount
    this.sales.forEach((sale) => {
      saleCount++;
      amount += sale.amount;

      if (typeof max === "undefined" && typeof min === "undefined") {
        max = sale;
        min = sale;
      } else {
        max = max.amount > sale.amount ? max : sale;

        min = min.amount < sale.amount ? min : sale;
      }
    });

    //Se calcula vaerage y las cotas superior e inferior
    if (saleCount > 0) {
      averageSale = amount / saleCount;
      this.sales.forEach((sale) => {
        if (sale.amount >= averageSale) {
          upperBound++;
        } else {
          lowerBound++;
        }
      });

      //Se convierte en fracciones
      upperBound = upperBound / saleCount;
      lowerBound = lowerBound / saleCount;
    }

    //Se calculan las cotas superio e inferior

    this.amount = amount;
    this.averageSale = averageSale;
    this.maxSale = max;
    this.minSale = min;
    this.upperBound = upperBound;
    this.lowerBound = lowerBound;
  }
}

class DailyReport extends Report {
  /**
   * Crea y gestiona los reportes diarios, verificando tambien
   * que las fechas de las ventas correspondan a la fecha del reporte
   * @param {number} id Identificador del reporte
   * @param {object} sales Arreglo con las ventas
   * @param {object} date Instancia de fecha Moment
   */
  constructor(id, sales, date) {
    super(id, sales);
    this.date = date;
    this.dayOfWeek = DayOfWeek[date.isoWeekday()];
    this.salesWithError = [];
  }

  calculateStatistics() {
    //Antes se verifica que todas las ventas sean de la misma fecha
    let temporalSales = [];
    let salesWithError = [];
    this.sales.forEach((sale) => {
      if (
        sale.saleDate.format("yyyy-MM-DD") === this.date.format("yyyy-MM-DD")
      ) {
        temporalSales.push(sale);
      } else {
        salesWithError.push(sale);
      }
    });

    this.sales = temporalSales;
    this.salesWithError = salesWithError;

    super.calculateStatistics();
  }
}

class PeriodicReport extends Report {
  /**
   * @constructor
   * @param {number} id Identificador del reporte
   * @param {objetc} sales Arrglo con instancias de ventas
   * @param {object} since Instancia de moment para la fecha inicial
   * @param {object} until Instancia de moment para la fecha final
   */
  constructor(id, sales, since, until) {
    super(id, sales);
    this.since = undefined;
    this.until = undefined;
    this.periodIsCorrect = false;
    this.dailyReports = [];
    this.maxDailySale = undefined;
    this.minDailySale = undefined;
    this.averageDailySale = 0;

    this.__validatePeriod(since, until);
  }

  calculateStatistics() {
    if (this.periodIsCorrect) {
      this.__validateSales();
      super.calculateStatistics();
      this.__calculateDailyStatistics();
    }
  }

  /**
   * Verifica que sean instancia de moment y que la fecha inicial
   * sea menor que la fecha final, ademas pone las fechas la inicio y al final de
   * sus días
   * @param {object} since Intancia de moment con la fecha inicial
   * @param {object} until Intancia de moment con la fecha final
   */
  __validatePeriod(since, until) {
    if (since instanceof moment && until instanceof moment) {
      //Se verifica que since sea menor que until
      if (since.isBefore(until)) {
        this.since = since.startOf("day");
        this.until = until.endOf("day");
        this.periodIsCorrect = true;
      } else {
        this.since = since;
        this.until = until;
      }
    } else {
      this.since = moment();
      this.until = moment();
    }
  } //Fin del metodo

  /**
   * Se verifica que las ventas esten dentro del periodo
   * y se muta el array original de ventas
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

    this.sales = salescorrect;
    this.salesWithError = salesIncorrect;
  }

  __calculateDailyStatistics() {
    let since = undefined;
    let until = undefined;
    let dailySales = [];
    let actualSaleIndex = 0;
    let startDate = this.since;
    let endDate = this.until;
    let dailyReports = [];
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
        if (sale.saleDate.isSameOrAfter(since) && sale.saleDate.isSameOrBefore(until)) {
          dailySales.push(sale);
        } else {
          break;
        }

        actualSaleIndex = index;
      }//Fin de for

      //En este punto o no hay mas ventas o se rompio el bucle
      const dailyReport = new DailyReport(
        this.dailyReports.length + 1,
        dailySales,
        since
      );

      //Se asigna el rporte maximo y el minimo
      if (
        typeof minDailySale === "undefined" &&
        typeof maxDailySale === "undefined"
      ) {
        minDailySale = dailyReport;
        maxDailySale = dailyReport;
      } else {
        minDailySale =
          dailyReport.amount < minDailySale.amount ? dailyReport : minDailySale;
        maxDailySale =
          dailyReport.amount > maxDailySale.amount ? dailyReport : maxDailySale;
      }//Fin de if-else

      dailyReports.push(dailyReport);

      //Se aumenta en un día las fecha limitantes
      since.add(1, 'day');
      until.add(1, 'day');
      //Se reinician las ventas
      dailySales = [];
    }//Fin de while

    if(dailyReports.length > 0){
      averageDailySale = this.amount / dailyReports.length;
    }

    //Se actualiza la ifnormacion del objeto
    this.dailyReports = dailyReports;
    this.maxDailySale = maxDailySale;
    this.minDailySale = minDailySale;
    this.averageDailySale = averageDailySale;
  }//Fin del metodo
}//Fin de la clase
