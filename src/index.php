<?php
declare(strict_types=1);

session_start();
require 'db.php';

$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if (strpos($path, '/api/') === 0) {
    header('Content-Type: application/json');
    
    if ($path === '/api/register' && $method === 'POST') {
        $username   = $_POST['username'] ?? '';
        $first_name = $_POST['first_name'] ?? '';
        $last_name  = $_POST['last_name'] ?? '';
        $email      = $_POST['email'] ?? '';
        $password   = $_POST['password'] ?? '';

        $password_hash = password_hash($password, PASSWORD_DEFAULT);

        try {
            $stmt = $pdo->prepare("INSERT INTO users (username, first_name, last_name, email, password_hash) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$username, $first_name, $last_name, $email, $password_hash]);
            
            echo json_encode(["message" => "Sikeres regisztráció!"]);
        } catch (\PDOException $e) {
            http_response_code(400);
            echo json_encode(["error" => "A felhasználónév vagy az e-mail cím már foglalt!"]);
        }
        exit;
    }
    
    elseif ($path === '/api/login' && $method === 'POST') {
        $username = $_POST['username'] ?? '';
        $password = $_POST['password'] ?? '';

        try {
            $stmt = $pdo->prepare("SELECT id, password_hash FROM users WHERE username = ?");
            $stmt->execute([$username]);
            $user = $stmt->fetch();

            if ($user && password_verify($password, $user['password_hash'])) {
                $_SESSION['user_id'] = $user['id'];
                
                echo json_encode(["message" => "You are logged in!"]);
            } else {
                http_response_code(401);
                echo json_encode(["error" => "Incorrect username or password!"]);
            }
        } catch (\PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Error during login."]);
        }
        exit;
    }

    elseif ($path === '/api/logout' && $method === 'POST') {
        session_destroy();
        echo json_encode(["message" => "Logged out"]);
        exit;
    }
    elseif ($path === '/api/recipes' && $method === 'POST') {
        if (!isset($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode(["error" => "Unauthorized"]);
            exit;
        }
        echo json_encode(["message" => "Recipe creation API ready"]);
        exit;
    }
}

if ($path === '/' || $path === '/index.php') {
    if (!isset($_SESSION['user_id'])) {
        header('Location: /view/login.html');
        exit;
    }
    include 'view/index.html';
    exit;
}

http_response_code(404);
echo "404 Not Found";
?>