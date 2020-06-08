<?php
require '../includes/functions.php';

if(session_active()){
    $path = "img/products";
    $result = [
        'items' => get_all_items(),
        'categories' => get_all_categories(),
        'labels' => get_all_labels(),
        'availableImages' => get_available_images('../../', $path)
    ];

    echo json_encode($result);
}else{
    echo 'No tienes permiso para ver esta informacion';
}