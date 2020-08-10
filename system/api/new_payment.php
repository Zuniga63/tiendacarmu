<?php
require '../includes/functions.php';
if (session_active()) {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if (
            isset($_POST['customer_id']) && isset($_POST['cash']) &&
            isset($_POST['amount'])  && isset($_POST['date'])
        ) {
            $customer_id = htmlspecialchars($_POST['customer_id']);
            $cash = htmlspecialchars($_POST['cash']);
            $amount = htmlspecialchars($_POST['amount']);
            $date = htmlspecialchars($_POST['date']);

            $request = create_new_payment($customer_id, $cash, $amount, $date);
            $customer = null;
            if ($request) {
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