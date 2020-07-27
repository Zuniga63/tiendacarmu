<?php
require '../includes/functions.php';
if (session_active()) {
  if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['moment'], $_POST['date'], $_POST['category_id'], $_POST['description'], $_POST['amount'])) {
      $moment = htmlspecialchars($_POST['moment']);
      $category_id = htmlspecialchars($_POST['category_id']);
      $description = htmlspecialchars($_POST['description']);
      $amount = htmlspecialchars($_POST['amount']);
      $saleDate = htmlspecialchars($_POST['date']);
      $request = false;
      $message = "";

      if ($moment === 'now' || $moment === "other") {
        $description = trim($description);

        if ($moment === 'now' ||  ($moment !== 'now' && strlen($saleDate) > 8)) {
          $request = create_new_sale($moment, $saleDate, $description, $amount, $category_id);
        }
      }else{
        $message = "moment isn´t now or other: " .  $moment;
      }

      $result = [
        'sessionActive' => true,
        'request' => $request,
        'message' => $message,
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
