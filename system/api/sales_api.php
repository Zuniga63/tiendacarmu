<?php
require '../includes/functions.php';

if (session_active()) {
  if (session_active()) {
    $result = [
      'sessionActive' => true,
      'categories' => get_category_sales(),
      'sales' => get_sales()
    ];

    echo json_encode($result);
  } else {
    echo json_encode([
      'sessionActive' => false
    ]);
  } //Fin de if-else
}
