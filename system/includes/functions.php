<?php

/**
 * @Funciones utilizadas por las vistas a las que accede el usuario
 * @version 0.1
 * @author Andrés Zuñiga <andres.zuniga.063@gmail.com>
 * History
 * ---
 * La primera version fue escrita por Andrés Zuñiga el 20 de mayo de 2020
 */

/*
 * Estas funciones solo están disponibles si existe una session activa
 * y ya que todas vistas requieren de este archivo entonces se inicía aquí
 */
session_start();
require 'config.php';


//---------------------------------------------------------------------------------------
//                  FUNCIONES PARA LA CONEXION A LA BASE DE DATOS
//---------------------------------------------------------------------------------------
/**
 * Utilizando los datos en el archivo config.php para la conexion a la base de datos
 * este metodo retonar un objeto PDO o null si la conexion falla. 
 */
function get_connection()
{
    $link = null;
    $host = HOST;
    $dataBase = MAIN_DATABASE;
    try {
        $link = new PDO("mysql:host=$host;dbname=$dataBase", MAIN_USER, MAIN_PASSWORD);
        $link->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $link->exec("set names utf8");
    } catch (PDOException $e) {
        $message = $e->getMessage();
        write_error("Error al intentar crear la conexion a la base de datos => $message");
    }

    return $link;
}

//---------------------------------------------------------------------------------------
//             FUNCIONES QUE PERMITEN A UN USUARIO LOGEARSE
//---------------------------------------------------------------------------------------
/**
 * Verifica que el usuario y contraseña coincidan con una entrada en la base de datos
 * @return {BOLEAN} TRUE el caso de encontrar coincidencia y FALSE cuando falla o no encuentra nada
 */
function validate_user_and_password($username, $password)
{
    if (isset($username) && isset($password)) {
        //Se quitan los espacion en blanco del usuario y se comprueba que no esta lleno de espacios vacíos
        $username = trim($username);

        if (!empty($username) && !empty($password)) {
            try {
                $conn = get_connection();
                if ($conn) {
                    $stmt = $conn->prepare("SELECT user_id FROM user WHERE username = :username AND password = :password LIMIT 1");
                    $stmt->bindParam(':username', $username, PDO::PARAM_STR);
                    $stmt->bindParam(':password', $password, PDO::PARAM_STR);
                    $stmt->execute();

                    if ($stmt->fetch()) {
                        return true;
                    }
                }
            } catch (PDOException $e) {
                $message = $e->getMessage();
                $message = "Error al hacer la consulta del usuario => $message";
                write_error($message);
            }
        }
    }

    return false;
}

/**
 * Este metodo crea las cookies de session en el caso de que el usuario
 * y la contraseña sean correctas y posteriormente actualiza la base de datos
 * @param {string} $username El nombre de usuario 
 * @param {string} $password Es la contraseña ya cifrada
 */
function login($username, $password)
{
    $validation = validate_user_and_password($username, $password);
    if($validation){
        $_SESSION['user'] = $username;
        $_SESSION['login_date'] = time();
        $conn = get_connection();
        $user_id = 0;

        try {
            $conn->beginTransaction();
            $stmt = $conn->query("SELECT user_id AS id, first_name FROM user WHERE username = '$username' LIMIT 1");

            if ($row = $stmt->fetch()) {
                $user_id = intval($row['id']);
                $_SESSION['first_name'] = $row['first_name'];
                $_SESSION['user_id'] = $user_id;

                $conn->query("UPDATE user SET start_session = CURRENT_TIMESTAMP() WHERE user_id = $user_id");
                $conn->query("INSERT INTO user_log (user_id, log_description) VALUES ($user_id, 'Inicio de sesión')");
            }

            $conn->commit();
            return true;
        } catch (Exception $e) {
            $message = $e->getMessage();
            $message = "Error al intentar hacer login => $message";
            write_error($message);
            $conn->rollBack();
        }
    }

    return false;
}

/**
 * Esta funcion actualiza la tabla de usuario y crea un registro de seguimiento
 * antes de destruir la sesion
 */
function logout()
{
    /**
     * Antes de destruir los datos de sesion debo actualizar 
     * la tabla user de la base de datos y poner en null el 
     * campo start_session y actualizar el log
     */
    if ($_SESSION['user']) {
        $username = $_SESSION['user'];
        $user_id = intval($_SESSION['user_id']);
        $conn = get_connection();

        if($conn){
            try {
                $conn->beginTransaction();
                $stmt = $conn->prepare('UPDATE user SET start_session = NULL WHERE user_id = :user_id AND username = :user_name');
                $stmt->bindParam(':username', $username, PDO::PARAM_STR);
                $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
                $stmt->execute();
    
                //Finalmente actualizo el log
                $conn->query("INSERT INTO user_log (user_id, log_description) VALUES ($user_id, 'Cierre de la sesión')");
                $conn->commit();
            } catch (PDOException $e) {
                $message = 'Error al conectar a la base de datos: ' . $e->getMessage();
                write_error($message);
                $conn->rollBack();
            }
        }//Fin de if
    }

        /**
     * Ahora se procede a destruir la sesión, independiente de lo anterior
     */
    session_destroy();
    $datos_cookie = session_get_cookie_params();
    setcookie(
        session_name(),
        null,
        time() - 999999,
        $datos_cookie["path"],
        $datos_cookie["domain"],
        $datos_cookie["secure"],
        $datos_cookie["httponly"]
    );

    $_SESSION = array();
    go_to_page('index.php');
}

/**
 * Retorna la fecha del ultimo acceso del usuario
 */
function get_last_access()
{
    $last_access = 0;
    if (isset($_SESSION['login_date'])) {
        $last_access = $_SESSION['login_date'];
    }

    return $last_access;
}

/**
 * Esta función retornará el estado de la session:
 * Sesion activa retornará true y sesion innactiva retornará false.
 * Al mismo tiempo se encargará de actualizar la variable de sesion 
 * login_date cuando la sesion se encuentre activa
 */
function session_active()
{
    $sesion_state = false;
    $last_access = get_last_access();

    /**
     * Se establece el limite maximo de inactividad para mantener la sesion activa
     * de unas cuatro horas 14.400 segundos
     */
    $limit_accsess = $last_access + 14400;

    if ($limit_accsess > time()) {
        $sesion_state = true;
        $_SESSION['login_date'] = time();
    }

    return $sesion_state;
}

/**
 * Esta es la funcion que se invocará desde cada una de la páginas 
 * a las cuales querramos restringir el acceso
 */
function validate_session()
{
    if (!session_active()) {
        logout();
        go_to_page('login.php');
    }
}
//---------------------------------------------------------------------------------------
//                      UTILIDADES
//---------------------------------------------------------------------------------------
/**
 * Este metodo escribe en el fichero los errores que se van capturando 
 * por la ejecucion del codigo y le agrega la fecha del servidor
 * @param (string) $message El mensaje que se desea escribir
 */
function write_error($message)
{
    $path = './error.log';
    $now = date('d/m/y H:i a');
    $message = "[$now]: $message\n\r";

    if (file_exists($path)) {
        $cursor = fopen($path, 'a+');
        fwrite($cursor, $message);
        fclose($cursor);
    }
}

/**
 * Envía la cabecera a la nueva bicacion
 * @param {string} $page nombre de la pagína a visitar
 */
function go_to_page($page)
{
    if (isset($page) && !empty($page)) {
        header("location: $page");
    }
}