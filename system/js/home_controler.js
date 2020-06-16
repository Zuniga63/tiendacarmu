console.log('Home controler funcionando')

//-------------------------------------------------------------------------------
//                  VARIABLES GLOBALES
//-------------------------------------------------------------------------------
const model = new Controller();

//-------------------------------------------------------------------------------
//                  ELEMENTOS DEL DOM
//-------------------------------------------------------------------------------
const itemName = document.getElementById('itemName');
const itemNameAlert = document.getElementById('itemNameAlert');

const itemRetailPrice = document.getElementById('itemRetailPrice');
const itemRetailPriceAlert = document.getElementById('itemRetailPriceAlert');

const itemStock = document.getElementById('itemStock');
const itemGender = document.getElementById('itemGender');

const itemRef = document.getElementById('itemRef');
const itemRefAlert = document.getElementById('itemRefAlert');

const itemBarcode = document.getElementById('itemBarcode');
const itembarcodeAlert = document.getElementById('itemBarcodeAlert');

const itemDescription = document.getElementById('itemDescription');
const itemDescriptionAlert = document.getElementById('itemDescriptionAlert');
const itemDescriptionLength = document.getElementById('itemDescriptionLength');

const itemIsNew = document.getElementById('itemIsNew');
const itemOutstanding = document.getElementById('itemOutstanding');
const itemPublished = document.getElementById('itemPublished');

const itemCategorySelector = document.getElementById('itemCategorySelector');
const itemCategoryContainer = document.getElementById('itemCategoryContainer');

const itemLabelSelector = document.getElementById('itemLabelSelector');
const itemLabelContainer = document.getElementById('itemLabelContainer')

const itemGalleryContainer = document.getElementById('itemGalleryContainer');

const btnSendData = document.getElementById('btnSendData');
const btnAbort = document.getElementById('btnAbort');

const seachrBox = document.getElementById('seachrBox');
const itemsContainer = document.getElementById('itemsContainer');

/**
 * Este metodo agrega la funcionalidad a todos las cajas de texto para que seleccionen su
 * contenido al obtener el foco
 */
const addSelectToTextBox = () => {
    //En primer lugar se agrega el efecto a todos los elemento form__input
    let inputs = document.querySelectorAll('input.form__input');
    inputs.forEach(el => {
        // el.addEventListener('focus', () => {
        //     selectText(el);
        // })
        selectText(el);
    });

    seachrBox.addEventListener('focus', () => {
        seachrBox.select();
    })

    itemDescription.addEventListener('focus', () => {
        itemDescription.select();
    })
}

/**
 * Hace las validaciones de los campos del formulario cuando estos pierden el foco
 */
const validations = () => {
    //La validacion del nombre del articulo
    itemName.addEventListener('blur', () => {
        let validation = model.validateItemName(itemName.value);
        showValidation(itemName, itemNameAlert, validation);
    })

    //Cuando el precio de venta pierda el foco
    itemRetailPrice.addEventListener('blur', () => {
        let validation = model.validateItemPrice(itemRetailPrice.value);
        showValidation(itemRetailPrice, itemRetailPriceAlert, validation);
    });

    //El stock por defecto debe ser mayor o igual a cero
    itemStock.addEventListener('blur', () => {
        let stock = parseInt(itemStock.value);
        if (isNaN(stock)) {
            itemStock.value = 0;
        } else {
            if (stock < 0) {
                itemStock.value = 0;
            }
        }
    })

    //Se hacen las validaciones pertinentes a la descripcion
    itemDescription.addEventListener('blur', () => {
        let descripcion = itemDescription.value;
        let validation = model.validateItemDescription(descripcion);
        showValidation(itemDescription, itemDescriptionAlert, validation);
    })

    itemDescription.addEventListener('input', () => {
        const MAX_LENGTH = 255;
        let length = itemDescription.value.length;
        let charFree = MAX_LENGTH - length;

        if (charFree >= 0) {
            itemDescriptionLength.innerText = charFree;
            itemDescriptionLength.style.color = 'black';
        } else {
            itemDescriptionLength.innerText = charFree * -1;
            itemDescriptionLength.style.color = 'red';
        }
    })
}

/**
 * Muestra en pantalla el resultado de la validacion del campo
 * @param {object} input Elemento del DOM que corresponde a un input con alerta
 * @param {object} inputAlert Alerta del input
 * @param {ItemValidation} validation Es el resultado de la validacion
 */
const showValidation = (input, inputAlert, validation) => {
    if (validation.ok) {
        input.classList.remove('error');
        writeAlert(inputAlert, validation.alertType, validation.message);
    } else {
        input.classList.add('error');
        writeAlert(inputAlert, validation.alertType, validation.message);
    }
}



/**
 * Pinta en pantalla los imagenes que se encuentran disponibles para
 * la seleccion y luego les agrega la fincionalidad de que se seleccionen
 * al hacer click
 */
const printAvailableImages = () => {
    let htmlCode = '';
    model.availableImages.forEach(img => {
        htmlCode += `
        <figure class="form__gallery__fig" name = "${img.src}">
            <img src="../${img.src}" loading="lazy" class="form__gallery__img">
        </figure>`;
    });

    itemGalleryContainer.innerHTML = htmlCode;

    //Al hacer click a cada una de las imagenes de la galería se debe
    //seleccionar inmediatamente
    itemGalleryContainer.querySelectorAll('.form__gallery__fig').forEach(img => {
        img.addEventListener('click', () => {
            img.classList.toggle('select');
        })
    })
}

const printLabels = () => {
    //Se agrega el valor por defecto
    let htmlCode = '<option value="0">Seleccionar Etiqueta</option>';
    model.allLabels.forEach(label => {
        htmlCode += `<option value="${label.id}">${label.name}</option>`;
    })

    itemLabelSelector.innerHTML = htmlCode;

    /**
     * Se agrega la fucionalidad al selector:
     * La cual consiste en llamar al modelo y decirle que asigne el valor
     * del selector y busque la etiqueta correspondiente.
     * Posteriormente lo que haces es actualizar el contendor de etiquetas con las etiquetas
     * asignadas dentro del modelo y finalmente agrega la funcinalidad al boton para borrarla
     */
    itemLabelSelector.addEventListener('change', () => {
        model.assignLabel(parseInt(itemLabelSelector.value));
        updateLabelContainer();
    })//Fin de addEventListener
}

/**
 * Actualiza el contedor de etiquetas y agrega la funcionalidad a cada una
 * de las tarjetas para que puedan eliminarse al darle click
 */
const updateLabelContainer = () => {
    htmlCode = '';
    model.selectedLabels.forEach(label => {
        htmlCode += `
            <div class="form__selected__item" labelId = "${label.id}">
                <div class="form__selected__item__body">
                    <span>${label.name}</span>
                </div>
                <button class="form__selected__item__append" type="button">X</button>
            </div>`
    })

    itemLabelContainer.innerHTML = htmlCode;

    itemLabelContainer.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
            let labelId = parseInt(btn.parentElement.getAttribute('labelId'));
            console.log(labelId);
            model.dellocateLabel(labelId);
            updateLabelContainer();
        })
    })//Fin de querySelector
}

/**
 * Actualiza el selector de categorías segun los datos en el modelo
 */
const printCategories = () => {
    let htmlCode = '<option value="0">Seleccionar Categoría</option>';
    if (model.fatherCategory) {
        htmlCode += '<option value="-1">Subir un nivel</option>';
        model.fatherCategory.subcategories.forEach(category => {
            htmlCode += `<option value="${category.id}">${category.name}</option>`;
        })
    } else {
        model.allCategories.forEach(category => {
            htmlCode += `<option value="${category.id}">${category.name}</option>`;
        });
    }


    itemCategorySelector.innerHTML = htmlCode;


}

const printItems = () => {
    let htmlCode = '';
    let noImageAvailable = 'img/no-image-available.png';
    model.allItems.forEach(item => {
        //Se seleccioona uno de los parametros multiples
        let image = noImageAvailable;
        let category = item.categories.length > 0 ? item.categories[0] : '';

        if (item.images.length > 0) {
            if (item.images.some(x => x.width <= 400)) {
                let selection = item.images.filter(x => x.width <= 400);
                image = selection[0].src;
            } else {
                image = item.images[0].src;
            }
        }//Fin de if



        htmlCode += `
        <div class="item-info" item_id = "${item.id}">
            <!--IMAGEN DEL PRODUCTO -->
            <div class="item-info__fig">
                <img src="../${image}" alt="${item.name}" loading="lazy" class="item-info__img">
            </div>

            <div class="item-info__body">
                <h3 class="item-info__name">${item.name}</h3>
                <p class="item-info__label">Stock: <span class="item-info__value">${item.stock}</span></p>
                <p class="item-info__label">Ref: <span class="item-info__value">${item.ref}</span></p>
                <p class="item-info__label">Categoría: <span class="item-info__value">${category.name}</span></p>
                <p class="item-info__label">Codigo: <span class="item-info__value">${item.barcode}</span></p>
                <!-- A CONTINUACION SE ENCUENTRAN LOS CAMPOS MODIFICABLES -->
                <div class="item-info__inputs">
                    <input type="text" item_id = "${item.id}" class="item-info__price" value = "${formatCurrencyLite(item.retailPrice, 0)}">
                    <div class="item-info__checks">
                        <label class="item-info__check">
                            <input type="checkbox" item_id = "${item.id}" ${item.isNew ? 'checked' : ''}> NEW
                        </label>
                        <label class="item-info__check">
                            <input type="checkbox" item_id = "${item.id}" ${item.outstanding ? 'checked' : ''}> Destacado
                        </label>
                        <label class="item-info__check">
                            <input type="checkbox" item_id = "${item.id}" ${item.published ? 'checked' : ''}> Publicar
                        </label>
                    </div> <!--FIN DE LA ZONA DE CHECKED-->
                </div> <!--FIN DE ZONA MODIFICABLE-->
            </div> <!--FIN DEL BODY-->
        </div> <!--FIN DE LA TARJETA-->
        `
    });//Fin de forEach

    itemsContainer.innerHTML = htmlCode;
}//Fin del metodo

/**
 * Actualiza el contenedor con las tarjetas de las categorias seleccionadas 
 */
const updateCategoryContainer = () => {
    let htmlCode = '';
    model.selectedCategories.forEach(category => {
        htmlCode += `
        <div class="form__selected__item">
            <div class="form__selected__item__body">
                <span>${category.name}</span>
            </div>
        </div>`
    })//Fin de forEach

    itemCategoryContainer.innerHTML = htmlCode;
}//Fin del metodo

const recoveryData = async () => {
    let allValidations = [];             //Para guardar todas las validaciones realizadas
    let validation = null;

    let name = itemName.value;
    let retailPrice = itemRetailPrice.value;
    let stock = itemStock.value;
    let ref = itemRef.value;
    let barcode = itemBarcode.value;
    let gender = itemGender.value;
    let isNew = itemIsNew.checked;
    let outstading = itemOutstanding.checked;
    let published = itemPublished.checked;
    let description = itemDescription.value;
    let images = getImagesSelected();
    let categories = undefined;
    let labels = model.selectedLabels;

    //Se hace una validacion del nombre del producto
    validation = model.validateItemName(name);
    name = validation.value;
    showValidation(itemName, itemNameAlert, validation);
    allValidations.push(validation);

    //Se hace una validacion del precio de venta al publico
    validation = model.validateItemPrice(retailPrice);
    retailPrice = validation.value;
    showValidation(itemRetailPrice, itemRetailPriceAlert, validation);
    allValidations.push(validation);

    //Se hace una validacion de las unidades en stock
    validation = model.validateItemStock(stock);
    stock = validation.value;
    allValidations.push(validation);

    //Se hace una validacion de la referencia de compra
    validation = model.validateItemRef(ref);
    ref = validation.value;
    showValidation(itemRef, itemRefAlert, validation);
    allValidations.push(validation);

    //Se hace una validacion del codigo de barras
    validation = model.validateItemBarcode(barcode);
    barcode = validation.value;
    showValidation(itemBarcode, itembarcodeAlert, validation);
    allValidations.push(validation);

    //Se valida el genero del producto
    validation = model.validateItemGender(gender);
    gender = validation.value;
    allValidations.push(validation);

    //Se procede a validar la descripcion del producto
    validation = model.validateItemDescription(description);
    description = validation.value;
    showValidation(itemDescription, itemDescriptionAlert, validation);
    allValidations.push(validation);

    //Se procede a validar las categorias seleccionadas
    validation = model.validateItemCategories();
    categories = validation.value;
    allValidations.push(validation);

    let allIsCorrect = allValidations.every(v => v.ok);

    console.log(images);

    if (allIsCorrect) {
        console.log("Todo va correcto");
        await model.sendData(name, retailPrice, stock, ref, barcode, gender, isNew, outstading, published, description, images, categories, labels, reset)

    }
}

const reset = () => {
    itemName.value = '';
    itemNameAlert.classList.remove('show');

    itemRetailPrice.value = '';
    itemRetailPriceAlert.classList.remove('show');

    itemStock.value = 0;

    itemRef.value = '';
    itemRefAlert.classList.remove('show');

    itemBarcode.value = '';
    itemBarcode.classList.remove('show');

    itemGender.value = 'x';

    itemIsNew.checked = false;
    itemOutstanding.checked = false;
    itemPublished.checked = false;

    itemDescription.value = '';
    itemDescriptionAlert.classList.remove('show');
    itemDescriptionLength.innerText = 255;

    printAvailableImages();
    printCategories();
    printLabels();
    printItems();
    updateCategoryContainer();
    updateLabelContainer();

}

const getImagesSelected = () => {
    let images = itemGalleryContainer.querySelectorAll('.form__gallery__fig.select');
    let imagesSrc = [];
    images.forEach(img => {
        imagesSrc.push(img.getAttribute('name'));
    })

    return imagesSrc;
}

window.addEventListener('load', async () => {
    addSelectToTextBox();
    validations();
    itemRetailPrice.addEventListener('blur', () => {
        formatCurrencyInputText(itemRetailPrice);
    });
    // console.log('Antes de la peticio');
    await model.getData();
    // console.log('Despues de la peticion');

    printAvailableImages();
    printLabels();
    printCategories();
    printItems();

    itemCategorySelector.addEventListener('change', () => {
        model.addCategoryToPath(parseInt(itemCategorySelector.value));
        updateCategoryContainer();
        printCategories();
    })

    btnSendData.addEventListener('click', () => {
        console.log('Click');
        recoveryData();
    })
})