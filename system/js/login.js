/**
 * @fileoverview Controlador de los efectos de los campos y la habilitacion del boton envíar
 * @version 1.0
 * @author Andrés Zuñiga <andres.zuniga.063@gmail.com>
 * History
 * ---
 * La primera version fue escrita por Andrés Zuñiga el 28 de mayo de 2020
 */
const username = document.getElementById('username');
const password = document.getElementById('password');
const ACTIVE = 'login-card__input--active';
const disabled = 'btn--disabled';

window.addEventListener('load', () => {
    console.log('Funcionando');

    if (localStorage.username) {
        username.value = localStorage.username;
    }

    username.addEventListener('input', () => {
        localStorage.username = username.value;
        validateFields();
    })

    username.addEventListener('focus', () => {
        username.select();
        hasFocus('username');
    })

    username.addEventListener('blur', ()=>{
        hasFocus();
    })

    password.addEventListener('input', () => {
        validateFields();
    })

    password.addEventListener('focus', () => {
        password.select();
        hasFocus('password');
    })

    password.addEventListener('blur', ()=>{
        hasFocus();
    })
})

/**
 * Este metodo verifica que los dos campos por lomenos tengan datos y que la
 * contraseña ingresada tenga como minimo 8 caracteres
 */
const validateFields = () => {
    let btn = document.querySelector('.btn');
    if (username.value && password.value) {
        if (password.value.length >= 8) {
            btn.classList.remove(disabled);
            btn.removeAttribute('disabled');
        } else {
            btn.classList.add(disabled);
            btn.setAttribute('disabled', '');
        }
    } else {
        btn.classList.add(disabled);
        btn.setAttribute('disabled', '');
    }
}

/**
 * Este metodo le agrega la clase ACTIVE al elementos padre del campo
 * que tiene actualmente el foco
 * @param {string} element El nombre del campo que tiene el foco
 */
const hasFocus = element => {
    switch (element) {
        case 'username': {
            password.parentNode.classList.remove(ACTIVE);
            username.parentNode.classList.add(ACTIVE);
        }
            break;
        case 'password': {
            username.parentNode.classList.remove(ACTIVE);
            password.parentNode.classList.add(ACTIVE);
        }
            break;
        default: {
            username.parentNode.classList.remove(ACTIVE);
            password.parentNode.classList.remove(ACTIVE);
        }
    }
}