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
    let dayInWhite = 0;
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
        dayInWhite++;
      } else {
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
      } //Fin de if-else

      //Se aumenta la fecha en un día
      fromDate.add(1, "day");
      toDate.add(1, "day");
    } //Fin de while

    //Finalmente se calcula el promedio diario y se asignan los valores
    this.dailyReports = dailyReports;
    this.dayInWhite = dayInWhite;
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
    month: Month[since.month()];
    fortnights: [];
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
    let temporal = [];
    this.sales.forEach((sale) => {
      if (sale.isBetween(this.since, this.until, undefined, "[]")) {
        temporal.push(sale);
      } else {
        this.salesWithError.push(sale);
      }
    }); //Fin de forEach

    this.sales = temporal;
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
