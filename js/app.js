console.log('Funcionando')

//------------------------------------------------------------------------------------------------
//                              CONTROLADORES DE LOS MENÚS
//------------------------------------------------------------------------------------------------

/**
 * Este metodo obtiene como parametro un menu colapsable y lo que hace es cambiar el alto para
 * que se vea u oculte. Cuando se va a mostrar lo que hace es calcular el alto de los elementos
 * hijos
 * @param {*} menu Es el menú html al que se le va a modificar el alto
 */
const showMenu = (menu, fatherMenu = undefined) => {

    //Se obtiene el alto del menu que se quiere modificar
    height = elementHeight(menu);

    /**
     * Si el menu está visible simplemnete se elimina el atributo
     * style y este por defecto termina con la propiedad height en 0px
     */
    if (menu.classList.contains('show')) {
        /**
         * Si es un dropdown dentro de otro menú deslegable antes de
         * remover el atributo style del menú se modifica el alto del menú padre
         */ 
        if(fatherMenu){
            let fatherHeight = elementHeight(fatherMenu) - height;
            fatherMenu.style.height = `${fatherHeight}px`;
            // console.log(fatherMenu);
        }

        menu.classList.remove('show');
        menu.removeAttribute('style');
    } else {
        menu.classList.add('show');

        /**
         * Se modifica el alto del menú padre en el caso de que sea un 
         * dropdown dentro de otro panel de navegacion
         */
        if(fatherMenu){
            let fatherHeight = height + elementHeight(fatherMenu);
            fatherMenu.style.height = `${fatherHeight}px`;
            // console.log(fatherMenu);
        }

        menu.style.height = `${height}px`

    }

}

/**
 * Recorre los hijos del elemento y va computando margenes y paddin para obtener el
 * alto en pixeles que el cliente ve en pantalla
 * @param {object} element Elemento del dom al que se va a calcular el alto
 */
const elementHeight = element => {
    //Antes de modificar el alto del menú debo saber cual el el height total
    let height = 0;

    //Obtengo los elementos hijo
    let children = element.children;

    for (let index = 0; index < children.length; index++) {
        const child = children[index];

        let style = window.getComputedStyle(child);
        //Obtengo los valores de los margenes
        let margins = parseFloat(style['marginTop']) + parseFloat(style['marginBottom']);
        //Sumo el alto del elemento y le sumo los margenes
        height += child.offsetHeight + margins;
    }

    //Se aproxima para obtener un entero
    return Math.ceil(height);
}

const mainMenuController = () => {
    //Se recupera el toggler de la barra de menú
    const navbarToggler = document.getElementById('navbar-toggler');
    //Se recupera el objeto que se colapsa segun el toggler
    const navbarCollapse = document.getElementById('navbar-collapse');

    navbarToggler.addEventListener('click', () => {
        showMenu(navbarCollapse);
    })

    //Ahora se agrega la funcionalidad a los dropdown
    const dropdowns = document.getElementsByClassName('dropdown');
    for (let index = 0; index < dropdowns.length; index++) {
        const dropdown = dropdowns[index];
        //Al hacer click en un dropwn se debe desplegar el menú
        let dropdownIcon = dropdown.querySelector('.dropdown__icon');
        dropdownIcon.addEventListener('click', () => {
            //Se selecciona el menu
            let dropdownMenu = dropdown.querySelector('.dropdown__nav');
            if (dropdownMenu) {
                if(dropdownMenu.classList.contains('show')){
                    dropdownIcon.classList.remove('rotate');
                }else{
                    dropdownIcon.classList.add('rotate');
                }

                showMenu(dropdownMenu, navbarCollapse);
            }

        });//Fin de addEventListener
    }//Fin de for

}

window.addEventListener('load', () => {
    mainMenuController();
})

//----------------------------------------------------------------------------------------------
//                              SLIDERS
//----------------------------------------------------------------------------------------------
/**
 * Contiene los sliders que poseen autoplay
 */
let sliderIntervals = [];
const sliderController = () => {
    //Se recuperan todos los sliders del docuemento
    const sliders = document.querySelectorAll('.slider');
    sliders.forEach(slider => {
        //Se recupera el contenedor para poder ajustarle el ancho segun los elementos
        const sliderContainer = slider.querySelector('.slider__items');
        const btnNext = slider.querySelector('.slider__btn-next');
        const btnPrev = slider.querySelector('.slider__btn-prev');
        const items = sliderContainer.querySelectorAll('.slider__item');
        let id = slider.getAttribute('id');

        if (items && items.length > 0) {
            //Se ajusta el ancho del contenedor
            sliderContainer.style.width = `${items.length * 100}%`;
            //Se mueve el ultimo elemento al inicio
            sliderContainer.insertBefore(items[items.length - 1], items[0]);
            //Se mueve el margen un 100% a la izquierda
            sliderContainer.style.marginLeft = '-100%';

            //Si el slider tiene botones se agrega la funcionalidad
            if (btnNext && btnPrev) {
                btnNext.addEventListener('click', (e) => {
                    sliderNext(id, 700);
                    sliderAutoplayStop(searchSliderRoot(e.target));
                })

                btnPrev.addEventListener('click', (e) => {
                    sliderPrev(id, 700);
                    sliderAutoplayStop(searchSliderRoot(e.target));
                })
            }//Fin de if
        }//Fin de if
    })//Fin de forEach

    sliderAutoplay('textHeader', 1000, 2500);
}

/**
 * Mueve los elementos del slider hacia la izquierda y al finalizar ubica 
 * el primer elemento al final de la cola
 * @param {string} sliderId Es el identificador del slider
 * @param {Int32Array} duration tiempo en milisegundo
 */
const sliderNext = (sliderId, duration = 700) => {
    let slider = sliderParam(sliderId);

    slider.container.animate({ marginLeft: '-200%' }, duration, () => {
        $(slider.firstItem).insertAfter(slider.lastItem);
        slider.container[0].style.marginLeft = '-100%';
    })
}

/**
 * Mueve los elementos del slider de derecha a izquierda y al finalizar
 * ubica el ultimo elemento al inicio de todo
 * @param {string} sliderId El id del eslider que se quiere modificar
 * @param {int} duration El tiempo de la animacion en ms 700 ms por defecto
 */
const sliderPrev = (sliderId, duration = 700) => {
    let slider = sliderParam(sliderId);

    slider.container.animate({ marginLeft: '0' }, duration, () => {
        $(slider.lastItem).insertBefore(slider.firstItem);
        slider.container[0].style.marginLeft = '-100%';
    })
}

const searchSliderRoot = eTarget => {
    let parent = eTarget.parentNode;
    while (!parent.getAttribute('id')) {
        parent = parent.parentNode;
    }

    return parent.getAttribute('id');
}

/**
 * Este metodo recupera el contendor del slider, el primer elemento y el ultimo
 * @param {string} sliderId Identificador del slider
 * @return {JSON} slider 
 */
const sliderParam = (sliderId) => {
    return {
        container: $(`#${sliderId} .slider__items`),
        firstItem: $(`#${sliderId} .slider__item:first`),
        lastItem: $(`#${sliderId} .slider__item:last`)
    }
}

/**
 * Agrega un intervalo de movimiento del slider que por defecto la animacion dura 700 ms 
 * y el tiempo del intervalo es de 1000 ms
 * @param {string} sliderId El identificador del slider
 * @param {int} duration es la velocidad de la animacion
 * @param {int} time tiempo en el que se repite el intervalo
 */
const sliderAutoplay = (sliderId, duration = 700, time = 1000, toRight = true) => {
    let interval = null;
    let slider = null;

    //En primer lugar se va a detener el intervalo que se está ejecuntado si lo hay
    sliderIntervals.forEach(item => {
        if (item.sliderId === sliderId) {
            clearInterval(item.interval);
            slider = item;
        }
    });

    //Se pone en marcha el nuevo intervalo
    interval = setInterval(() => {
        if (toRight) {
            sliderNext(sliderId, duration);
        } else {
            sliderPrev(sliderId, duration);
        }
    }, time);

    //Se actualiza o se crea el intervalo
    if (slider) {
        slider.interval = interval;
    } else {
        sliderIntervals.push({ sliderId, interval });
    }
}

/**
 * Este metodo busca en el array de intervalos alguno que coincida con el id pasado
 * como parametro y detiene el proceso de ejecuacion
 * @param {string} sliderId Identificador del slider que tiene el autoplay
 */
const sliderAutoplayStop = sliderId => {
    for (let index = 0; index < sliderIntervals.length; index++) {
        const interval = sliderIntervals[index];
        if (interval.sliderId === sliderId) {
            clearInterval(interval.interval);
            break;
        }
    }
}

//----------------------------------------------------------------------------------------------
//                              GALERÍA DE IMAGENES
//----------------------------------------------------------------------------------------------
const cardGalleryControler = () => {
    //Obtengo todas las tarjetas del documento
    let cards = document.querySelectorAll('.card');

    //Se agrega la funcionalidad a cada una de las tarjetas
    cards.forEach(card => {

        let cardImg = card.querySelector('.card__img');
        let gallery = card.querySelector('.card__gallery');


        if (gallery) {
            let galleryImgs = gallery.querySelectorAll('.card__gallery__img');
            let pill = card.querySelector('.card__pill');

            /**
         * Pendiente que las imagenes de los producto se deben descargar cuando el cliente
         * le de click a la pildora de imagenes
         */
            pill.addEventListener('click', () => {
                if (pill.classList.contains('active')) {
                    pill.classList.remove('active');
                    gallery.classList.remove('show');
                } else {
                    pill.classList.add('active');
                    gallery.classList.add('show');
                }
            })

            galleryImgs.forEach(img => {
                img.addEventListener('click', () => {
                    let src = img.getAttribute('src');
                    let srcDestination = cardImg.getAttribute('src');
                    cardImg.setAttribute('src', src);
                    img.setAttribute('src', srcDestination);
                })
            });
        }
    });
}


//----------------------------------------------------------------------------------------------
//                              UTILIDADES
//----------------------------------------------------------------------------------------------
/**
 * Esta funcion generica funciona para dar formato de moneda a los numeros pasados como parametros
 * @param {string} locales Es el leguaje Eje: es-CO
 * @param {string} currency Eltipo de moneda a utilizar ej: COP
 * @param {number} fractionDigits El numero de digitos decimales que se van a mostrar
 * @param {number} number Es la cantidad de dinero que se va a dar formato
 */
function formatCurrency(locales, currency, fractionDigits, number) {
    var formatted = new Intl.NumberFormat(locales, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: fractionDigits
    }).format(number);
    return formatted;
}

/**
 * Esta es una version simplificada de formatCurreny para moneda colombiana
 * @param {number} number Numero para establecer formato
 * @param {number} fractionDigits Fracciones a mostrar
 */
function formatCurrencyLite(number, fractionDigits) {
    return formatCurrency('es-CO', 'COP', fractionDigits, number);
}

/**
 * Agrega el evento para que se seleccione el texto al obtener el foco
 * @param {DOM} object Input del DOM al que se desea agregar el evento
 */
const selectText = object => {
    object.addEventListener('focus', ()=>{
        object.select();
    })
    object.select();
}

/**
 * Escribe la alerta en pantalla
 * @param {object} uiElement Es la alerta del DOM que se va a modificar
 * @param {string} alertType Tipo de alerta warning, danger, success
 * @param {string} message El mensaje que se desea mostrar
 */
const writeAlert = (uiElement, alertType, message) => {
    uiElement.innerText = message;
    switch (alertType) {
        case 'danger':
            uiElement.classList.add('alert--danger', 'show');
            uiElement.classList.add('show');
            break;
        case 'warning':
            uiElement.classList.add('alert--warning', 'show');
            break;
        case 'success':
            uiElement.classList.add('alert--success', 'show');
            break;
        default:
            uiElement.classList.remove('show');
            break;
    }
}

/**
 * Recibe un objeto html al que va a dar formato al su valor tipo moneda
 * @param {object} object Un input tipo texto al que se le quiere dar formato de moneda a su valor
 */
const formatCurrencyInputText = object => {
    if (object && object.value) {
        let number = parseFloat(object.value);
        if (!isNaN(number)) {
            object.value = formatCurrencyLite(number, 0);
        } else {
            object.value = '';
        }
    }
}