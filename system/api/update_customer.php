<?php
require '../includes/functions.php';
if (session_active()) {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if (
            isset($_POST['first_name']) && isset($_POST['last_name']) &&
            isset($_POST['nit']) && isset($_POST['phone']) &&
            isset($_POST['email']) && isset($_POST['customer_id'])
        ) {

            $firts_name = htmlspecialchars($_POST['first_name']);
            $last_name = htmlspecialchars($_POST['last_name']);
            $nit = htmlspecialchars($_POST['nit']);
            $phone = htmlspecialchars($_POST['phone']);
            $email = htmlspecialchars($_POST['email']);
            $customer_id = htmlspecialchars($_POST['customer_id']);

            $request = update_customer($customer_id, $firts_name, $last_name, $nit, $phone, $email);

            $customer = null;
            if($request){
                $customer = get_customer($customer_id);
            }       
            $result = [
                'sessionActive' => true,
                'request' => $request,
                'customer' => $customer
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