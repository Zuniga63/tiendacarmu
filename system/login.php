<?php
require './includes/functions.php';
$error = '';

//Si la session del usuario está activa moevo al usuario al home
if (session_active()) {
    go_to_page('./home.php');
}

//Ya se sabe que la sesion no está activa pero antes de cargar
//la vista debo verificar que no se han enviado datos post
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = trim(htmlspecialchars($_POST['username']));
    $password = hash('sha512', $_POST['password']);

    if (login($username, $password)) {
        go_to_page('./home.php');
    } else {
        $error = "Contraseña o usuario incorrectos";
    }
}

//Finalmente o no se enviaron datos o hubo un error; se carga la vista
require('./includes/frontend/login-view.php');