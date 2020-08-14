<?php
require '../../includes/functions.php';
if (session_active()) {
  if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['customer_id'])) {
      $customer_id = htmlspecialchars($_POST['customer_id']);
      $request = delete_customer($customer_id);
      $result = [
        'sessionActive' => true,
        'request' => $request,
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
    'sessionActive' => false,
    'message' => 'Se debe recargar la pag'
  ];

  echo json_encode($result);
}
