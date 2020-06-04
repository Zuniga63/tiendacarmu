
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

/**
 * Instancia de Label
 */
class Label{
    /**
     * @constructor
     * @param {number} id Identificador otorgado por la base de datos
     * @param {string} name Nombre unico con un maximo de 45 caracteres
     */
    constructor (id = 0, name){
        this.id = id;
        this.name = name;
    }
}

/**
 * Instancia de un genero
 */
class Gender{
    /**
     * @constructor
     * @param {string} genderValue Valor de un solo caracter
     * @param {string} name El nombre del genero
     */
    constructor(genderValue, name){
        this.genderValue = genderValue;
        this.name = name;
    }
}

/**
 * Es una instancia de la direccion de la imagen de un producto * 
 */
class ItemImage{
    /**
     * @constructor
     * @param {string} src Direccion relativa del archivo
     * @param {number} width Ancho en pixeles
     * @param {number} height Alto en pixeles
     */
    constructor(src, width, height){
        this.src = src;
        this.width = width;
        this.height = height;
    }
}

/**
 * Instancia de un producto
 */
class Item{
    /**
     * @constructor
     * @param {number} id Identificador otorgado por la base de datos
     * @param {string} name Nombre del producto, debe ser unico
     * @param {string} description Descripción breve del producto
     * @param {number} retailPrice Es el precio de venta al publico
     * @param {string} ref Referencia de compra del producto
     * @param {string} barcode Codigo de barra del producto
     * @param {Gender} gender Es el genero del producto, por defecto es unisex
     * @param {number} stock La unidades disponibles para la venta
     * @param {boolean} published Si el producto se encuentra en la web
     * @param {boolean} isNew Si está catalogado como articulo nuevo
     * @param {boolean} outstanding Si se ha marcado como destacado
     * @param {string} dischargeDate La fecha en la que se dio de alta
     */
    constructor(id = 0, name, description, retailPrice = 0, ref = '', barcode = '', gender = 'x', stock = 0, published = false, isNew = false, outstanding = false, dischargeDate = ''){
        this.id = id;
        this.name = name;
        this.description = description;
        this.retailPrice = retailPrice;
        this.ref = ref;
        this.barcode = barcode;
        this.gender = gender;
        this.stock = stock;
        this.published = published;
        this.isNew = isNew;
        this.outstanding = outstanding;
        this.dischargeDate = dischargeDate;
        this.categories = [];
        this.labels = [];
        this.images = [];
        this.errors = [];
    }

    /**
     * Agrega de forma segura categorías al array de categories
     * @param {Category} category Instancia de Category
     */
    addCategory(category){
        if(category && category.id && category.id > 0){
            if(this.categories.length === 0){
                if(category.categoryClass === 1){
                    this.categories.push(category);
                }else{
                    this.errors.push(`La categoría ${category.name} (${category.id}) no es una raiz`);
                }
            }else{
                let lastIndex = this.categories.length - 1;
                let isSon = this.categories[lastIndex].isFatherOf(category.id);
                if(isSon){
                    this.categories.push(category);
                }else{
                    this.errors.push(`La categoría ${category.name} no es una subcategoría valida`);
                }
            }
        }else{
            this.errors.push('Se intenta agregar un objeto que no es una categoría');
        }

    }

    /**
     * Agrega la etiqueta al array despues de comprobar que no este repetido
     * @param {Label} label Intancia de Label
     */
    addLabel(label){
        if(label && label.id && label.id > 0){
            let coincidence = this.labels.some(l => l.id === label.id);
            if(!coincidence){
                this.labels.push(label);
            }else{
                this.errors.push(`La etiqueta ${label.name} ya se agregó`);
            }
        }else{
            this.errors.push(`La etiqueta ${label.name} no cumple con las condiciones`);
        }
    }

    /**
     * Agrega el objeto al array despues de validar que no esté repetido
     * @param {ItemImage} image Instancia de ItemImage
     */
    addImages(image){
        if(image, image.src){
            let coincidence = this.images.some(img => img.src === image.src);
            if(!coincidence){
                this.images.push(image);
            }else{
                this.errors.push(`La imagen "${image.src}" ya está en el array`);
            }
        }
    }
}

