<?php
require '../includes/functions.php';

if (session_active()) {
    $result = [
        'sessionActive' => true,
        'customers' => get_all_customers()
    ];

    echo json_encode($result);
}else{
    echo json_encode([
        'sessionActive' => false
    ]);
}//Fin de if-else
