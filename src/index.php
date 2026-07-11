<?php
session_start();
header('Content-Type: application/json');

require 'db.php';

$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if ($path === '/api/register' && $method === 'POST') {
    echo json_encode(["message" => "Registration endpoint ready"]);
} 
elseif ($path === '/api/login' && $method === 'POST') {
    echo json_encode(["message" => "Login endpoint ready"]);
}
elseif ($path === '/api/recipes' && $method === 'POST') {
    // Itt valósul meg a SCRUM-7: Create Recipe
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized"]);
        exit;
    }
    echo json_encode(["message" => "Recipe creation endpoint ready"]);
}
elseif ($path === '/api/logout' && $method === 'POST') {
    session_destroy();
    echo json_encode(["message" => "Logged out successfully"]);
}
else {
    include 'frontend/index.html';
}
?>