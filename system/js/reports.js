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

/**
 * Clase base para la generacion de reportes
 */
class Report{
  /**
   * @constructor
   * @param {number} id identificador del reporte
   * @param {object} sales Arreglo con isntancias de Sale
   */
  constructor(id, sales){
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
  calculateStatistics(){
    let saleCount = 0;
    let amount = 0;
    let averageSale = 0;
    let max = undefined;
    let min = undefined;
    let upperBound = 0;
    let lowerBound = 0;

    //Se calcula max, min y amount
    this.sales.forEach(sale => {
      saleCount++;
      amount += sale.amount;

      if(typeof max === 'undefined' && typeof min === 'undefined'){
        max = sale;
        min = sale;
      }else{
        max = max.amount > sale.amount 
            ? max
            : sale;

        min = min.amount < sale.amount
            ? min
            : sale;
      }
    });

    //Se calcula vaerage y las cotas superior e inferior
    if(saleCount > 0){
      averageSale = amount / saleCount;
      this.sales.forEach(sale => {
        if(sale.amount >= averageSale){
          upperBound++;
        }else{
          lowerBound++;
        }
      });

      //Se convierte en porcentaje
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