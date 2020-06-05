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
 * Utilizando los datos en el archivo config.php para la conexión a la base de datos, 
 * este método retorna un objeto PDO o null si la conexión falla.
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
 * Este método crea las cookies de sesión en el caso de que el usuario
 * y la contraseña sean correctas y posteriormente actualiza la base de datos
 * @param {string} $username El nombre de usuario 
 * @param {string} $password Es la contraseña ya cifrada
 */
function login($username, $password)
{
    $validation = validate_user_and_password($username, $password);
    if ($validation) {
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
 * Esta función actualiza la tabla de usuario y crea un registro de seguimiento
 * antes de destruir la sesión
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

        if ($conn) {
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
        } //Fin de if
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
 * Esta función retornará el estado de la sesión:
 * Sesión activa retornará true y sesión inactiva retornará false.
 * Al mismo tiempo se encargará de actualizar la variable de sesión 
 * login_date cuando la sesión se encuentre activa
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
 * Esta es la función que se invocará desde cada una de las páginas 
 * a las cuales queramos restringir el acceso y re direcciona al login
 */
function validate_session()
{
    if (!session_active()) {
        logout();
        go_to_page('login.php');
    }
}

//---------------------------------------------------------------------------------------
//                      FUNCIONES PARA LA CONSULTA DE DATOS
//---------------------------------------------------------------------------------------
/**
 * Esta funcion retorna una array con los nombres de las imagenes contenidas en 
 * la direccion pasado como parametro
 * @param {string} $path_base Corresponde al numero de carpetas antes del path
 * @param {string} $path Corresponde a la direccion relativa del directorio
 */
function get_all_images($path_base, $path)
{
    $files = [];                        //El array donde se guardan los resultados
    $dir = opendir("$path_base/$path");            //Se abre el directorio

    while ($file = readdir($dir)) {
        if (!is_dir("$file")) {
            if (exif_imagetype("$path_base/$path/$file")) {
                $files[] = "$path/$file";
            }
        }
    }

    return $files;
}
/**
 * Este metodo retorna una array con la direccion de todas las imagenes
 * que han sido asignadas a un producto en especifico
 */
function get_asigned_images()
{
    $all_img_asigned = [];

    try {
        $conn = get_connection();
        $stmt = $conn->query('SELECT src FROM item_image');
        while ($row = $stmt->fetch()) {
            $all_img_asigned[] = $row['src'];
        }
    } catch (PDOException $e) {
        $message = $e->getMessage();
        $message = "Error al consultar las imagenes: $message";
        write_error($message);
    }

    return $all_img_asigned;
}

/**
 * Esta función retorna la direccion relativa de todas las imagenes que no han sido
 * asignadas a ningun producto en especifico
 * @param string $path_base Corresponde al numero de carpetas antes del path relativo
 * @param string $path Es la direccion relativa de la carpeta donde se van a buscar las imagenes
 * @return array Arreglo con la direccion relativa de la imagen, el acnho y el alto
 */
function get_available_images($path_base, $path)
{
    $all_img_asigned = get_asigned_images();
    $all_images = get_all_images($path_base, $path);
    $diff = array_diff($all_images, $all_img_asigned);
    $result = [];

    //Ahora recupero los de las imagenes
    foreach ($diff as $img) {
        $path2 = "$path_base/$img";
        // echo $path2;
        if (file_exists($path2)) {
            if (exif_imagetype($path2)) {
                list($width, $height) = getimagesize($path2);
                // echo $path .  . "<br>";
                $result[] = array(
                    'src' => "$path/$img",
                    'width' => $width,
                    'height' => $height
                );
            }
        }
    }

    return $result;
}

/**
 * Este metodo retorna un array de enterors con los identificadores de las
 * subcategorías
 * @param int $category_id Identificador de la categoría padre
 * @return array Arreglo con los identificadores de las subcategorías
 */
function get_subcategories($category_id)
{
    $subcategories = [];
    try {
        $conn = get_connection();
        $stmt = $conn->query("SELECT son_id FROM category_has_subcategory WHERE father_id = $category_id");

        while ($row = $stmt->fetch()) {
            $subcategories[] = intval($row['son_id']);
        }
    } catch (PDOException $e) {
        $message = $e->getMessage();
        $message = "Error al consultar las subcategorías: $message";
        write_error($message);
    }

    return $subcategories;
}

/**
 * Este metodo retorna un array con toda la informacion de las
 * categorias contenidas en la base de datos, y un array con los
 * identificadores de las subcategorías
 */
function get_all_categories()
{
    $categories = [];
    try {
        $conn = get_connection();
        $stmt = $conn->query('SELECT * FROM category');

        while ($row = $stmt->fetch()) {
            $categories[] = [
                'id' => intval($row['category_id']),
                'name' => $row['name'],
                'categoryClass' => intval($row['category_class']),
                'code' => intval($row['code']),
                'path' => $row['path'],
                'subcategories' => get_subcategories(intval($row['category_id']))
            ];
        }
    } catch (PDOException $e) {
        $message = "Error al consultar las categorías: {$e->getMessage()}";
        write_error($message);
    }

    return $categories;
}

/**
 * Retrna un array con todas las etiquetas de la base de datos
 */
function get_all_labels()
{
    $labels = [];
    try {
        $conn = get_connection();
        $stmt = $conn->query('SELECT * FROM label');

        while ($row = $stmt->fetch()) {
            $id = intval($row['label_id']);
            $name = $row['name'];

            $labels[] = [
                'id' => $id,
                'name' => $name
            ];
        }
    } catch (PDOException $e) {
        $message = "Error al consultar las etiquetas: {$e->getMessage()}";
        write_error($message);
    }

    return $labels;
}

/**
 * Caonsulta ala base de datos los identificadores de las categorias
 * que estan asociadas al item
 * @param int $item_id El identificado del producto a consultar
 * @return array Un arreglo de enteros
 */
function get_categories_of_item($item_id)
{
    $categories = [];
    try {
        $conn = get_connection();
        $stmt = $conn->query(("SELECT category_id as id FROM item_hascategory WHERE item_id = $item_id"));

        while ($row = $stmt->fetch()) {
            $categories[] = intval($row['id']);
        }
    } catch (PDOException $e) {
        $message = "Consulta de los id de las categorías: {$e->getMessage()}";
        write_error($message);
    }

    return $categories;
}

/**
 * Consulta a la base de datos los identificadores de las etiquetas
 * que están asociadas al aticulo
 * @param int $item_id El identificado del producto a consultar
 * @return array Un arreglo de enteros
 */
function get_labels_of_item($item_id)
{
    $labels = [];
    try {
        $conn = get_connection();
        $stmt = $conn->query("SELECT label_id AS id FROM item_has_label WHERE item_id = $item_id");

        while ($row = $stmt->fetch()) {
            $labels[] = intval($row['id']);
        }
    } catch (PDOException $e) {
        $message = "Error al consultar los id de la etiquetas: {$e->getMessage()}";
        write_error($message);
    }

    return $labels;
}

/**
 * Consulta a la base de datos las imagenes asociadas al articulo y
 * retona un array con la informacion
 * @param int $item_id Identificador del producto a consultar
 */
function get_images_of_item($item_id)
{
    $images = [];
    try {
        $conn = get_connection();
        $stmt = $conn->query("SELECT * FROM item_image WHERE item_id = $item_id");

        while ($row = $stmt->fetch()) {
            $src = $row['src'];
            $width = $row['width'] === 'NULL' ? 0 : intval($row['width']);
            $height = $row['height'] === 'NULL' ? 0 : intval($row['width']);

            $images[] = [
                'src' => $src,
                'width' => $width,
                'height' => $height
            ];
        }
    } catch (PDOException $e) {
        $message = "Error al tratar de consultar la informacion de las imagenes del articulo: {$e->getMessage()}";
        write_error($message);
    }

    return $images;
}

/**
 * Consulta a la base de datos tda la informacion de los productos
 */
function get_all_items()
{
    $items = [];
    try {
        $conn = get_connection();
        $stmt = $conn->query('SELECT * FROM item');

        while ($row = $stmt->fetch()) {
            $id = intval($row['item_id']);
            $categories = get_categories_of_item($id);
            $labels = get_labels_of_item($id);
            $images = get_images_of_item($id);

            $items[] = [
                'id' => $id,
                'name' => $row['name'],
                'description' => $row['description'],
                'retailPrice' => floatval($row['retail_price']),
                'ref' => $row['ref'] === 'NULL' ? '' : $row['ref'],
                'barcode' => $row['barcode'] === 'NULL' ? '' : $row['barcode'],
                'gender' => $row['gender'],
                'stock' => intval($row['stock']),
                'outstandig' => intval($row['outstanding']) === 0 ? FALSE : TRUE,
                'isNew' => intval($row['is_new']) === 0 ? FALSE : TRUE,
                'published' => intval($row['pusblished']) === 0 ? FALSE : TRUE,
                'dischargeDate' => $row['discharge_date'],
                'webDirection' => $row['web_direction'] === 'NULL' ? '' : $row['web_direction'],
                'images' => $images,
                'categories' => $categories,
                'labels' => $labels
            ];
        }
    } catch (PDOException $e) {
        $message = "Error al tratar de consultar la informacion de los productos: {$e->getMessage()}";
        write_error($message);
    }

    return $items;
}
//---------------------------------------------------------------------------------------
//                      FUNCIONES PARA MODIFICAR DATOS
//---------------------------------------------------------------------------------------
/**
 * Crea un nuevo articulo en la base de datos
 * @param string $name Nombre del prodcuto
 * @param string $description Descripcion del producto a agregar
 * @param float $retail_price Es el precio de venta al publico
 * @param string $ref Es la referencia de compra del producto
 * @param string $barcode Es el codigo que se le asigna al producto
 * @param string $gender Es el genero al que va dirigido el producto
 * @param int $stock Las unidades disponibles del producto
 * @param bool $outstanding Si el producto se encuentra destacado
 * @param bool $is_new Si es un producto nuevo
 * @param bool $pusblished Si está habilitado para publicarse
 * @param string $web_direction La direccion del sitio donde está publicado
 * @param array $images Arreglo con la informacion de las imagenes asociadas
 * @param array $categories Arreglo con los identificadores de las categorías asignadas
 * @param array $labels Arreglo con los identificadores de las etiquetas asociadas
 */
function create_new_item($name, $description, $retail_price, $ref, $barcode, $gender, $stock, $outstanding, $is_new, $pusblished, $web_direction, $images, $categories, $labels)
{
    if (validate_item($name, $description, $retail_price, $stock, $gender)) {
        $ref = empty($ref) ? 'NULL' : $ref;
        $barcode = empty($barcode) ? 'NULL' : $barcode;
        $web_direction = empty('$web_direction') ? 'NULL' : $web_direction;

        try {
            $conn = get_connection();
            /**
             * Se inicia la transaccion porque se modifican varias tablas:
             * item, item_has_category, item_has_label, item_images y user_log
             */
            $conn->beginTransaction();

            //Se aggregan los datos especificos del producto
            $stmt = $conn->prepare('INSERT INTO item (name, description, retail_price, ref, barcode, gender, stock, outstanding, is_new, published, web_direction VALUES (:name, :description, :retail_price, :ref, :barcode, :gender, :stock, :outstanding, :is_new, :published, :web_direction)');

            $stmt->bindParam(':name', $name, PDO::PARAM_STR);
            $stmt->bindParam(':description', $description, PDO::PARAM_STR);
            $stmt->bindParam(':retail_price', $retail_price, PDO::PARAM_STR);
            $stmt->bindParam(':ref', $ref, PDO::PARAM_STR);
            $stmt->bindParam(':barcode', $barcode, PDO::PARAM_STR);
            $stmt->bindParam(':gender', $gender, PDO::PARAM_STR);
            $stmt->bindParam(':stock', $stock, PDO::PARAM_INT);
            $stmt->bindParam(':outstanding', $outstanding, PDO::PARAM_BOOL);
            $stmt->bindParam(':is_new', $is_new, PDO::PARAM_BOOL);
            $stmt->bindParam(':published', $pusblished, PDO::PARAM_BOOL);
            $stmt->bindParam(':web_direction', $web_direction, PDO::PARAM_STR);

            $stmt->execute();
            $last_id = $conn->lastInsertId();

            //Se agregan la imagenes del prodcuto
            if(count($images) > 0){
                $stmt = $conn->prepare('INSERT INTO item_image(item_id, src, width, height) VALUES (:item_id, :src, :width, :height');
                $stmt->bindParam(':item_id', $last_id);

                foreach($images as $img){
                    $stmt->bindParam(':src', $img['src'], PDO::PARAM_STR);
                    $stmt->bindParam(':width', $img['width'], PDO::PARAM_INT);
                    $stmt->bindParam(':height', $img['height'], PDO::PARAM_INT);
                    $stmt->execute();
                }//Fin de foreach
            }//Fin de iff

            //Se agregan las categorías
            if(count($categories) > 0){
                $stmt = $conn->prepare('INSERT INTO item_has_category(item_id, category_id) VALUES (:item_id, :category_id');
                $stmt->bindParam(':item_id', $last_id, PDO::PARAM_INT);
                foreach($categories as $category){
                    $stmt->bindParam(':category_id', $category, PDO::PARAM_INT);
                    $stmt->execute();
                }//Fin de foreach
            }//Fin de if

            //Se agregan las etiquetas
            if(count($labels) > 0){
                $stmt = $conn->prepare('INSERT INTO item_has_label(item_id, label_id) VALUES (:item_id, :label_id');
                $stmt->bindParam(':item_id', $last_id, PDO::PARAM_INT);
                foreach($labels as $label){
                    $stmt->bindParam(':label_id', $label, PDO::PARAM_INT);
                    $stmt->execute();
                }//Fin de foreach
            }//Fin de if

            //Finalmente se guarda un registro de quien hizo las modificaciones
            $user_id = $_SESSION['user_id'];
            $conn->query("INSERT INTO user_log (user_id, log_description) VALUES ($user_id, 'Se creo un nuevo producto [id=$last_id]')");

            $conn->commit();
        } catch (PDOException $e) {
            $message = "Error al intentar agregar un nuevo producto: {$e->getMessage()}";
            write_error($message);
        } //Fin de try catch
    } //Fin de if
} //Fin del metodo

/**
 * Este metodo valida que el nombre del articulo cumpla con todos 
 * los requisitos
 * @param $item_name Nombre del producto
 */
function validate_item_name(&$item_name)
{
    $result = false;
    //Primero compruebo que existe y que sea un string
    if (isset($item_name) && gettype($item_name) === 'string') {
        //Se limpia los espacios en blanco al inicio y al final
        $item_name = trim($item_name);
        //Se comprueba que el tamaño sea menor o igual al maximo permitido 100 caracteres
        if (100 >= strlen($item_name)) {
            try {
                $conn = get_connection();
                $stmt = $conn->prepare('SELECT COUNT(*) as count FROM item WHERE name = :name');
                $stmt->bindParam(':name', $name, PDO::PARAM_STR);
                $stmt->execute();

                //Si el conteo es null o cero el resultado será correcto
                $row = $stmt->fetch();
                $count = $row['count'];
                if ($count === 'NULL' || $count === '0') {
                    $result = TRUE;
                }
            } catch (PDOException $e) {
                $message = "Error al validar nombre en la base de datos: {$e->getMessage()}";
                write_error($message);
            } //Fin de try catch
        } //Fin de if
    } //Fin de if

    return $result;
} //Fin del metodo

function validate_item_description(&$item_description)
{
    $result = FALSE;
    //Primero se valida que la variable exista y que sea un string
    if (isset($item_description) && gettype($item_description) === 'string') {
        //Se eliminan espacios en blanco al inicio y al final
        $item_description = trim($item_description);
        //Se cmprueba que no supere el maximo de caracteres
        if (255 >= strlen($item_description) && 0 < strlen($item_description)) {
            $result = TRUE;
        } //Fin de if
    } //Fin de if

    return $result;
} //Fin del metodo

/**
 * Este metodo hace una validacion de los parametros criticos al momento
 * de intentar agregar un item
 */
function validate_item(&$name, &$description, &$retail_price, &$stock, &$gender)
{
    $result = FALSE;

    if (validate_item_name($name)) {
        if (validate_item_description($description)) {
            //Se verifica si el precio y el stock son numericos
            if (is_numeric($retail_price) && is_numeric($stock)) {
                $retail_price = floatval($retail_price);
                $stock = intval($stock);

                //Se compruba que los datos san cero o mayor que cero
                if ($retail_price >= 0 && $stock >= 0) {
                    $result = TRUE;

                    //Por ultimo se hace una comprobacion
                    if (isset($gender) && gettype($gender) === 'string' && !empty($gender)) {
                        if ($gender !== 'x' || $gender !== 'f' || $gender !== 'm') {
                            $gender = 'x';
                        }
                    } //Fin de if
                } //Fin de if

            } //Fin de if
        } //Fin de if
    } //Fin de if


    return $result;
} //Fin del metodo

//---------------------------------------------------------------------------------------
//                      UTILIDADES
//---------------------------------------------------------------------------------------
/**
 * Este método escribe en el fichero los errores que se van capturando 
 * por la ejecución del código y le agrega la fecha del servidor
 * @param (string) $message El mensaje que se desea escribir
 */
function write_error($message)
{
    //Se utiliza una ruta absoluta para poder facilitar el registro
    $path = $_SERVER['DOCUMENT_ROOT'] . '/Proyectos/Proyectos Comerciales/tiendacarmu/system/includes/error.log';
    $now = date('d/m/y H:i a');
    $message = "[$now]: $message\n\r";

    if (file_exists($path)) {
        $cursor = fopen($path, 'a+');
        fwrite($cursor, $message);
        fclose($cursor);
    }
}

/**
 * Envía la cabecera a la nueva ubicación
 * @param {string} $page nombre de la página a visitar
 */
function go_to_page($page)
{
    if (isset($page) && !empty($page)) {
        header("location: $page");
    }
}
