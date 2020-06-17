
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

class ItemValidation{
    constructor(result = false, value = undefined, alertType = 'none', message = ''){
        this.ok = result;
        this.alertType = alertType;
        this.message = message;
        this.value = value;
    }
}


class Controller{
    constructor(){
        this.allItems = [];
        this.allCategories = [];
        this.allLabels = [];
        this.genders = [];
        this.availableImages = [];
        this.fatherCategory = null;
        this.selectedCategories = [];
        this.selectedLabels = [];
    }

    /**
     * Realiza una peticion al servidor para traer las datos requeridos por la aplicacion
     */
    async getData(){
        await fetch('./api/all.php')
        .then(res => res.json())
        .then(res => {
            // console.log(res);
            this.availableImages = [];
            this.allCategories = [];
            this.allLabels = [];
            this.allItems = [];


            this.createAvailableImages(res.availableImages);
            this.createAllCategories(res.categories);
            this.createAllLabels(res.labels);
            this.createAllItems(res.items);
        })
    }

    /**
     * Crea las instancias de ItemImage y las agrega al arreglo del objeto
     * @param {array} availableImages Arreglo con los datos de las imagenes disponibles
     */
    createAvailableImages(availableImages){
        availableImages.forEach(img => {
            let image = new ItemImage(img.src, img.width, img.height);
            this.availableImages.push(image);
        });
        this.availableImages.sort((img1, img2) => img1 - img2);
    }

    /**
     * Crea las instancias de Category y luego asigna las subcategorías
     * @param {array} categories Arreglo con los datos de las categorías del servidor
     */
    createAllCategories(categories){
        //Primero creo todas categorias
        categories.forEach(catg => {
            this.allCategories.push(new Category(
                catg.id,
                catg.name,
                catg.categoryClass,
                catg.path,
                catg.code
            ));
        });//Fin de forEach

        //Ahora se hace los mismo pero para asignar las subcategorias
        categories.forEach(catg => {
            let fatherCategory = this.getCategory(catg.id);
            catg.subcategories.forEach(sonId =>{
                let sonCategory = this.getCategory(sonId);
                if(sonCategory){
                    fatherCategory.addSubcategory(sonCategory);
                }//Fin de if
            })//Fin de forEach
        })//Fin de forEach
    }//Fin del metodo

    /**
     * Busca la categorías que coincida con el identificador
     * @param {number} categoryId Identificador de la categorías a buscar
     * @returns {Category} Una instancia de Category o Null
     */
    getCategory(categoryId){
        let category = null;
        let coincidences = this.allCategories.filter(catg => catg.id === categoryId);

        if(coincidences.length > 0){
            category = coincidences[0];
        }

        return category;
    }

    /**
     * Crea todas las instancias de etiqueta usadas en la aplicacion
     * @param {array} labels Arreglo de los datos de las etiquetas obtenidos del servidor
     */
    createAllLabels(labels){
        labels.forEach(label =>{
            this.allLabels.push(new Label(label.id, label.name));
        });//Fin de forEach

        this.allLabels.sort((l1, l2) => l1.name > l2.name);
    }

    /**
     * Busca la categoría que coincida con el identificador
     * @param {number} labelId Identificador de la etiqueta a recuperar
     */
    getLabel(labelId){
        let coincidences = this.allLabels.filter(label => label.id === labelId);
        if(coincidences.length > 0){
            return coincidences[0];
        }

        return null;
    }

    createAllItems(dataItems){
        dataItems.forEach(item => {
            // console.log(item.outstanding)
            let newItem = new Item(item.id, item.name, item.description, item.retailPrice, item.ref, item.barcode, item.gender, item.stock, item.published, item.isNew, item.outstanding, item.dischargeDate);

            //Ahora agrego las categorías
            let categories = [];
            item.categories.forEach(categoryId => {
                let category = this.getCategory(categoryId);
                categories.push(category);
            })//Fin de forEach

            categories.sort((a,b) => a.categoryClass - b.categoryClass);

            categories.forEach(category => {
                newItem.addCategory(category);
            })

            //Ahora agrego las etiquetas
            item.labels.forEach(labelId => {
                let label = this.getLabel(labelId);
                newItem.addLabel(label);
            })

            //Agrego las imagenes
            item.images.forEach(img => {
                let image = new ItemImage(img.src, img.width, img.height);
                newItem.addImages(image);
            })

            //Lo agrego al arreglo
            this.allItems.push(newItem);
        })//Fin de forEach
    }

    /**
     * Guarda un instancia de etiqueta en el arrglo de etiquetas asignadas si no se
     * encuentra ya en el mismo.
     * @param {number} labelId Identificador de la etiqueta qe se quiere asignar 
     */
    assignLabel(labelId){
        if(!isNaN(labelId) && labelId > 0){
            let label = this.getLabel(labelId);
            if(label){
                let coincidence = this.selectedLabels.some(l => l.id === label.id);
                if(!coincidence){
                    this.selectedLabels.push(label);
                    this.selectedLabels.sort((a,b) => a.name > b.name);
                }//Fin de if
            }//Fin de if
        }//Fin de if
    }//Fin del metodo

    /**
     * Elimina la etiqueta de la seleccion 
     * @param {number} labelId Identificador de la etiqueta a remover
     */
    dellocateLabel(labelId){
        if(!isNaN(labelId) && labelId > 0){
            let index = this.selectedLabels.findIndex(l => l.id === labelId);
            if(index >= 0){
                this.selectedLabels.splice(index, 1,);
            }//Fin de if
        }//Fin de if
    }//Fin del metodo

    /**
     * Agrega o quita la categoría del path cumpliendo los requisitos
     * @param {number} categoryId Identificador de la categoría a remover que puede tomar valores menores y mayores a cero
     */
    addCategoryToPath(categoryId){
        if(!isNaN(categoryId)){
            if(categoryId < 0){
                this.removeLastCategoryToPath();
            }else if(categoryId > 0){
                let category = this.getCategory(categoryId);
                if(category){
                    if(this.fatherCategory){
                        if(this.fatherCategory.isFatherOf(categoryId)){
                            this.selectedCategories.push(category);
                            this.fatherCategory = category;
                        }//Fin de fi
                    }else{
                        this.fatherCategory = category;
                        this.selectedCategories.push(category);
                    }//Fin de if else
                }//Fin de if
            }//Fin de if else
        }//Fin de if
    }//Fin del metodo

    /**
     * Remueve la ultima categoría del path y actualiza fatherCategory
     */
    removeLastCategoryToPath(){
        if(this.selectedCategories.length > 0){
            this.selectedCategories.pop();
            if(this.selectedCategories.length > 0){
                this.fatherCategory = this.selectedCategories[this.selectedCategories.length -1];
            }else{
                this.fatherCategory = null;
            }
        }
    }

    /**
     * Este metodo verifica de manera local si el nombre que se intenta agregar no está en blanco,
     * si tiene la logitud correcta y no se encuentra ya en los productos registrados
     * @param {string} name El nombre del producto que se desea validar
     */
    validateItemName(name){
        let validation = new ItemValidation();
        //Primero se determina si la variables existe y si es un string
        if(name && typeof name === 'string'){
            name = name.trim();
            if(name.length > 0){
                if(name.length <= 100){
                    //En este punto se verifica que no exista ninguna coincidencia
                    let coincidence = this.allItems.some(item => item.name.toUpperCase() === name.toUpperCase());
                    if(!coincidence){
                        validation.ok = true;
                    }else{
                        validation.message = "El nombre ya está en uso";
                        validation.alertType = 'danger';
                    }
                }else{
                    validation.message = "Se supera el maximo numero de caracteres";
                    validation.alertType = 'danger';
                }//Fin de if else
            }else{
                validation.message = "No puede estar en blanco";
                validation.alertType = 'danger';
            }//Fin de if else
        }else{
            validation.message = 'Este campo es obligatorio'
            validation.alertType = 'danger';
        }//Fin de if else

        validation.value = name;
        return validation;
    }//Fin del metodo

    /**
     * Hace todas las validaciones pertinentes 
     */
    validateItemPrice (retailPrice) {
        let validation = new ItemValidation();

        if(typeof retailPrice !== 'undefined' && typeof retailPrice === 'string'){
            if(retailPrice.length === 0){
                retailPrice = 0;
            }else{
                //Se elimina el signo peso
                retailPrice = retailPrice.replace('$', '');
                retailPrice = retailPrice.replace('.', '');
                //Se convierte a numero float
                retailPrice = parseFloat(retailPrice);
                if(isNaN(retailPrice)){
                    retailPrice = 0;
                }//Fin de if
            }//Fin de if-else

            if(retailPrice >= 0){
                validation.ok = true;

                if(retailPrice === 0){
                    validation.message = 'El precio al publico es cero';
                    validation.alertType = 'warning';
                }else if(retailPrice > 5e5){
                    validation.message = 'Supera a la media';
                    validation.alertType = 'warning';
                }
            }else{
                validation.message = 'Debe ser mayor que cero';
                validation.alertType = 'danger';
            }
        }else{
            validation.message = "No es un numero";
            validation.alertType = 'danger';
        }

        validation.value = retailPrice;
        return validation;
    }//Fin del metodo

    /**
     * Valida y reevalua la variable
     * @param {string} stock Valor del stock 
     */
    validateItemStock(stock){
        stock = parseInt(stock);

        if (isNaN(stock)) {
            itemStock.value = 0;
        } else {
            if (stock < 0) {
                stock = 0;
            }
        }

        return new ItemValidation(true, stock);
    }//Fin del metodo

    /**
     * Si la referencia no está en blanco verifica si no está repetida
     * @param {string} ref Referencia de compra
     */
    validateItemRef(ref){
        let result = false, message = '', alert ='';
        if(typeof ref === 'string'){
            ref = ref.trim();
            result = true;
            if(ref.length > 0){
                let coincidence = this.allItems.some(item => item.ref === ref);
                if(coincidence){
                    message = 'Esta referencia está repetida';
                    alert = 'warnig';
                }//Fin de if
            }//Fin de if
        }else{
            message = 'No tiene el formato adecuado';
            alert = 'danger';
        }

        return new ItemValidation(result, ref, alert, message);
    }//Fin del metodo

    validateItemBarcode(barcode){
        let result = false, message = '', alert ='';
        if(typeof barcode === 'string'){
            barcode = barcode.trim();
            result = true;
            if(barcode.length > 0){
                let coincidence = this.allItems.some(item => item.barcode === barcode);
                if(coincidence){
                    message = 'Este codigo está repetido';
                    alert = 'warnig';
                }//Fin de if
            }
        }else{
            message = 'No tiene el formato adecuado';
            alert = 'danger';
        }

        return new ItemValidation(result, barcode, alert, message);
    }//Fin del metodo

    validateItemGender(gender){
        let result = true, message = '', alert ='';
        if(typeof gender === 'string'){
            if(gender.length === 0 || gender.length > 1){
                gender = 'x';
            }else{
                if(gender !== 'x' && gender !== 'f' && gender !== 'm'){
                    gender = 'x';
                }
            }
        }

        return new ItemValidation(result, gender);
    }

    
    validateItemDescription (description){
        let validation = new ItemValidation();
        if(typeof description !== 'undefined' && typeof description === 'string'){
            description = description.trim();
            if(description.length > 0){
                if(description.length <= 255){
                    validation.ok = true;
                    if(description.length < 45){
                        validation.message = 'La descripcion es bastante corta';
                        validation.alertType = 'warning';
                    }//Fin de if
                }else{
                    validation.message = 'La descripción supera el maximo de caracteres permitidos';
                    validation.alertType = 'danger';
                }//Fin de if else
            }else{
                validation.message = "Este campo no puede ir en blanco";
                validation.alertType = 'danger';
            }//Fin de if else
        }else{
            validation.message = "No es un campo valido";
            validation.alertType = 'danger';
        }//Fin de if else

        validation.value = description;
        return validation;
    }//Fin del metodo

    validateItemCategories(){
        let categoryClass = 1;
        let lastCategory = null;
        let result = true;
        //En primer lugar se ordenan las categorias por su clase
        this.selectedCategories.sort((a,b) => a.categoryClass - b.categoryClass);

        for(let index = 0; index < this.selectedCategories.length; index++){
            const category = this.selectedCategories[index];

            if(categoryClass === 1){
                if(categoryClass === category.categoryClass){
                    lastCategory = category;
                    categoryClass++;
                }else{
                    result = false;
                    break;
                }//Fin de if-else
            }else{
                if(categoryClass === category.categoryClass && lastCategory.isFatherOf(category.id)){
                    categoryClass++;
                    lastCategory = category;
                }else{
                    result = false;
                    break;
                }
            }//
        }//Fin de for

        return new ItemValidation(result, this.selectedCategories);
    }

    async sendData(name, retailPrice, stock, ref, barcode, gender, isNew, outstanding, published, description, images, categories, labels, action){
        let data = new FormData();
        data.append('name', name);
        data.append('retail_price', retailPrice);
        data.append('stock', stock);
        data.append('ref', ref);
        data.append('barcode', barcode);
        data.append('gender', gender);
        data.append('is_new', isNew);
        data.append('outstanding', outstanding);
        data.append('published', published);
        data.append('description', description);
        data.append('images_path', JSON.stringify(images));
        data.append('categories', JSON.stringify(categories));
        data.append('labels', JSON.stringify(labels));

        //Ahora se hace la peticion fetch
        await fetch('./api/new_item.php', {
            method: 'POST',
            body: data
        })
        .then(res => res.json())
        .then(async res => {
            if(res.sessionActive){
                if(res.request){
                    alert('El producto fue creado satisfactoriamente');
                    this.selectedCategories = [];
                    this.selectedLabels = [];
                    this.fatherCategory = null;
                    await this.getData();
                    action();
                }
            }else{
                location.reload();
            }//Fin de if-else
        });
    }
}