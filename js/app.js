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
const showMenu = menu => {


    if (menu.classList.contains('show')) {
        //Si el menú está visible simplemente se elimina el atributo que modifica el height
        menu.classList.remove('show');
        menu.removeAttribute('style');
    } else {
        //Antes de modificar el alto del menú debo saber cual el el height total
        let height = 0;

        //Obtengo los elementos hijo
        let children = menu.children;

        for (let index = 0; index < children.length; index++) {
            const child = children[index];

            let style = window.getComputedStyle(child);
            //Obtengo los valores de los margenes
            let margins = parseFloat(style['marginTop']) + parseFloat(style['marginBottom']);
            //Sumo el alto del elemento y le sumo los margenes
            height += child.offsetHeight + margins;
        }

        //Se aproxima para obtener un entero
        height = Math.ceil(height);

        menu.classList.add('show');
        //Se modifica el alto del menu
        menu.style.height = `${height}px`

    }

}


const mainMenuController = () => {
    //Se recupera el toggler de la barra de menú
    const navbarToggler = document.getElementById('navbar-toggler');
    //Se recupera el objeto que se colapsa segun el toggler
    const navbarCollapse = document.getElementById('navbar-collapse');

    navbarToggler.addEventListener('click', () => {
        showMenu(navbarCollapse);
    })


    
}

window.addEventListener('load', () => {
    mainMenuController();
})