
/**
 * Es una instancia de una categoría especifica de productos
 */
class Category {
    /**
     * @constructor
     * @param {number} id El identificador de la base de datos, por defecto es cero
     * @param {string} name Parametro obligatorio y es el nombre de la categoría
     * @param {number} categoryClass Las clases de valor 1 son la raiz
     * @param {string} path Corresponde a la ruta desde la raiz hasta la categoría actual
     * @param {number} code Es el codigo especifico de está categoría
     */
    constructor(id = 0, name, categoryClass, path, code = 0) {
        this.id = id;
        this.name = name;
        this.categoryClass = categoryClass;
        this.path = path;
        this.code = code;
        this.subcategories = [];
    }//Fin del constructor

    /**
     * Este agrega una subcategoría al arreglo
     * @param {Category} category Instancia de categoría
     */
    addSubcategory(category){
        if(category && category.id && category.id > 0){
            let coincidence = this.isFatherOf(category.id);
            
            if(!coincidence){
                if(this.categoryClass + 1 === category.categoryClass){
                    this.subcategories.push(category);
                }
            }
        }
    }

    /**
     * Este metodo comprueba si el identificador corresponde a al identificador
     * de alguna de las subcategorías dentro del arreglo 
     * @param {number} categoriId El identificador de la categoría
     * @returns {boolean} True en el caso de encontrar coincidencia
     */
    isFatherOf(categoriId){
        if(categoryId && typeof categoryId === 'number'){
            return this.subcategories.some(c => c.id === categoryId);
        }

        return false;
    }
}