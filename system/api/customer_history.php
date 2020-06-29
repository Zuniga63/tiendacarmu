<?php
require '../includes/functions.php';

if (session_active()) {
    $result = [
        'sessionActive' => true,
        'history' => get_customer_history()
    ];

    echo json_encode($result);
}else{
    echo json_encode([
        'sessionActive' => false
    ]);
}//Fin de if-else
