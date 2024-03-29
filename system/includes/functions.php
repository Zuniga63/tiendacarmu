<?php

/**
 * @Funciones utilizadas por las vistas a las que accede el usuario
 * @version 1.1
 * @author Andrés Zuñiga <andres.zuniga.063@gmail.com>
 * History
 * ---
 * La modificó a la version 1.1 el 19 de junio de 2020
 * La version 1.0 Se terminó de escribir el 01 de junio de 2020
 * La primera version fue escrita por Andrés Zuñiga el 20 de mayo de 2020
 */

use function PHPSTORM_META\type;

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
		$user_id = $_SESSION['user_id'];
		$conn = get_connection();

		if ($conn) {
			try {
				$conn->beginTransaction();
				$stmt = $conn->prepare('UPDATE user SET start_session = NULL WHERE user_id = :user_id AND username = :user_name');
				$stmt->bindParam(':user_name', $username, PDO::PARAM_STR);
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
					'src' => "$img",
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
		$stmt = $conn->query(("SELECT category_id as id FROM item_has_category WHERE item_id = $item_id"));

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
				'outstanding' => intval($row['outstanding']) === 0 ? FALSE : TRUE,
				'isNew' => intval($row['is_new']) === 0 ? FALSE : TRUE,
				'published' => intval($row['published']) === 0 ? FALSE : TRUE,
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
		$web_direction = empty($web_direction) ? 'NULL' : $web_direction;

		try {
			$conn = get_connection();
			/**
			 * Se inicia la transaccion porque se modifican varias tablas:
			 * item, item_has_category, item_has_label, item_images y user_log
			 */
			$conn->beginTransaction();

			//Se aggregan los datos especificos del producto
			$stmt = $conn->prepare("INSERT INTO item (name, description, retail_price, ref, barcode, gender, stock, outstanding, is_new, published, web_direction) VALUES (:name, :description, :retail_price, :ref, :barcode, :gender, :stock, :outstanding, :is_new, :published, :web_direction)");

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
			if (count($images) > 0) {
				$stmt = $conn->prepare("INSERT INTO item_image(item_id, src, width, height) VALUES (:item_id, :src, :width, :height)");
				$stmt->bindParam(':item_id', $last_id);

				foreach ($images as $img) {
					$stmt->bindParam(':src', $img['src'], PDO::PARAM_STR);
					$stmt->bindParam(':width', $img['width'], PDO::PARAM_INT);
					$stmt->bindParam(':height', $img['height'], PDO::PARAM_INT);
					$stmt->execute();
				} //Fin de foreach
			} //Fin de iff

			//Se agregan las categorías
			if (count($categories) > 0) {
				$stmt = $conn->prepare("INSERT INTO item_has_category(item_id, category_id) VALUES (:item_id, :category_id)");
				$stmt->bindParam(':item_id', $last_id, PDO::PARAM_INT);
				foreach ($categories as $category) {
					$stmt->bindParam(':category_id', $category['id'], PDO::PARAM_INT);
					$stmt->execute();
				} //Fin de foreach
			} //Fin de if

			//Se agregan las etiquetas
			if (count($labels) > 0) {
				$stmt = $conn->prepare("INSERT INTO item_has_label(item_id, label_id) VALUES (:item_id, :label_id)");
				$stmt->bindParam(':item_id', $last_id, PDO::PARAM_INT);
				foreach ($labels as $label) {
					$stmt->bindParam(':label_id', $label['id'], PDO::PARAM_INT);
					$stmt->execute();
				} //Fin de foreach
			} //Fin de if

			//Finalmente se guarda un registro de quien hizo las modificaciones
			$user_id = $_SESSION['user_id'];
			$conn->query("INSERT INTO user_log (user_id, log_description) VALUES ($user_id, 'Se creo un nuevo producto [id=$last_id]')");

			$conn->commit();
			return true;
		} catch (PDOException $e) {
			$message = "Error al intentar agregar un nuevo producto: {$e->getMessage()}";
			write_error($message);
			return false;
		} //Fin de try catch
	} //Fin de if

	return false;
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
						if ($gender !== 'x' && $gender !== 'f' && $gender !== 'm') {
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
//                      SECCION DE CLIENTES
//---------------------------------------------------------------------------------------
/**
 * Agrega un nuevo cliente a la base de datos
 */
function create_new_customer($first_name, $last_name, $nit, $phone, $email)
{
	$result = false;
	//Se comprueva que el nombre del cliente no esté vacío
	$first_name = trim($first_name);
	if (!empty($first_name)) {
		$last_name = empty(trim($last_name)) ? 'NULL' : trim($last_name);
		$nit = empty(trim($nit)) ? 'NULL' : trim($nit);
		$phone = empty(trim($phone)) ? 'NULL' : trim($phone);
		$email = empty(trim($email)) ? 'NULL' : trim($email);

		try {
			$conn = get_connection();
			$conn->beginTransaction();

			$stmt = $conn->prepare("INSERT INTO customer(first_name, last_name, nit, phone, email) 
            VALUES(:first_name, :last_name, :nit, :phone, :email)");
			//Solo si se ha preparado continúa
			if ($stmt) {
				$stmt->bindParam(':first_name', $first_name, PDO::PARAM_STR);
				$stmt->bindParam(':last_name', $last_name, PDO::PARAM_STR);
				$stmt->bindParam(':nit', $nit, PDO::PARAM_STR);
				$stmt->bindParam(':phone', $phone, PDO::PARAM_STR);
				$stmt->bindParam(':email', $email, PDO::PARAM_STR);

				$stmt->execute();

				$customer_id = $conn->lastInsertId();

				//Ahora se procede a actualizar el registro de usuario
				$user_id = $_SESSION['user_id'];
				$conn->query("INSERT INTO user_log (user_id, log_description) VALUES ($user_id, 'Creó al cliente $first_name')");

				//Se agrega inicializa el hsitorial del cliente
				$conn->query("INSERT INTO customer_history(customer_id, user_id, new_customer) VALUES ($customer_id, $user_id, 1)");

				$conn->commit();
				$result = true;
			} else {
				$message = "No se pudo preparar la sentencia para agregar un nuevo cliente";
				write_error($message);
				$conn->rollBack();
				$result = false;
			} //Fin de if-else

		} catch (PDOException $e) {
			$message = "Error al intentar crear un nuevo cliente: {$e->getMessage()}";
			write_error($message);
			return false;
		} //Fin de try-catch
	} else {
		$message = "Se intente agregar un cliente con nombre en blanco";
		write_error($message);
	} //Fin de else

	return $result;
}

function update_customer($customer_id, $first_name, $last_name, $nit, $phone, $email)
{
	$result = false;
	//Se comprueva que el nombre del cliente no esté vacío
	$first_name = trim($first_name);

	if (is_numeric($customer_id) && !empty($first_name)) {
		$customer_id = intval($customer_id);
		$last_name = empty(trim($last_name)) ? 'NULL' : trim($last_name);
		$nit = empty(trim($nit)) ? 'NULL' : trim($nit);
		$phone = empty(trim($phone)) ? 'NULL' : trim($phone);
		$email = empty(trim($email)) ? 'NULL' : trim($email);

		try {
			$conn = get_connection();
			$conn->beginTransaction();
			$stmt = $conn->prepare("UPDATE customer SET 
                                    first_name = :first_name, 
                                    last_name = :last_name, 
                                    nit = :nit, 
                                    phone = :phone, 
                                    email = :email 
                                    WHERE customer_id = :customer_id");
			if ($stmt) {
				$stmt->bindParam(':first_name', $first_name, PDO::PARAM_STR);
				$stmt->bindParam(':last_name', $last_name, PDO::PARAM_STR);
				$stmt->bindParam(':nit', $nit, PDO::PARAM_STR);
				$stmt->bindParam(':phone', $phone, PDO::PARAM_STR);
				$stmt->bindParam(':email', $email, PDO::PARAM_STR);
				$stmt->bindParam(':customer_id', $customer_id, PDO::PARAM_INT);

				$stmt->execute();

				//Ahora se procede a actualizar el registro de usuario
				$user_id = $_SESSION['user_id'];
				$conn->query("INSERT INTO user_log (user_id, log_description) VALUES ($user_id, 'Se actualizó al cliente $first_name')");

				//Se agrega inicializa el hsitorial del cliente
				$conn->query("INSERT INTO customer_history(customer_id, user_id, update_data)
                              VALUES ($customer_id, $user_id, 1)");
				$conn->commit();
				$result = true;
			} else {
				$message = "No se preparo la sentencia de actualizacion";
				write_error($message);
			}
		} catch (PDOException $e) {
			$message = "Error al intentar actualizar cliente: {$e->getMessage()}";
			write_error($message);
			return false;
		} //Fin de try-catch
	} else {
		$message = "Se intente actualizar un cliente con nombre en blanco";
		write_error($message);
	} //Fin de if-else

	return $result;
}

/**
 * Recupera la informacion de todos los clientes contenidos en la base de datos
 * e ivluye las tablas de los creditos y los pagos realizados
 */
function get_all_customers()
{
	$customers = [];
	try {
		$conn = get_connection();
		$stmt = $conn->query('SELECT * FROM customer ORDER BY first_name');

		while ($row = $stmt->fetch()) {
			//Se recupera la informacion basica del cliente
			$customer_id = intval($row['customer_id']);
			$first_name = htmlspecialchars_decode($row['first_name']);
			$last_name = htmlspecialchars_decode($row['last_name'] === 'NULL' ? '' : $row['last_name']);
			$nit = htmlspecialchars_decode($row['nit'] === 'NULL' ? '' : $row['nit']);
			$phone = htmlspecialchars_decode($row['phone'] === 'NULL' ? '' : $row['phone']);
			$email = htmlspecialchars_decode($row['email'] === 'NULL' ? '' : $row['email']);
			$archived = $row['archived']  === '1' ? TRUE : FALSE;
			$balance = 0;

			//Para cada cliente se recuperan los creditos y los abonos
			$credits = get_customer_credits($customer_id);
			$payments = get_customer_payments($customer_id);

			//Si las consultas son correctas los metodos anteriores retornar un array
			if (isset($credits) && isset($payments)) {
				//Se calcula el saldo del cliente
				$balance = $credits['total_amount'] - $payments['total_amount'];

				if ($balance < 0) {
					write_error("Inconsistencia con el cliente $customer_id: Balance menor a cero");
				} else {
					$buffer = $payments['total_amount'];
					$index = 0;
					$max_index = count($credits['credits']);
					/*
                     * Se va a repetir el bucle hasta agotar el dinero delos pagos
                     * o no hayan mas creditos a los cuales abonar.
                     */
					while ($buffer > 0 && $index < $max_index) {
						//Se recupera el credito actual en forma de referencia
						//para poder actualizar sus valores
						$credit = &$credits['credits'][$index];

						if ($credit['amount'] >= $buffer) {
							$credit_balance = $credit['amount'] - $buffer;
							$credit['balance'] = $credit_balance;
							$buffer = 0;
						} else {
							$credit['balance'] = 0;
							$buffer -= $credit['amount'];
						}
						$index++;
					} //Fin de while
				} //Fin de if-else
			}

			//Finalmente se guardan los datos del cliente en el arreglo
			$customers[] = [
				'id' => $customer_id,
				'firstName' => $first_name,
				'lastName' => $last_name,
				'nit' => $nit,
				'phone' => $phone,
				'email' => $email,
				'balance' => $balance,
				'credits' => $credits['credits'],
				'payments' => $payments['payments'],
				'points' => 0,
				'archived' => $archived,
			];
		}
	} catch (PDOException $e) {
		$message = "Error al intentar consultar los datos de los cliente: {$e->getMessage()}";
		write_error($message);
	} //Fin de try-catch

	return $customers;
}

/**
 * Recupera los datos de un unico cliente si no encuentra ninguno retorna null
 * @param {int} $customer_id Es el identificador del cliente
 */
function get_customer($customer_id)
{
	$customer = null;
	try {
		$conn = get_connection();
		$stmt = $conn->prepare("SELECT * FROM customer WHERE customer_id = :customer_id LIMIT 1");
		if ($stmt) {
			$stmt->bindParam(':customer_id', $customer_id, PDO::PARAM_INT);
			$stmt->execute();

			while ($row = $stmt->fetch()) {
				//Se recupera la informacion basica del cliente
				$customer_id = intval($row['customer_id']);
				$first_name = htmlspecialchars_decode($row['first_name']);
				$last_name = htmlspecialchars_decode($row['last_name'] === 'NULL' ? '' : $row['last_name']);
				$nit = htmlspecialchars_decode($row['nit'] === 'NULL' ? '' : $row['nit']);
				$phone = htmlspecialchars_decode($row['phone'] === 'NULL' ? '' : $row['phone']);
				$email = htmlspecialchars_decode($row['email'] === 'NULL' ? '' : $row['email']);
				$balance = 0;
				$archived = $row['archived']  === '1' ? TRUE : FALSE;

				//Se recuperan los creditos y los abono **POSIBLE CANDIDATO PARA ENCAPSULACION
				$credits = get_customer_credits($customer_id);
				$payments = get_customer_payments($customer_id);


				if (isset($credits) && isset($payments)) {
					$balance = $credits['total_amount'] - $payments['total_amount'];
					if ($balance < 0) {
						write_error("Inconsistencia con el cliente $customer_id: Balance menor a cero");
					} else {
						$buffer = $payments['total_amount'];
						$index = 0;
						$max_index = count($credits['credits']);
						while ($buffer > 0 && $index < $max_index) {
							$credit = &$credits['credits'][$index];
							if ($credit['amount'] >= $buffer) {
								$credit_balance = $credit['amount'] - $buffer;
								// unset($credit['balance']);
								$credit['balance'] = $credit_balance;
								$buffer = 0;
							} else {
								// unset($credit['balance']);
								$credit['balance'] = 0;
								$buffer -= $credit['amount'];
							}
							$index++;
						} //Fin de while
					} //Fin de if-else
				}

				$customer = [
					'id' => $customer_id,
					'firstName' => $first_name,
					'lastName' => $last_name,
					'nit' => $nit,
					'phone' => $phone,
					'email' => $email,
					'balance' => $balance,
					'credits' => $credits['credits'],
					'payments' => $payments['payments'],
					'points' => 0,
					'archived' => $archived,
				];
			} //Fin de while
		} else {
			write_error("No se preparó la consulta al caonsultar datos de un solo cliente");
		}
	} catch (PDOException $e) {
		$message = "Error al intentar consultar los datos del cliente: {$e->getMessage()}";
		write_error($message);
	} //Fin de try-cath

	return $customer;
} //Fin del metodo

/**
 * Consulta los creditos del cliente y realiza una sumatoria de cada uno de los montos
 */
function get_customer_credits($customer_id)
{
	$result = null;
	$credits = [];

	if (isset($customer_id) && is_numeric($customer_id)) {
		try {
			$total_amount = 0;
			$conn = get_connection();
			$stmt = $conn->query("SELECT * FROM customer_credit WHERE customer_id = $customer_id ORDER BY credit_date ASC");

			while ($row = $stmt->fetch()) {
				$id = intval($row['customer_credit_id']);
				$credit_date = $row['credit_date'];
				$description = htmlspecialchars_decode($row['description']);
				$amount = floatval($row['amount']);
				$total_amount += $amount;

				$credits[] = [
					'id' => $id,
					'creditDate' => $credit_date,
					'description' => $description,
					'amount' => $amount,
					'balance' => $amount
				];
			} //Fin de while

			$result = [
				'total_amount' => $total_amount,
				'credits' => $credits
			];
		} catch (PDOException $e) {
			$message = "Error al intentar consultar los creditos del cliente: {$e->getMessage()}";
			write_error($message);
		} //Fin de try-catch
	} //Fin de if


	return $result;
}

/**
 * Consulta en la base de datos los pagos realizados por el cliente y hace una sumatoria de todos 
 * los importes para regresar un objeto con los datos de los pagos y el total. Si falla retorna null
 */
function get_customer_payments($customer_id)
{
	$result = null;
	$payments = [];

	if (isset($customer_id) && is_numeric($customer_id)) {
		try {
			$total_amount = 0;

			$conn = get_connection();
			$stmt = $conn->query("SELECT * FROM customer_payment WHERE customer_id = $customer_id ORDER BY payment_date ASC");

			while ($row = $stmt->fetch()) {
				$id = intval($row['customer_payment_id']);
				$payment_date = $row['payment_date'];
				$cash = $row['cash'] == '1' ? TRUE : FALSE;
				$amount = floatval($row['amount']);

				$total_amount += $amount;

				$payments[] = [
					'id' => $id,
					'paymentDate' => $payment_date,
					'cash' => $cash,
					'amount' => $amount
				];
			}

			$result = [
				'total_amount' => $total_amount,
				'payments' => $payments
			];
		} catch (PDOException $e) {
			$message = "Error al intentar consultar los pagos del cliente: {$e->getMessage()}";
			write_error($message);
		} //Fin de try-catch
	} //Fin de if


	return $result;
} //Fin del metodo

/**
 * Le agrega al cliente una nueva deuda
 * @param {int} $customer_id Identificador del cliente
 * @param {string} $description Informacion del credito a agregar
 * @param {float} $amount El valor total de la deuda.
 * @return {bool} True si fue satisfactorio
 */
function create_new_credit($customer_id, $description, $amount, $date = '')
{
	$result = false;

	if (is_numeric($customer_id) && is_numeric($amount)) {
		$customer_id = intval($customer_id);
		$amount = floatval($amount);
		$description = trim($description);

		if (!empty($description) && $amount > 0) {
			$query = "";
			$date_is_ok = false;
			if (!empty($date) && validate_date($date)) {
				$date_is_ok = true;
				$query = "INSERT INTO customer_credit(customer_id, credit_date, description, amount) ";
				$query .= "VALUES (:customer_id, :credit_date, :description, :amount)";
			} else {
				$query = "INSERT INTO customer_credit(customer_id, description, amount) VALUES (:customer_id, :description, :amount)";
			}

			try {
				$conn = get_connection();
				$conn->beginTransaction();

				$stmt = $conn->prepare($query);

				if ($stmt) {
					$stmt->bindParam(':customer_id', $customer_id, PDO::PARAM_INT);
					$stmt->bindParam(':description', $description, PDO::PARAM_STR);
					$stmt->bindParam(':amount', $amount, PDo::PARAM_STR);
					if ($date_is_ok) {
						$stmt->bindParam(':credit_date', $date, PDO::PARAM_STR);
					}
					$stmt->execute();

					//Se actualiza el registro
					$last_id = $conn->lastInsertId();
					$user_id = $_SESSION['user_id'];
					$conn->query("INSERT INTO user_log (user_id, log_description) VALUES ($user_id, 'Se creo un nuevo credito: customer: $customer_id; credit: $last_id')");

					//Se agrega al historial que se creo un uevo credito
					$conn->query("INSERT INTO customer_history(customer_id, user_id, new_credit, amount) VALUES ($customer_id, $user_id, 1, $amount)");

					$conn->commit();
					$result = true;
				} else {
					write_error("No se pudo preparar la consulta para agregar credito");
					$conn->rollBack();
				}
			} catch (PDOException $e) {
				$message = "Error al intentar crear un nuevo credito: {$e->getMessage()}";
				write_error($message);
			}
		} else {
			write_error('La descripcion está vacía o el saldo es inferior o igual a cero');
		} //Fin de if-else
	} else {
		$validation = is_numeric(trim($amount));
		$amount = trim($amount);
		write_error("El id o el saldo no son numericos: $customer_id AND [$amount] => $validation");
	} //Fin de if-else

	return $result;
} //Fin del metodo

/**
 * Agrega un pago a la deuda del cliente
 * @param {int} $customer_id El identificador del cliente
 * @param {bool} $cash True cuando la transaccion fu en efectivo
 * @param {float} $amount El valor del abono
 */
function create_new_payment($customer_id, $cash, $amount, $date = "")
{
	$result = false;

	if (is_numeric($customer_id) && is_numeric($amount)) {
		$customer_id = intval($customer_id);
		$amount = floatval($amount);
		$cash = $cash == 'true' ? 1 : 0;

		try {
			$conn = get_connection();
			$conn->beginTransaction();

			$customer_credits = 0;
			$customer_payments = 0;
			$customer_balance = 0;

			//Se recupera el total de la deuda del cliente
			$stmt = $conn->prepare("SELECT SUM(amount) AS total_amount FROM customer_credit WHERE customer_id = :customer_id");
			$stmt->bindParam(':customer_id', $customer_id, PDO::PARAM_INT);
			$stmt->execute();
			if ($row = $stmt->fetch()) {
				$customer_credits = empty($row['total_amount']) ? 0 : floatval($row['total_amount']);
			}

			//Se recupera el total abonado por el cliente
			$stmt = $conn->prepare("SELECT SUM(amount) AS total_amount FROM customer_payment WHERE customer_id = :customer_id");
			$stmt->bindParam(':customer_id', $customer_id, PDO::PARAM_INT);
			$stmt->execute();
			if ($row = $stmt->fetch()) {
				$customer_payments = empty($row['total_amount']) ? 0 : floatval($row['total_amount']);
			}

			//Se calcula el saldo del cliente
			$customer_balance = $customer_credits - $customer_payments;

			if ($customer_balance > 0 && $amount <= $customer_balance) {
				$query = "INSERT INTO customer_payment(customer_id, cash, amount) VALUES (:customer_id, :cash, :amount)";
				$date_is_ok = false;
				if (!empty($date) && validate_date($date)) {
					$date_is_ok = true;
					$query = "INSERT INTO customer_payment(customer_id, payment_date, cash, amount) VALUES (:customer_id, :payment_date, :cash, :amount)";
				}
				$stmt = $conn->prepare($query);
				$stmt->bindParam(':customer_id', $customer_id, PDO::PARAM_INT);
				$stmt->bindParam(':cash', $cash, PDO::PARAM_BOOL);
				$stmt->bindParam(':amount', $amount, PDO::PARAM_STR);
				if ($date_is_ok) {
					$stmt->bindParam(':payment_date', $date, PDO::PARAM_STR);
				}
				$stmt->execute();

				$last_id = $conn->lastInsertId();
				$user_id = $_SESSION['user_id'];
				$conn->query("INSERT INTO user_log (user_id, log_description) VALUES ($user_id, 'Se creo un nuevo abono: customer: $customer_id; payment_id: $last_id')");

				//Se agrega al historial que se creo un uevo credito
				$conn->query("INSERT INTO customer_history(customer_id, user_id, new_payment, amount) VALUES ($customer_id, $user_id, 1, $amount)");

				$result = true;
			} //Fin de if
			$conn->commit();
		} catch (PDOException $e) {
			$message = "Error al intentar crear un nuevo pago: {$e->getMessage()}";
			write_error($message);
		} //Fin de try-cath
	} else {
		$validation = is_bool($cash);
		$amount = trim($amount);
		write_error("El id o el saldo no son numericos[payments]: $customer_id AND [$amount] AND [$cash]=> $validation");
	}

	return $result;
} //Fin del metodo

function archived_unarchived_customer($customer_id, $archive)
{
	$result = false;
	$message = "";
	if (isset($customer_id, $archive) && is_numeric($customer_id)) {
		$archive = $archive === 'true' ? 1 : 0;
		$customer_id = intval($customer_id);
		try {
			//En primer lugar trato de recuperar los datos del cliente
			$customer = get_customer($customer_id);
			if ($customer) {
				$query = "UPDATE customer SET archived = :archived WHERE customer_id = :customer_id";
				$conn = get_connection();
				$stmt = $conn->prepare($query);
				if ($stmt) {
					$stmt->bindParam(':archived', $archive, PDO::PARAM_BOOL);
					$stmt->bindParam(':customer_id', $customer_id, PDO::PARAM_INT);
					$stmt->execute();
					$result = true;
				} else {
					$message = "La sentencia no se preparó al tratar de archivar el cliente";
					write_error($message);
				}
			} else {
				$message = "El cliente que se quiere archivar no existe";
				write_error($message);
			}
		} catch (PDOException $e) {
			$message = "Error al intentar archivar el cliente: {$e->getMessage()}";
			write_error($message);
		}
		return $result;
	}
}

function delete_customer($customer_id)
{
	$isOk = false;
	if (isset($customer_id) && is_numeric($customer_id)) {
		$customer_id = intval($customer_id);
		try {
			$customer = get_customer($customer_id);
			if ($customer) {
				if ($customer['balance'] <= 0.0) {
					$query = "DELETE FROM customer WHERE customer_id = :customer_id";
					$conn = get_connection();
					$conn->beginTransaction();
					$stmt = $conn->prepare($query);
					if ($stmt) {
						$stmt->bindParam(':customer_id', $customer_id, PDO::PARAM_INT);
						$stmt->execute();
						//Ahora se actualiza el registo de usuario
						$user_id = $_SESSION['user_id'];
						$fullName = $customer['firstName'] . ' ' . $customer['lastName'];
						$conn->query("INSERT INTO user_log (user_id, log_description) VALUES ($user_id, 'Se eliminó al cliente: $fullName')");
						$isOk = true;
						$conn->commit();
					} else {
						$message = "Error al eliminar el cliente: La sentencia no se preparó";
						write_error($message);
						$conn->rollBack();
					}
				} else {
					$balance = $customer['balance'];
					$message = "Error al eliminar el cliente: El cliente no tiene saldo cero $balance";
					write_error($message);
				}
			} else {
				$message = "Error al eliminar el cliente: El cliente no existe";
				write_error($message);
			}
		} catch (PDOException $e) {
			$message = "Error al eliminar el cliente: {$e->getMessage()}";
			write_error($message);
		}
	} else {
		$message = "Error al eliminar el cliente: El id no es valido";
		write_error($message);
	}
	return $isOk;
}

function get_credit_cash_flow_report()
{
	$max_month = getdate()['mon'];
	$year = getdate()['year'];
	$day = getdate()['mday'];

	$months = [
		1 => 'january',
		'february',
		'march',
		'april',
		'may',
		'june',
		'july',
		'august',
		'september',
		'october',
		'november',
		'december'
	];

	$reports = [];

	try {
		$conn1 = get_connection();
		$conn2 = get_connection();

		$stmt1 = $conn1->prepare("SELECT SUM(amount) AS total_amount FROM customer_credit WHERE credit_date >= :since AND credit_date < :until");

		$stmt2 = $conn2->prepare("SELECT SUM(amount) AS total_amount FROM customer_payment WHERE payment_date >= :since AND payment_date < :until");

		for ($month = 1; $month <= $max_month; $month++) {
			$since = "$year-$month-01";
			$until = "$year-$month-16";

			$credit_amount = 0;
			$payment_amount = 0;

			$stmt1->bindParam(':since', $since, PDO::PARAM_STR);
			$stmt1->bindParam(':until', $until, PDO::PARAM_STR);
			$stmt1->execute();
			if ($row = $stmt1->fetch()) {
				$credit_amount = empty($row['total_amount']) ? 0 : floatval($row['total_amount']);
			}

			$stmt2->bindParam(':since', $since, PDO::PARAM_STR);
			$stmt2->bindParam(':until', $until, PDO::PARAM_STR);
			$stmt2->execute();

			if ($row = $stmt2->fetch()) {
				$payment_amount = empty($row['total_amount']) ? 0 : floatval($row['total_amount']);
			}

			$reports[] = [
				'since' => $since,
				'until' => $until,
				'creditAmount' => $credit_amount,
				'paymentAmount' => $payment_amount
			];

			$since = $until;
			$month_name = $months[$month];
			$until = new DateTime("last day of $month_name $year + 24 hour");
			$until = $until->format('Y-n-d');

			if ($month == $max_month && $day < 15) {
				break;
			}

			$credit_amount = 0;
			$payment_amount = 0;

			$stmt1->bindParam(':since', $since, PDO::PARAM_STR);
			$stmt1->bindParam(':until', $until, PDO::PARAM_STR);
			$stmt1->execute();

			if ($row = $stmt1->fetch()) {
				$credit_amount = empty($row['total_amount']) ? 0 : floatval($row['total_amount']);
			}

			$stmt2->bindParam(':since', $since, PDO::PARAM_STR);
			$stmt2->bindParam(':until', $until, PDO::PARAM_STR);
			$stmt2->execute();

			if ($row = $stmt2->fetch()) {
				$payment_amount = empty($row['total_amount']) ? 0 : floatval($row['total_amount']);
			}


			$reports[] = [
				'since' => $since,
				'until' => $until,
				'creditAmount' => $credit_amount,
				'paymentAmount' => $payment_amount
			];
		}

		return $reports;
	} catch (PDOException $e) {
		$message = "Error al consultar el reporte anual: {$e->getMessage()}";
		write_error($message);
	}
}

/**
 * Obtiene los datos almacenados en la tabla de historial y los cruza con las
 * tablas de usuario y clientes para obtene todos los datos
 */
function get_customer_history()
{
	$history = [];
	$query = "SELECT ";
	$query .= "t1.first_name AS user_first, t1.last_name AS user_last, ";
	$query .= "t2.first_name AS customer_first, t2.last_name as customer_last, ";
	$query .= "t3.history_date, t3.new_customer, ";
	$query .= "t3.update_data, t3.update_credit, t3.update_payment, ";
	$query .= "t3.new_payment, t3.new_credit, t3.amount ";
	$query .= "FROM customer_history AS t3 ";
	$query .= "LEFT JOIN (user as t1, customer as t2) ";
	$query .= "ON t3.user_id = t1.user_id ";
	$query .= "and t3.customer_id = t2.customer_id ";
	$query .= "ORDER BY t3.history_date DESC";
	try {
		$conn = get_connection();
		$stmt = $conn->query($query);

		while ($row = $stmt->fetch()) {
			$user_first_name = htmlspecialchars_decode($row['user_first']);
			$user_last_name = $row['user_last'] === 'NULL'
				? ''
				: htmlspecialchars_decode($row['user_last']);

			$customer_first_name = htmlspecialchars_decode($row['customer_first']);
			$customer_last_name = $row['customer_last']
				? ''
				: htmlspecialchars_decode($row['customer_last']);

			$history_date = $row['history_date'];
			$new_customer = $row['new_customer'] === '1' ? true : false;
			$update_data = $row['update_data'] === '1' ? true : false;
			$update_credit = $row['update_credit'] === '1' ? true : false;
			$update_payment = $row['update_payment'] === '1' ? true : false;
			$new_payment = $row['new_payment'] === '1' ? true : false;
			$new_credit = $row['new_credit'] === '1' ? true : false;
			$amount = $row['amount'] === 'NULL' ? 0 : floatval($row['amount']);

			$user = $user_first_name . " " . $user_last_name;
			$customer = $customer_first_name . " " . $customer_last_name;

			$history[] = [
				'author' => $user,
				'customer' => $customer,
				'historyDate' => $history_date,
				'newCustomer' => $new_customer,
				'updateData' => $update_data,
				'updateCredit' => $update_credit,
				'updatePayment' => $update_payment,
				'newPayment' => $new_payment,
				'newCredit' => $new_credit,
				'amount' => $amount
			];
		} //Fin de while
	} catch (PDOException $e) {
		$message = "Error al consultar el reporte anual: {$e->getMessage()}";
		write_error($message);
	} //Fin de try-catch
	return $history;
} //Fin del metodo

//---------------------------------------------------------------------------------------
//METODOS PARA GESTIONAR LAS VENTAS
//---------------------------------------------------------------------------------------
/**
 * Crea una nueva categoría de venta en la base de datos
 */
function create_new_category_sale($category_name)
{
	$result = false;
	if (!empty($category_name)) {
		try {
			$conn = get_connection();
			$conn->beginTransaction();

			$stmt = $conn->prepare("INSERT INTO sale_category(name) VALUES (:name)");

			if ($stmt) {
				$stmt->bindParam(':name', $category_name, PDO::PARAM_STR);
				$stmt->execute();

				//Ahora se procede a actualizar el registro de usuario
				$user_id = $_SESSION['user_id'];
				$conn->query("INSERT INTO user_log (user_id, log_description) VALUES ($user_id, 'Se creó la categoría de venta $category_name')");
				$conn->commit();
				$result = true;
			} else {
				$message = "No se pudo preparar la peticion [create_new_category]";
				write_error($message);
			}
		} catch (PDOException $e) {
			$message = "Error al intentar crear una nueva categoría de venta: {$e->getMessage()}";
			write_error($message);
		}
	}

	return $result;
}

function create_new_sale($moment, $sale_date, $description, $amount, $category_id)
{
	$result = false;
	$query = '';

	if (!empty($description) && !empty($amount) && is_numeric($amount) && is_numeric($category_id) && !empty($moment)) {
		if ($moment === 'now') {
			$query = "INSERT INTO sale(description, amount) VALUES (:description, :amount)";
		} else {
			$query = "INSERT INTO sale(sale_date, description, amount) VALUES (:sale_date, :description, :amount)";
		}

		$amount = floatval($amount);
		$category_id = intval($category_id);
		try {
			$conn = get_connection();
			$conn->beginTransaction();

			//Se prepara la sentencia para agrear la venta
			$stmt = $conn->prepare($query);

			if ($stmt) {
				$stmt->bindParam(':description', $description, PDO::PARAM_STR);
				$stmt->bindParam(':amount', $amount, PDO::PARAM_STR);
				if ($moment !== 'now') {
					$stmt->bindParam(':sale_date', $sale_date, PDO::PARAM_STR);
				}

				$stmt->execute();

				//Recupero el id de la ultima transaccion
				$last_id = $conn->lastInsertId();

				//Se prepara la segunda peticion
				$stmt = $conn->prepare("INSERT INTO sale_has_category(sale_id, category_id) VALUES (:sale_id, :category_id)");

				if ($stmt) {
					$stmt->bindParam(':sale_id', $last_id, PDO::PARAM_INT);
					$stmt->bindParam(':category_id', $category_id, PDO::PARAM_INT);
					$stmt->execute();

					//Ahora se procede a actualizar el registro de usuario
					$user_id = $_SESSION['user_id'];
					$conn->query("INSERT INTO user_log (user_id, log_description) VALUES ($user_id, 'Se regitró una venta el $sale_date')");

					$conn->commit();
					$result = true;
				} else {
					$message = "No se pudo preparar la peticion 2 [create_new_sale]";
					write_error($message);
					$conn->rollBack();
				}
			} else {
				$message = "No se pudo preparar la peticion 1 [create_new_sale]";
				write_error($message);
				$conn->rollBack();
			}
		} catch (PDOException $e) {
			$message = "Error: Al intentar crear nueva venta: {$e->getMessage()}";
			write_error($message);
		}
	} //Fin de la validacion

	return $result;
} //Fin del metodo

function get_category_sales()
{
	$categories = [];
	try {
		$conn = get_connection();
		$stmt = $conn->query('SELECT * FROM sale_category');

		while ($row = $stmt->fetch()) {
			$category_id = intval($row['category_id']);
			$category_name = htmlspecialchars_decode($row['name']);
			$totalAmount = 0;
			$averageSale = 0;
			$sales = get_sales_of_category($category_id);
			$saleCount = 0;

			foreach ($sales as $sale) {
				$totalAmount += $sale['amount'];
				$saleCount++;
			}

			if ($saleCount > 0) {
				$averageSale = $totalAmount / $saleCount;
			}

			$categories[] = [
				'id' => $category_id,
				'name' => $category_name,
				'totalAmount' => $totalAmount,
				'averageSale' => $averageSale,
				'sales' => $sales
			];
		}
	} catch (PDOException $e) {
		$message = "Error al intentar recuperar las categorías: {$e->getMessage()}";
		write_error($message);
	}

	return $categories;
}

function get_sales_of_category($category_id)
{
	$sales = [];
	try {
		$conn = get_connection();
		$stmt = $conn->query("SELECT t1.sale_id, t1.sale_date, t1.description, t1.amount FROM sale AS t1 JOIN sale_has_category AS t2 ON t2.category_id = $category_id AND t2.sale_id = t1.sale_id ORDER BY t1.sale_date DESC");

		while ($row = $stmt->fetch()) {
			$sale_id = intval($row['sale_id']);
			$sale_date = $row['sale_date'];
			$description = htmlspecialchars_decode($row['description']);
			$amount = floatval($row['amount']);

			$sales[] = [
				'id' => $sale_id,
				'saleDate' => $sale_date,
				'description' => $description,
				'amount' => $amount
			];
		}
	} catch (PDOException $e) {
		$message = "Error al intentar recuperar las categorías: {$e->getMessage()}";
		write_error($message);
	}

	return $sales;
}

function get_sales()
{
	$sales = [];
	try {
		$conn = get_connection();
		$stmt = $conn->query("SELECT * FROM sale ORDER BY sale_date DESC");
		while ($row = $stmt->fetch()) {
			$sale_id = intval($row['sale_id']);
			$date = $row['sale_date'];
			$description = htmlspecialchars_decode($row['description']);
			$amount = floatval($row['amount']);

			$sales[] = [
				'id' => $sale_id,
				'saleDate' => $date,
				'description' => $description,
				'amount' => $amount
			];
		}
	} catch (PDOException $e) {
		$message = "Error al intentar recuperar las ventas: {$e->getMessage()}";
		write_error($message);
	}

	return $sales;
}

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

function validate_date($date)
{
	$values = explode('-', $date);
	if (3 === count($values) && checkdate($values[1], $values[2], $values[0])) {
		return true;
	}

	return false;
}

function update_user_log($message)
{
}
