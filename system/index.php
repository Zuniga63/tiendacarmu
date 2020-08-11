<?php
require './includes/functions.php';
validate_session();                     //Si la session no es valida envia al login
go_to_page('customers.php');