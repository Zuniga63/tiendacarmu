<?php
require '../includes/functions.php';
if (session_active()) {
  if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['category_name'])) {
      $category_name = htmlspecialchars($_POST['category_name']);
      $category_name = trim($category_name);
      $request = create_new_category_sale($category_name);
      $categories = [];

      if($request){
        $categories = get_category_sales();
      }

      $result = [
        'sessionActive' => true,
        'request' => $request,
        'categories' => $categories
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
  }
} else {
  $result = [
    'sessionActive' => false
  ];

  echo json_encode($result);
}
