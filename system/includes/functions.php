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
$message_exeption = '';


//---------------------------------------------------------------------------------------
//                  FUNCIONES PARA LA CONEXION A LA BASE DE DATOS
//---------------------------------------------------------------------------------------
/**
 * Este metodo retonar una conexion PDO en el caso de extablecer con exito la conexion
 * pero retorna null y modifica el mensaje de error en el caso de fallar
 */
function get_connection(){
    $link = null;
    $host = HOST;
    $dataBase = MAIN_DATABASE;
    try
    {
        $link = new PDO("mysql:host=$host;dbname=$dataBase", MAIN_USER, MAIN_PASSWORD);
        $link->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $link->exec("set names utf8");
    }
    catch(PDOException $e)
    {
        global $message_exeption;
        $message_exeption = "Error al intentar conectar con la base de datos";
    }

    return $link;
}

//---------------------------------------------------------------------------------------
//             FUNCIONES QUE CONTROLAN LA CONEXION A LA BASE DE DATOS
//---------------------------------------------------------------------------------------
/**
 * Valida en la base de datos que el usuario y el password existe
 * @return {bolean} TRUE el caso de encontrar coincidencia y FALSE cuando falla o no encuentra nada
 */
function validate_user_and_password($username, $password)
{
    if (isset($username) && isset($password)) {
        //Se quitan los espacion en blanco del usuario y se comprueba que no esta lleno de espacios vacíos
        $username = trim($username);
        if (!empty($username) && !empty($password)) {
            $conn = get_connection();
            $stmt = $conn->prepare("SELECT user_id FROM user WHERE username = :username AND password = :password LIMIT 1");
            $stmt->bindParam(':username', $username, PDO::PARAM_STR);
            $stmt->bindParam(':password', $password, PDO::PARAM_STR);
            $stmt->execute();

            if ($stmt->fetch()) {
                return true;
            }
        }
    }

    return false;
}


