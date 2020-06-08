<?php
require '../includes/functions.php';
if (session_active()) {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if (
            isset($_POST['name']) && isset($_POST['retail_price']) &&
            isset($_POST['stock']) && isset($_POST['ref']) &&
            isset($_POST['barcode']) && isset($_POST['gender']) &&
            isset($_POST['is_new']) && isset($_POST['outstanding']) &&
            isset($_POST['published']) && isset($_POST['description']) &&
            isset($_POST['images_path']) && isset($_POST['categories']) &&
            isset($_POST['labels'])
        ) {

            $name = htmlspecialchars($_POST['name']);
            $retail_price = htmlspecialchars($_POST['retail_price']);
            $stock = htmlspecialchars($_POST['stock']);
            $ref = htmlspecialchars($_POST['ref']);
            $barcode = htmlspecialchars($_POST['barcode']);
            $gender = htmlspecialchars($_POST['gender']);
            $is_new = htmlspecialchars($_POST['is_new']);
            $outstanding = htmlspecialchars($_POST['outstanding']);
            $published = htmlspecialchars($_POST['published']);
            $description = htmlspecialchars($_POST['description']);
            $images_path = json_decode($_POST['images_path']);
            $categories = json_decode($_POST['categories'], true);
            $labels = json_decode($_POST['labels'], true);

            //Se hacen algunas transformaciones
            $is_new = ($is_new === 'true') ? true : false;
            $outstanding = ($outstanding === 'true') ? true : false;
            $published = ($published === 'true') ? true : false;

            //Se recupera la informacion de las imagenes
            $images = [];
            foreach ($images_path as $path_base) {
                //Las imagenes que se quieren agregar tienen que estar dos carpetas hacia arriba
                $path = "../../$path_base";
                if (file_exists($path)) {
                    //Ahora se define si es una imagen
                    if (exif_imagetype($path)) {
                        //Se recupera el ancho y el alto
                        list($width, $height) = getimagesize($path);
                        //Se guarda la informacion
                        $images[] = [
                            'src' => $path_base,
                            'width' => $width,
                            'height' => $height
                        ];
                    } //Fin de if
                } //Fin de if
            } //Fin de foreach

            $request = create_new_item($name, $description, $retail_price, $ref, $barcode, $gender, $stock, $outstanding, $is_new, $published, '', $images, $categories, $labels);

            $result = [
                'sessionActive' => true,
                'request' => $request
            ];

            echo json_encode($result);
        } else {
            $result = [
                'sessionActive' => true,
                'request' => false,
                'message' => 'Datos incompletos'
            ];

            echo json_encode($result);
        }
    } else {
        $result = [
            'sessionActive' => true,
            'request' => false,
            'message' => 'Los datos no se recibieron'
        ];

        echo json_encode($result);
    } //Fin de if-else
} else {
    $result = [
        'sessionActive' => false,
        'message' => 'Se debe recargar la pag'
    ];

    echo json_encode($result);
}//Fin de if-else