<?php
require '../includes/functions.php';
if (session_active()) {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if (
            isset($_POST['first_name']) && isset($_POST['last_name']) &&
            isset($_POST['nit']) && isset($_POST['phone']) &&
            isset($_POST['email'])
        ) {

            $firts_name = htmlspecialchars($_POST['first_name']);
            $last_name = htmlspecialchars($_POST['last_name']);
            $nit = htmlspecialchars($_POST['nit']);
            $phoner = htmlspecialchars($_POST['phone']);
            $email = htmlspecialchars($_POST['email']);

            $request = create_new_customer($firts_name, $last_name, $nit, $phoner, $email);

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