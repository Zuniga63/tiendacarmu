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